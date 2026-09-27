import { jsonSchema, tool } from "ai";

/**
 * WorkHub (Scale Army's task manager) integration: lets the assistant answer
 * "how many overdue tasks do I have?" / "what's due this week?" with live
 * data from WorkHub's assistant API (see WorkHub's docs/assistant-api.md).
 *
 * Enabled when WORKHUB_URL and WORKHUB_API_KEY are set. The tool only ever
 * reads the tasks of the person actually asking — their email comes from
 * their Slack profile (or web login), never from anything typed in the
 * question, so nobody can ask the bot for someone else's tasks.
 */

export interface Asker {
  email: string;
  /** IANA timezone, e.g. "America/New_York", so "today" means their today. */
  tz?: string | null;
}

export const WORKHUB_FILTERS = ["open", "overdue", "today", "week", "no_date", "done_recent"] as const;

export function workhubConfigured(): boolean {
  return !!(process.env.WORKHUB_URL && process.env.WORKHUB_API_KEY);
}

const slackProfiles = new Map<string, Asker>();

/** Why WorkHub lookups aren't available for this message, in plain words (null = they are). */
export function workhubConfigProblem(): string | null {
  const missing = ["WORKHUB_URL", "WORKHUB_API_KEY"].filter((k) => !process.env[k]);
  return missing.length ? `the assistant's server is missing the ${missing.join(" and ")} setting` : null;
}

/**
 * Looks up a Slack user's email + timezone via users.info, and says why when
 * it can't. Needs the bot scopes users:read and users:read.email.
 */
export async function resolveSlackAsker(userId: string | undefined): Promise<{ asker: Asker | null; problem: string | null }> {
  if (!userId) return { asker: null, problem: "Slack didn't say who sent the message" };
  const cached = slackProfiles.get(userId);
  if (cached) return { asker: cached, problem: null };

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return { asker: null, problem: "the assistant's server is missing SLACK_BOT_TOKEN" };
  try {
    const res = await fetch(`https://slack.com/api/users.info?user=${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const json = (await res.json()) as { ok: boolean; error?: string; needed?: string; user?: { tz?: string; profile?: { email?: string } } };
    if (!json.ok) {
      console.error(`Slack users.info failed: ${json.error}${json.needed ? ` (needs ${json.needed})` : ""}`);
      return {
        asker: null,
        problem: json.error === "missing_scope"
          ? `the Slack app is missing the ${json.needed || "users:read"} permission (add it under OAuth & Permissions, then reinstall the app)`
          : `Slack wouldn't share your profile (${json.error})`,
      };
    }
    const email = json.user?.profile?.email;
    if (!email) {
      console.error("Slack users.info returned no email — the app needs the users:read.email scope");
      return { asker: null, problem: "the Slack app can't see your email yet (add the users:read.email permission under OAuth & Permissions, then reinstall the app)" };
    }
    const asker = { email, tz: json.user?.tz ?? null };
    slackProfiles.set(userId, asker);
    return { asker, problem: null };
  } catch (err) {
    console.error("Slack users.info failed", err);
    return { asker: null, problem: "Slack couldn't be reached to check who you are" };
  }
}

/** Kept for callers that only need the asker. */
export async function getSlackAsker(userId: string | undefined): Promise<Asker | null> {
  return (await resolveSlackAsker(userId)).asker;
}

/** Calls WorkHub's /api/assistant/tasks for this person. Never throws — errors come back as { error }. */
export async function fetchWorkhubTasks(asker: Asker, filter: string): Promise<unknown> {
  const base = (process.env.WORKHUB_URL || "").replace(/\/$/, "");
  const params = new URLSearchParams({ email: asker.email, filter, limit: "15" });
  if (asker.tz) params.set("tz", asker.tz);
  try {
    const res = await fetch(`${base}/api/assistant/tasks?${params}`, {
      headers: { Authorization: `Bearer ${process.env.WORKHUB_API_KEY?.trim()}` },
      cache: "no-store",
      redirect: "manual",
    });
    // A redirect means WorkHub sent us to its sign-in page: the deployed
    // WorkHub doesn't have the assistant API yet (or WORKHUB_URL is wrong).
    if (res.status >= 300 && res.status < 400) {
      return { error: "redirected", message: `WorkHub redirected the request (HTTP ${res.status}) instead of answering. Check that WORKHUB_URL is https://sa-work-hub.vercel.app and that WorkHub has been redeployed with the assistant API.` };
    }
    const body = await res.json().catch(() => null);
    if (!res.ok || !body) {
      const why = body?.error === "unauthorized"
        ? "WorkHub rejected the password: WORKHUB_API_KEY here must exactly match ASSISTANT_API_KEY in WorkHub (then redeploy both)."
        : body?.error === "not_configured"
          ? "WorkHub doesn't have ASSISTANT_API_KEY set yet (add it in WorkHub's Vercel settings and redeploy WorkHub)."
          : body?.message || `WorkHub returned HTTP ${res.status}.`;
      console.error(`WorkHub assistant API error: ${res.status} ${body?.error ?? ""}`);
      return { error: body?.error || `http_${res.status}`, message: why };
    }
    return body;
  } catch (err) {
    return { error: "unreachable", message: `Couldn't reach WorkHub: ${err instanceof Error ? err.message : String(err)}` };
  }
}

/** The tool the model can call. `asker` is bound here, so the model never chooses whose tasks to read. */
export function workhubTools(asker: Asker) {
  return {
    get_my_workhub_tasks: tool({
      description:
        "Look up the asking user's own tasks in WorkHub (Scale Army's task manager): open, overdue, due today, due in the next 7 days, without a due date, or completed in the last 7 days. Use for any question about the user's tasks, to-dos, deadlines or workload. Counts for every category are always returned. Not for SOP or policy questions.",
      parameters: jsonSchema<{ filter?: (typeof WORKHUB_FILTERS)[number] }>({
        type: "object",
        properties: {
          filter: {
            type: "string",
            enum: [...WORKHUB_FILTERS],
            description: "Which tasks to list. 'week' = due in the next 7 days; 'done_recent' = completed in the last 7 days. Defaults to 'open'.",
          },
        },
        additionalProperties: false,
      }),
      execute: async ({ filter }) => fetchWorkhubTasks(asker, filter || "open"),
    }),
  };
}

/** Extra system-prompt section, only added when the tool is available. */
export function workhubPromptSection(surface: "slack" | "web"): string {
  const link =
    surface === "slack"
      ? "Link each task title using Slack's link syntax <url|title> (this is the one exception to the plain-text rule — Slack renders it as a clickable title)."
      : "Put each task's url after its title.";
  return `

WorkHub tasks (overrides the "context only" and "I don't know" rules above for this kind of question):
You also have a tool, get_my_workhub_tasks, that reads the asking person's own tasks from WorkHub, Scale Army's task manager. Use it whenever the question is about their tasks, to-dos, assignments, deadlines, workload, what's overdue, due today or this week, or what they recently finished — answer those from the tool, never from the SOP context, and never reply that it isn't covered in the SOP handbook. Choose the filter that fits the question (overdue, today, week, open, no_date, done_recent).
- Lead with the direct answer, usually the count ("You have 3 overdue tasks:"), then list at most 10 tasks, one per line starting with "-": title, project, and due date (plus "N days overdue" when overdue). ${link}
- If there are none, say so in one short line. If the result is truncated, say how many more there are and point to WorkHub (workhubUrl).
- If the tool returns an error: "not_found" means they aren't set up in WorkHub yet — tell them to ask an admin to add them. For any other error, say you couldn't check WorkHub and repeat the tool's "message" word for word, so whoever set this up can see what to fix.
- The tool only covers the asker's own assigned tasks. If they ask about someone else's tasks, say you can only look up their own.`;
}

/** Prompt section for when WorkHub lookups aren't possible, so the answer says why instead of "not in the SOPs". */
export function workhubUnavailableSection(problem: string): string {
  return `

WorkHub tasks: if the question is about the person's own tasks, to-dos, deadlines or what's overdue/due soon, don't say it isn't covered in the SOP handbook. Instead reply in one or two lines: "I can't check your WorkHub tasks right now: ${problem}." and suggest they open WorkHub (${(process.env.WORKHUB_URL || "https://sa-work-hub.vercel.app").replace(/\/$/, "")}/tasks) in the meantime.`;
}

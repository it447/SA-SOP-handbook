import { signIn } from "@/lib/auth";

/**
 * Sign-in page. Offers GitHub OAuth (the intended real login for this
 * dev/eng team) and the Credentials placeholder provider (any non-empty
 * username/password) so the app is testable without real OAuth credentials
 * configured.
 */
export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = searchParams?.callbackUrl || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Scale Army SOP Handbook</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to continue.</p>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: callbackUrl });
          }}
        >
          <button
            type="submit"
            className="w-full rounded bg-gray-900 text-white py-2 text-sm font-medium hover:bg-gray-700 mb-4"
          >
            Sign in with GitHub
          </button>
        </form>

        <div className="text-xs text-gray-400 text-center mb-4">or, for local testing</div>

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("credentials", {
              username: formData.get("username"),
              password: formData.get("password"),
              redirectTo: callbackUrl,
            });
          }}
          className="space-y-3"
        >
          <input
            name="username"
            placeholder="Username"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full rounded border border-gray-300 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Sign in (placeholder credentials)
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          Placeholder login accepts any non-empty username/password — for local development only.
        </p>
      </div>
    </div>
  );
}

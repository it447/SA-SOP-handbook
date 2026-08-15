# Obsidian ↔ GitHub Sync Setup

This repo (`sa-sop-handbook`) is the single source of truth for the Scale Army SOP
Handbook. Obsidian is just an editor on top of it. Follow this once per person —
after setup, editing a note in Obsidian and syncing pushes straight to GitHub, and
pulling brings in everyone else's changes.

If you got here by dragging/uploading files into Obsidian manually: that vault is
**not connected to git**. Any edits you make there only exist on your machine and
won't reach GitHub, and you won't get anyone else's updates either. Redo setup
below starting from a real `git clone`, not a re-upload.

## 1. Clone the repo (don't download a zip, don't drag files in)

```bash
git clone https://github.com/it447/sa-sop-handbook.git
```

Pick a normal folder on your machine, e.g. `~/Documents/sa-sop-handbook`.

## 2. Open the cloned folder as an Obsidian vault

- Obsidian → **Open folder as vault** → select the `sa-sop-handbook` folder you just
  cloned (the one containing `SOPs/` and `README.md`).
- Do **not** create a new vault and copy files in — it must be the actual cloned
  git repo folder, so Obsidian's `.git` folder is the same one git uses.

## 3. Install the Obsidian Git plugin

- Settings → **Community plugins** → turn off Restricted Mode if needed → **Browse**
  → search **"Obsidian Git"** (by Vinzent03) → **Install** → **Enable**.

## 4. Set your git identity and authenticate

If you've never used git on this machine:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@scalearmy.com"
```

Authenticate to GitHub with one of:
- **SSH** (preferred if you already have keys set up) — make sure the repo remote
  uses the `git@github.com:...` SSH URL.
- **Personal Access Token** — GitHub → Settings → Developer settings → Personal
  access tokens → generate one with `repo` scope, use it in place of your password
  when git prompts for credentials.

## 5. Add `.gitignore` entries (only needs doing once, already committed to the repo)

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
```

These are local Obsidian UI state, not content — they shouldn't be synced or
committed by anyone.

## 6. Configure Obsidian Git plugin settings

Settings → **Obsidian Git**:
- **Vault backup interval (minutes)**: `10`–`15` (auto commit-and-sync)
- **Commit-and-sync after stopping file edits**: **on**
- **Merge strategy**: **Merge** (not rebase) — avoids rewriting shared history
- Optionally bind a hotkey for manual "Commit and Sync" (e.g. `Cmd/Ctrl+Shift+S`) to
  force a sync before closing your laptop.

## 7. Verify it worked

- Make a small edit to any file (e.g. add a blank line to a glossary note).
- Run **Obsidian Git: Commit and Sync** (command palette, `Cmd/Ctrl+P`).
- Check GitHub — your commit should show up on the branch within a minute.
- Pull on a second machine (or ask a teammate) and confirm the change appears there.

## For every other team member

Repeat steps 1–6 against this **same repo URL** — everyone edits the same clone,
not separate copies. Two people editing the same file at the same time will
produce a normal git merge conflict; resolve it like any git conflict (Obsidian
Git will show conflict markers in the file).

## Common mistakes to avoid

- ❌ Dragging exported files/uploading into an existing local vault — no git
  history, no sync, defeats the whole point.
- ❌ Creating your own separate GitHub repo/fork instead of using this one.
- ❌ Skipping the `.gitignore` step — leads to noisy diffs and merge conflicts on
  `workspace.json` every session.
- ❌ Using **Rebase** as the merge strategy with multiple editors — rewrites
  history and causes force-push conflicts.

# Hivig web — working agreement

This is the **canonical, Vercel-deployed** Hivig repo (remote:
`git@github.com:Prashant-S29/hiving.git`). Real Sanity CMS is wired in here —
see `HANDOFF.md` and `README.md` for what's live. This repo is the single
source of truth going forward. A separate scaffold that used to live at
`hivig_mvp_scaffold/hivig-web/hivig-web` is retired; do not pull from or push
to it.

## Branching workflow — MANDATORY, no exceptions

Work happens directly on `staging` (no per-task feat/fix branches). `staging`
is synced with `main` before each work session, changes are committed and
pushed straight to `staging`, and a PR from `staging` into `main` carries
them forward for review. Merged `staging` pushes go live at
`staging.hivig.com`.

For every task:

```bash
git checkout main
git pull origin main
git checkout staging

# ...do the work / fix...

git add <files>
git commit -m "..."
git push origin staging

# open (or update) a PR: staging -> main
```

Rules:
- Never commit to `main` directly.
- Always sync `staging` with the latest `main` before starting new work.
- Commit and push directly to `staging` — no intermediate feat/fix branch.
- After pushing, open a PR from `staging` into `main` (or leave the existing
  one open/updated if one's already there) so the dev can review.
- **Never merge the staging -> main PR unless the user explicitly says**
  *"I have reviewed and verified all the changes on staging, now merge the
  PR on main."* That exact confirmation is required every time — no merging
  on inference, no merging because the PR "looks done."

## Repo identity

- Local git identity for Claude-driven commits in this repo:
  `Abi-van-kanobi <abhijeet.singh444@gmail.com>` (set locally, not globally).
- Never use or request the user's actual login password for anything —
  GitHub auth is via SSH/PAT, not password, and never handled in chat.

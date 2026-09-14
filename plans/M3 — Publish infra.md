# M3 — Publish infra

Goal: make the blog auto-deploy on merge to main, and get the two external
credentials (LinkedIn, OmniRoute) into a local `.env`. This is also the
first real Jekyll build gate (M2 deferred local verification here — no Ruby
on the dev machine).

## Tasks

1. **GitHub Actions workflow** — `.github/workflows/deploy.yml` (or similar):
   build the Jekyll site with the `Gemfile` from M2 and deploy to GitHub
   Pages, triggered on push/merge to `main`. Use the official
   `actions/jekyll-build-pages` + `actions/deploy-pages` actions (avoids
   needing a Ruby setup step to match Gemfile exactly).
2. **GitHub Pages source config** — confirm/set the repo's Pages source to
   "GitHub Actions" (not the legacy branch-based `/docs` or `gh-pages`
   deploy), matching the M2-decided project-site hosting mode.
3. **First deploy run** — push to main (or open+merge a PR) and confirm the
   Actions run succeeds and the site is reachable at
   `deadlockua.github.io/Learn_with_me_Digest`. This satisfies M2's deferred
   build-verification gate.
4. **`.env.example`** — commit a template (no real secrets) listing the two
   keys the pipeline needs: `LINKEDIN_ACCESS_TOKEN`, `OMNIROUTE_API_KEY`.
   Confirm `.env` itself stays gitignored (already true from M2).
5. **Owner action — LinkedIn**: create a LinkedIn Developer app, request the
   "Share on LinkedIn" product (`w_member_social` scope), complete OAuth,
   store the resulting token in local `.env`. (Owner-only step — assistant
   cannot do this.)
6. **Owner action — OmniRoute**: obtain an API key, store in local `.env`.
   (Owner-only step.)
7. **Write results back**: mark the two "Remaining build tasks" items in
   HLD.md and Customer_requirements.md as done once the workflow file
   exists and the first Actions deploy succeeds. Owner credential steps
   (5, 6) stay open until the owner confirms — do not mark those done
   without explicit owner confirmation.

## Gate

Do not start M4 (agent roster) until: the Actions deploy workflow exists
and has succeeded at least once. M4's Publisher role also needs the owner's
LinkedIn token in `.env` before it can be exercised for real — flag that as
still-open if tasks 5/6 aren't done by the time M4 starts (M4 can still
implement the *code*, just can't fire a real LinkedIn post without it, and
per the LinkedIn-publish-is-last-step rule, no post fires without a
separate explicit owner go-ahead regardless).

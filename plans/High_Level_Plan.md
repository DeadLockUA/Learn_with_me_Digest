# High_Level_Plan.md

Milestones from current state to a fully operational digest pipeline.
Source of truth for decisions: [Concept.md](Concept.md), [HLD.md](HLD.md),
[Customer_requirements.md](Customer_requirements.md). No open gate items
block start (all three show "None outstanding" as of 2026-09-14).

## M0 — Docs baseline (done)
- AGENTS.md / BEHAVIOUR.md split, Concept.md, HLD.md, Customer_requirements.md agreed.
- Status: complete.

## M1 — Repository structure (done, 2026-09-14)
- Decided: flat files, shared `YYYY-MM-DD-topic-slug` naming — `_posts/`
  (blog), `entries/linkedin/` (short form), `assets/images/entries/` (image).
  Metadata (topic, related_posts) in blog.md front matter. See AGENTS.md §8.
- Folders scaffolded (`.gitkeep` placeholders).
- Status: complete.

## M2 — Jekyll site skeleton (done, 2026-09-14)
- Decided (HLD.md): GitHub Pages project site
  (`deadlockua.github.io/Learn_with_me_Digest`, migration-ready for a custom
  domain later); theme `minima`.
- Scaffolded `_config.yml`, `Gemfile`, `index.md`, `.gitignore`; `entries/`
  and non-post docs excluded from the Jekyll build.
- Deviation (owner): local build verification deferred to M3's first GitHub
  Actions run — no Ruby on the dev machine.
- Status: complete. See [M2 — Jekyll site skeleton.md](M2%20—%20Jekyll%20site%20skeleton.md).

## M3 — Publish infra (done, 2026-09-14)
- GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys Jekyll on
  push to main. First real deploy succeeded — site live at
  https://deadlockua.github.io/Learn_with_me_Digest/.
- Decided (owner): repo made **public** — GitHub Pages isn't available on
  private repos under the account's current plan. Checked history for
  secrets first; none found.
- `.env.example` committed as a template for `LINKEDIN_ACCESS_TOKEN` /
  `OMNIROUTE_API_KEY`; `.env` itself stays gitignored.
- Still open (owner-only, not blocking M4 code): LinkedIn Developer app +
  OAuth, OmniRoute API key — needed before Designer/Publisher can be
  exercised for real.
- Status: complete. See [M3 — Publish infra.md](M3%20—%20Publish%20infra.md).

## M4 — Agent roster implementation (done, 2026-09-14)
- Built as `.claude/agents/{topic-manager,researcher,editor,critic,designer,
  publisher}.md` + an orchestrating Skill (`.claude/skills/digest-entry/`,
  `/digest-entry`) that dispatches them in sequence.
- Wired all four gates: topic → draft/text → image → LinkedIn (the last one
  kept as its own separate stop, never implied by the others).
- Structurally dry-run verified (frontmatter parses, Skill references all
  six roles correctly) — not yet exercised with real content, that's M5.
- Concept.md's stale "Agents & roles" roster (Engineer/Blogger, no Topic
  Manager/Publisher) retired in favor of HLD.md as source of truth.
- Status: complete. See [M4 — Agent roster implementation.md](M4%20—%20Agent%20roster%20implementation.md).

## M5 — Pilot entry (end-to-end dry run)
- Run one entry through the full flow manually, owner in the loop at every gate.
- Verify: sourcing/citation rules (AGENTS.md §6), dual-format output + CTA lines
  (AGENTS.md §3), Critic catches scope-drift/fabrication.
- Decided (owner, 2026-09-14): this pilot's topic/content is `First_Post.png`
  (owner's existing screenshot, root of repo, untracked/not yet committed) —
  first entry of an ongoing series. Topic still needs owner agreement per
  AGENTS.md §2/§4 before drafting starts.

## M6 — Publish verification
- First real merge → confirm GitHub Actions deploy works.
- First real LinkedIn post via API → confirm auth + posting works end-to-end.

## M7 — Steady state
- Recurring ad hoc use: owner runs the entry prompt per topic/batch.
- Topic continuity tracked (open item in Concept.md: durable follow-up list vs.
  owner memory — revisit if it becomes a problem).

## Out of scope for this plan
- Cadence automation (cron/Routine) — explicitly rejected, ad hoc only.
- CMS beyond git + Jekyll.

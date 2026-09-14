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

## M2 — Jekyll site skeleton
- Scaffold Jekyll site, GitHub Pages config.
- Confirm theme/layout minimal enough not to block content work.

## M3 — Publish infra
- Write GitHub Actions workflow: deploy Jekyll on merge to main.
- Owner: create LinkedIn Developer app, get `w_member_social` scope, complete OAuth.
- Owner: obtain OmniRoute API key.
- Both secrets stored in local gitignored `.env`.

## M4 — Agent roster implementation
- Build the six subagent roles (Topic Manager, Researcher, Editor, Critic,
  Designer, Publisher) per HLD.md sequence, dispatched from one driving session.
- Wire gates: topic approval → draft approval → image approval (Customer_requirements.md).

## M5 — Pilot entry (end-to-end dry run)
- Run one entry through the full flow manually, owner in the loop at every gate.
- Verify: sourcing/citation rules (AGENTS.md §6), dual-format output + CTA lines
  (AGENTS.md §3), Critic catches scope-drift/fabrication.

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

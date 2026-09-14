# M5 — Pilot entry (end-to-end dry run)

Goal: run one real entry through the full `/digest-entry` flow built in M4,
owner in the loop at every gate, to validate the pipeline before trusting it
for steady-state use (M7). Per owner decision (2026-09-14), this pilot's
starting point is `First_Post.png` — first of an ongoing series — not a
fresh Topic Manager brainstorm from an empty backlog.

## Tasks

1. **Agree the topic** (AGENTS.md §2/§4 — still required even though the
   image already exists): what's the actual Quality/Development/Testing/AI
   angle behind `First_Post.png`? Owner confirms topic + which of the four
   recurring topics it falls under + how it connects to future entries in
   the series, before drafting starts. This is an owner conversation, not
   something a subagent can decide.
2. **Run `/digest-entry`** with the agreed topic, treating `First_Post.png`
   as the pre-supplied image (skip/short-circuit the Designer generation
   step for this entry only, since the image already exists — confirm with
   owner whether Designer should still run to produce a recommendation, or
   the existing screenshot is used as-is).
3. **Verify each gate actually stops**: topic approval, draft/text approval,
   image approval, LinkedIn approval (separate, last, per the 2026-09-14
   rule) — confirm none auto-continue.
4. **Verify pipeline behavior**:
   - Researcher sources are real and cited (AGENTS.md §6) — no fabricated
     claims/citations.
   - Editor output has both formats (blog `_posts/`, LinkedIn
     `entries/linkedin/`), correct file naming (AGENTS.md §8), and the
     LinkedIn version has the blog link + both standing CTAs (AGENTS.md §3).
   - Critic actually catches at least one seeded issue if the owner wants a
     real stress test (optional — ask owner), otherwise just confirm Critic
     runs and reports before the owner sees the draft.
5. **Save to git** — commit blog + LinkedIn text + image into the M1 layout
   on a feature branch; owner reviews the PR before merge (AGENTS.md §9).
6. **Publish blog** — merge triggers the M3 Actions deploy; confirm the
   entry actually renders on the live site.
7. **LinkedIn publish** — only after the owner's separate, explicit
   go-ahead at that specific gate. If the owner hasn't completed the M3
   LinkedIn OAuth step yet, this task stays blocked/open — do not treat the
   pilot as failed, just note it as the one step still pending real
   credentials.
8. **Write up findings**: anything that broke, felt clunky, or needs a gate
   reworded — feed back into AGENTS.md/HLD.md/the Skill/agent definitions
   before M7 (steady state) relies on this being smooth.

## Gate

Do not start M6 (publish verification, which re-confirms M3/M6 at steady
cadence) until this pilot has gone through every gate at least once with
real owner approvals (LinkedIn publish may remain pending on credentials —
everything else must complete).

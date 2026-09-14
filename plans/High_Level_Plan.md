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

## M5 — Pilot entry (done, 2026-09-14)
- Ran the full pipeline for real: topic-manager proposed "AI-assisted
  testing adds a validation layer" (Testing + AI, grounded in
  `First_Post.png`'s anecdote), owner approved, researcher sourced
  (2 claims, both ≤6 months old per the new recency rule), editor drafted
  both formats, critic sent it back once (missing citation link) then
  approved, owner approved text, designer generated the image (after
  working through 3 broken providers — OmniRoute, direct Gemini — before
  landing on OpenRouter + a 6-model benchmark, winner picked and used),
  owner approved the image, publisher committed + deployed the blog, owner
  gave a final separate go-ahead and the post went live on LinkedIn — see
  the LinkedIn status note below, this did not end up staying live.
- Verified: sourcing/citation rules (AGENTS.md §6) including the recency
  rule, dual-format output + CTA lines + hashtags (AGENTS.md §3), Critic
  caught a real issue, all four gates (topic/draft/image/LinkedIn) stopped
  correctly.
- Process fixes discovered and written back during the run: AI-source
  recency rule, LinkedIn-hashtags rule, Designer's one-candidate-per-round
  + no-trademark prompt rule, OpenRouter model-verification gotcha
  (`/models` catalog unreliable — verify via the dedicated Image API
  directly), blog images needing a body embed with `relative_url` (front
  matter `image:` alone doesn't render, and a bare path 404s under this
  site's baseurl), topic model changed from 4 single-topics
  (Quality/Development/Testing/AI) to 4 multi-topics
  (Development/Testing/AI/Processes), site-wide category nav + filtered
  home page added.
- Two bugs found *after* the first post went live, each required a delete
  + repost: (1) `urn:li:share:7505262619566718977` posted without the
  entry's image — Publisher hadn't implemented image attachment yet;
  (2) `urn:li:share:7505265167035805698` posted with the image but the
  text silently truncated mid-sentence — LinkedIn's `commentary` field is
  parsed as "little" text format, not raw plain text, and an unescaped
  reserved character (a literal `(`) stopped the parser with no error
  (still `201 Created`). Both fixed in `publisher.md` (image-upload flow
  documented; reserved-char escaping required before every post).
- **LinkedIn status as of 2026-09-14: NOT live.** After fixing both bugs,
  the corrected post (`urn:li:share:7505266617694609408`) was confirmed
  live once by the owner, then found gone shortly after (owner reported
  "post not found" in the LinkedIn UI). A same-content repost attempt got
  `422 DUPLICATE_POST` from LinkedIn, referencing yet another URN
  (`urn:li:share:7505268455793717248`) that is *also* not visible in the
  UI — LinkedIn's duplicate-content detection is keying off a hash of the
  deleted content and blocking re-posts, independent of the post's own
  visibility. Likely cause: three create + two delete calls within ~15
  minutes read as automated/spammy to LinkedIn's abuse detection. Owner
  said **stop** — no further repost attempts. Blog post itself is
  unaffected and still live; only the LinkedIn side needs revisiting, not
  before the dedup/abuse-detection window has clearly passed (hours, not
  minutes) and preferably with a real (not cosmetic) reason if the text
  changes at all — don't tweak wording just to dodge the duplicate check.
- Also satisfies M6 (first real deploy + first real LinkedIn post both
  happened during this run) — M6 folded in below, not a separate pass.
- Status: complete. See [M5 — Pilot entry.md](M5%20—%20Pilot%20entry.md).

## M6 — Publish verification (blog done; LinkedIn partial, 2026-09-14)
- First real merge → GitHub Actions deploy confirmed working (multiple
  successful runs during M5). Fully done.
- First real LinkedIn post via API → auth + posting mechanics confirmed
  working (OAuth setup complete, `LINKEDIN_ACCESS_TOKEN` +
  `LINKEDIN_MEMBER_URN` in `.env`, text + image posted successfully via the
  API), but the post itself is **not currently live** — see M5's LinkedIn
  status note. Auth/mechanics verification: done. A post that actually
  stays up: not yet confirmed.

## M7 — Steady state (entered, 2026-09-14)
- M0–M6 all complete; the pipeline is now the tool for ongoing use. This
  milestone has no further build deliverable — it's the operating mode
  going forward, not a one-time task to close out.
- Recurring ad hoc use: owner runs `/digest-entry` (or the equivalent
  prompt) per topic/batch.
- Topic continuity tracked (open item in Concept.md: durable follow-up list
  vs. owner memory — revisit if it becomes a problem).
- Known rough edges to watch for on future entries (all fixed in the agent
  definitions, but worth remembering): image-gen model availability drifts
  on OpenRouter (verify via the dedicated Image API, not the general
  catalog), and LinkedIn's commentary field needs reserved-character
  escaping (`.claude/agents/publisher.md` has the full list).

## Out of scope for this plan
- Cadence automation (cron/Routine) — explicitly rejected, ad hoc only.
- CMS beyond git + Jekyll.

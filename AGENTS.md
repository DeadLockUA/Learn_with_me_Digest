# AGENTS.md — Project Rules for AI Agents

> These rules apply to **any** AI assistant working in this repo (Claude, GPT,
> Gemini, or others) — nothing here is tied to a specific vendor's tool.
> Persona, tone, and output-formatting rules for all assistants live in
> [BEHAVIOUR.md](BEHAVIOUR.md), imported at the bottom of this file. **Keep
> that `@BEHAVIOUR.md` line** — it mechanically inlines those rules into every
> session *and every subagent dispatch* before the first token; a prose
> "read that file" instruction only reaches an agent that chooses to spend a
> `Read` call. Vendor configs (e.g. [CLAUDE.md](CLAUDE.md)) just import this
> file, which in turn imports `BEHAVIOUR.md`.

## 1. Project overview

Learn with me Digest is an AI-written digest of short entries on
**Development, Testing, AI, and Processes**, directed by the repo owner.
Every entry carries one or more of these topics, is published in two
formats (§3), and is drafted by an AI assistant, then reviewed by the
owner before it's considered final.

## 2. Scope

- Four recurring topics only: Development, Testing, AI, Processes (owner,
  2026-09-14 — Processes replaces the earlier Quality topic).
- An entry can carry more than one topic when it genuinely spans them (e.g.
  a Testing entry that also touches AI) — decided owner, 2026-09-14. Don't
  tag a topic onto an entry it doesn't substantively address just for
  visibility; multi-topic is for entries that actually span the topics, not
  a way to cross-post.
- Topics aren't picked in isolation — each one should connect to other
  entries (follow-up, contrast, deeper dive). When a topic is agreed, sketch
  how it could branch into further entries, not just the one at hand.
- Before drafting the "Where this goes next" continuity section, Editor
  stops and proposes 6 candidate follow-up topics to the owner for the
  owner to pick from (owner, 2026-09-14) — not just writes them
  unilaterally. The 6 split into two groups of 3: (a) topics that resolve,
  or push toward resolving, a question the current entry raised but didn't
  answer; (b) topics the current entry spawns, in the same or an adjacent
  topic area. The owner picks which of the 6 (any number) go into the
  section; Editor drafts it from that selection, not from its own 6.
- Any topic proposal to the owner (Topic Manager's initial proposal, or
  Editor's 6 "Where this goes next" candidates) uses this format per topic,
  not a bare one-liner (owner, 2026-09-14): a short title, an essence line
  naming the actual problem, and a framing-angle line on how to unpack it.
  Style: exposing/revealing a real, often under-discussed problem — not a
  neutral survey question.
- New topic ideas are agreed with the owner before drafting. Raw, unrefined
  ideas are captured in [Themas.md](Themas.md); it's a scratch backlog, not
  agreed topics. (For *how* entries get produced — tools, agents, workflow —
  see [Concept.md](Concept.md); it doesn't track topic ideas either.)
- Explicit continuation posts (owner, 2026-09-14, blog only — not
  LinkedIn): when the owner explicitly flags a new entry as a continuation
  of a prior post, the new blog entry must open by naming that link (e.g.
  "The last post raised the question of..."), and the prior post must be
  edited to add a link forward to the new entry — so the connection is
  two-way, not just the new post pointing back. Use `related_posts` (§8)
  on both posts for this.

## 3. Publishing channels

Every entry is published in two formats:

- **Long** — the full entry, on the personal blog.
- **Short** — a condensed version for LinkedIn.

Rules:

- The LinkedIn version always links back to the long-form blog entry.
- The LinkedIn version always closes with two standing invitations: to ask
  questions (e.g. "always happy to answer questions within my knowledge")
  and to request topics (e.g. "if there's a specific topic you want covered,
  comment and we'll dig into it next time"). Exact wording can vary per post;
  both must be present.
- The LinkedIn version includes hashtags to help reach (owner, 2026-09-14).
  Tags are picked per entry — specific and on-topic (recurring topic +
  entry angle), not a copy-pasted boilerplate set reused across posts.
- The LinkedIn version is plain text, never Markdown (owner, 2026-09-14) —
  LinkedIn's API doesn't render Markdown; `**bold**`, `_italic_`, `# headers`,
  etc. post as literal characters. No Markdown syntax anywhere in the
  LinkedIn file, including in list bullets/CTAs.

## 4. Content workflow

1. Agree a topic/subtopic with the owner, including how it connects to other
   entries (§2).
2. Research and verify claims before drafting — don't write from assumption.
3. Draft both formats (§3) following the style guide (§5).
4. Flag anything uncertain or opinion-based instead of stating it as fact.
5. Get the owner's review before treating either format as final.

## 5. Style guide

- Concise and skimmable — short paragraphs, bullet points over prose walls.
- Plain language over jargon; define acronyms on first use.
- Lead with the point, not the setup.
- No filler intros or conclusions ("In today's digest, we'll explore...").
- English only in every file committed to this repo — docs, agent
  definitions, digest entries, everything (owner, 2026-09-14). This holds
  regardless of what language the owner used in conversation to give an
  instruction; translate the substance, don't carry the language into the
  file.

## 6. Sourcing & accuracy

- Cite sources for specific claims, benchmarks, version numbers, or tool
  behavior.
- Never fabricate statistics, quotes, or citations.
- Distinguish fact from opinion explicitly when it isn't obvious from context.
- If a claim can't be verified, say so rather than presenting it as settled.
- Recency (owner, 2026-09-14): fast-moving topics age out quickly — prefer
  sources no older than 3 months, never older than 6. This applies to any
  claim/finding *about AI* (models, tooling, AI-driven results/benchmarks),
  regardless of which of the four recurring topics the entry itself is
  filed under — an AI-adjacent citation inside a Testing/Processes/
  Development entry is still held to this bar. If nothing citable exists
  within 6 months, say so explicitly rather than reaching for an older
  source.

## 7. Open topics gate

- Open questions/dependencies tracked in [Concept.md](Concept.md),
  [HLD.md](HLD.md), and [Customer_requirements.md](Customer_requirements.md)
  must be resolved with the owner before implementation work starts.
- "Resolved" means the owner made a decision and it's written back into the
  relevant doc — not just discussed.
- If new open questions surface mid-implementation, stop and get them
  resolved before continuing.

## 8. Repository structure

Decided (owner, 2026-09-14): flat files, shared naming per entry
`YYYY-MM-DD-topic-slug`, no per-entry folder.

- Blog (long form) — `_posts/YYYY-MM-DD-topic-slug.md`, standard Jekyll post.
  Metadata lives in its YAML front matter — the single source of truth for
  entry metadata: `topics` (array, one or more of `development`/`testing`/
  `ai`/`processes`, lowercase — owner, 2026-09-14, replaces the old
  singular `topic` field) and `related_posts` for continuity per §2.
- LinkedIn (short form) — `entries/linkedin/YYYY-MM-DD-topic-slug.md`, plain
  file, not built by Jekyll.
- Image — `assets/images/entries/YYYY-MM-DD-topic-slug.<ext>`.

## 9. Git workflow

- Work on a feature branch per entry or per batch of related entries.
- Write clear, descriptive commit messages.
- Changes are reviewed by the repo owner before merging.

## 10. Prefix canary

- After the [BEHAVIOUR.md](BEHAVIOUR.md) model-name prefix, append
  `Learn_with_me_Digest: `, e.g. `Sonnet 5 - Learn_with_me_Digest: `. This
  confirms `AGENTS.md` itself loaded (as opposed to only `BEHAVIOUR.md` via
  the import chain).

@BEHAVIOUR.md

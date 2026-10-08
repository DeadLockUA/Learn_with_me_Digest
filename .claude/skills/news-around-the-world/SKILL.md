---
name: news-around-the-world
description: Build today's "News Around the World" page — a short, thesis-style roundup of what today's items are from the sources listed in resources.md. Use when the owner asks to run/update "News Around the World", or invokes /news-around-the-world.
---

# News Around the World

Produces one page per day at `_news/YYYY-MM-DD.md`, listed on the blog's
"News Around the World" tab (`news.md`). This is a source roundup, not a
digest entry — it does not go through the six-role pipeline
(`digest-entry` skill) and does not touch LinkedIn.

## Scope

- Covers every source in [resources.md](../../../resources.md): the
  Officials block, all four topic blocks (Testing, Development, AI,
  Processes) plus the General (cross-topic) block.
- **Officials say:** — official announcements from the vendors of the two
  coding agents used here, Claude (Anthropic) and Codex (OpenAI): new
  models, new features, notable docs/blog posts. Rules specific to it:
  - Codex changelog is shared with ChatGPT — keep only Codex items (CLI,
    IDE extension, cloud, Codex models); skip ChatGPT-app-only entries.
  - Vendor news pages: keep only model launches and items relevant to
    Claude/Claude Code or Codex — not policy, hiring, or company news.
  - Claude "What's new" is a weekly digest without a per-day date: include
    a week's entry on the first run where it's listed and not already on
    an earlier `_news/` page (grep `_news/` for its week URL first).
  - Patch-level bug-fix noise stays out — one bullet per notable release
    or feature, not per version.
- Only items **published today** (the date this skill runs). If a source
  has nothing today, skip it — do not pad with older items.
- Thesis-style bullets only: one line per item, the core claim/news, not a
  summary paragraph. No commentary, no analysis — that belongs in digest
  entries, not here.
- AI recency rule (AGENTS.md §6) still applies to how AI items are
  characterized, but every item here is today's by definition so this is
  rarely a live concern — flag it only if a source's "today" post is
  itself citing something stale as new.

## Steps

1. **Determine today's date** from the environment (`YYYY-MM-DD`).
2. **Check for an existing page for today** at `_news/YYYY-MM-DD.md`. If
   present, this is a re-run — read it first and add to/update it rather
   than starting over or duplicating entries.
3. **Walk resources.md** top to bottom, one source at a time. For each:
   - Fetch the source (WebFetch/WebSearch as appropriate — blogs via
     WebFetch on the URL, newsletter/aggregator sources via WebSearch
     scoped to the domain and today's date).
   - Identify items published today only. Skip the source silently if
     nothing today — do not report a "nothing found" line per source in
     the page itself (keep the page skimmable); a working note of misses
     is fine for the owner in chat, not in the file.
   - For each item found, write one thesis bullet: the concrete claim, not
     just a headline paraphrase, with a link to the item.
4. **Group bullets by the resources.md block** the source lives in
   (Officials / Testing / Development / AI / Processes / General) — the
   Officials section first, then the four recurring topics (AGENTS.md §2),
   then General for cross-topic sources.
5. **Write the page** using the template below to
   `_news/YYYY-MM-DD.md`. English only (AGENTS.md §5), no exceptions.
6. **No owner approval gate required** — this is a source roundup, not an
   authored entry; the digest-entry approval gates (topic/draft/image/
   LinkedIn) don't apply. Still show the owner the finished page/diff
   before committing, since git changes are reviewed before merge
   (AGENTS.md §9).
7. **Commit** directly (feature branch or same day-of batch, per AGENTS.md
   §9) — no image, no LinkedIn post, no Jekyll-triggering concerns beyond
   the normal deploy on merge.

## Page template

```markdown
---
title: "News Around the World — YYYY-MM-DD"
date: YYYY-MM-DD
---

## Officials say:

- [Claude Code — What's new](url) — one-line thesis of the release/feature.

## Testing

- [Source Name](url) — one-line thesis of the item.

## Development

- ...

## AI

- ...

## Processes

- ...

## General

- ...
```

Omit a topic section entirely if no source in that block had anything
today — don't leave an empty heading.

## Notes

- Filename **must** be `YYYY-MM-DD.md` (matches Jekyll collection date
  parsing and `/news/:name/` permalink in `_config.yml`).
- This skill does not add or remove sources from resources.md — that list
  is curated separately per its own selection bar.
- Not part of the `digest-entry` pipeline; run standalone, any day, as
  often as the owner wants (typically once per day).

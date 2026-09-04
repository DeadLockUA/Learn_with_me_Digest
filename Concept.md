# Concept.md

Ideas under consideration — not yet implemented, not commitments. Move an
idea out of here into an actual entry/structure once it's picked up
(see [AGENTS.md](AGENTS.md) §3).

## Content structure ideas

- `digests/<topic>/<YYYY-MM-DD>-<slug>.md` — one file per entry, grouped by
  topic folder.
- vs. a flat `digests/<YYYY-MM-DD>-<topic>-<slug>.md` with topic in the
  filename instead of a folder — simpler, sorts chronologically by default.
- An `index.md` (or generated index) per topic listing entries in order.
- Front-matter per entry (topic, date, tags, sources) if the digest ever gets
  rendered as a static site or feed.

## Format / template ideas

- A short entry template: hook → core point → why it matters → source(s).
- A "TL;DR" line at the top of every entry for skimmability.
- Consistent length target (e.g. 200–400 words) to keep entries digest-sized
  rather than full articles.

## Topic backlog (subtopics to draft)

- **Quality**: what "quality" means beyond bug counts, shift-left QA, quality
  gates in CI, definition of done.
- **Development**: code review practices, trunk-based development, technical
  debt triage, dev environment reproducibility.
- **Testing**: test pyramid vs. testing trophy, flaky test triage, contract
  testing, property-based testing.
- **AI**: agentic coding workflows, prompt/context engineering, evaluating AI
  output quality, AI in the QA/testing loop.

## Automation ideas

- A scheduled trigger/routine that proposes the next digest topic on a
  cadence (e.g. weekly) for review before drafting.
- A lightweight review checklist bot step: sources present? topic scoped to
  one subject? claims verified?
- Optional: RSS/Atom feed generation once there's enough content to justify
  it.

## Open questions

- Publishing target: stays as markdown in this repo, or gets rendered
  somewhere (static site, newsletter)?
- Cadence: fixed schedule vs. ad hoc as topics come up?
- Review process: owner review per entry, or batched review per topic?

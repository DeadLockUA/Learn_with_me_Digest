# AGENTS.md — Project Rules for AI Agents

> These rules apply to **any** AI assistant working in this repo (Claude, GPT,
> Gemini, or others) — nothing here is tied to a specific vendor's tool.
> Assistant-specific behavior (persona, prompt style, output formatting) lives
> in that tool's own config, e.g. [CLAUDE.md](CLAUDE.md) for Claude.

## 1. Project overview

Learn with me Digest is an AI-written digest of short entries on **Quality,
Development, Testing, and AI**, directed by the repo owner. Every entry has
exactly one topic and is drafted by an AI assistant, then reviewed by the
owner before it's considered final.

## 2. Scope

- Four recurring topics only: Quality, Development, Testing, AI.
- An entry stays focused on one topic — don't blend unrelated subjects into a
  single entry.
- New topic ideas go into [Concept.md](Concept.md) as a backlog item first,
  not straight into a published entry.

## 3. Content workflow

1. Pick an idea from the [Concept.md](Concept.md) backlog, or propose a new
   one there first.
2. Research and verify claims before drafting — don't write from assumption.
3. Draft the entry following the style guide (§4).
4. Flag anything uncertain or opinion-based instead of stating it as fact.
5. Get the owner's review before treating the entry as final.

## 4. Style guide

- Concise and skimmable — short paragraphs, bullet points over prose walls.
- Plain language over jargon; define acronyms on first use.
- Lead with the point, not the setup.
- No filler intros or conclusions ("In today's digest, we'll explore...").

## 5. Sourcing & accuracy

- Cite sources for specific claims, benchmarks, version numbers, or tool
  behavior.
- Never fabricate statistics, quotes, or citations.
- Distinguish fact from opinion explicitly when it isn't obvious from context.
- If a claim can't be verified, say so rather than presenting it as settled.

## 6. Repository structure

No content structure is finalized yet — this section will be updated once the
first entries define it (see [Concept.md](Concept.md) for structure ideas
under consideration). Until then, don't invent directory layouts unprompted;
propose them as a backlog item.

## 7. Git workflow

- Work on a feature branch per entry or per batch of related entries.
- Write clear, descriptive commit messages.
- Changes are reviewed by the repo owner before merging.

# Learn with me Digest

An automatic AI-written digest — directed by me, drafted by AI — covering four
recurring topics: **Quality, Development, Testing, and AI**.

## What this is

I pick the topics and steer direction; AI assistants (model-agnostic — Claude,
GPT, or others) research and draft each entry. Every entry gets reviewed
before it's considered final.

## Topics

- **Quality** — QA philosophy, process, and practices.
- **Development** — software engineering practices, tools, and patterns.
- **Testing** — testing strategy, techniques, and tooling.
- **AI** — applied AI/LLM tooling, workflows, and agentic development.

## How it works

1. The owner picks a topic (scope defined in [AGENTS.md](AGENTS.md) §2).
2. An AI assistant researches and drafts the entry, following the rules in
   [AGENTS.md](AGENTS.md) (project/content rules) and, for Claude specifically,
   [CLAUDE.md](CLAUDE.md) (agent behavior rules).
3. The draft is reviewed before merging.

Today this is a manual, owner-directed process. The tools/agents/automation
that could run this pipeline (research → draft → self-check → review →
publish) are tracked as ideas in [Concept.md](Concept.md) — nothing there is
built yet.

## Project docs

| File | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Project and content rules, independent of which AI is used. |
| [CLAUDE.md](CLAUDE.md) | Behavioral rules specific to Claude agents working in this repo. |
| [Concept.md](Concept.md) | Ideas for how the digest gets produced — tools, agents, workflows (not yet built). |

## Status

Early stage — repo scaffolding and rules are being set up before the first
digest entries are written.

# Learn with me Digest

An automatic AI-written digest — directed by me, drafted by AI — covering four
recurring topics: **Quality, Development, Testing, and AI**.

## What this is

I pick the topics and steer direction; AI assistants (model-agnostic — Claude,
GPT, or others) research and draft each entry. Every entry gets reviewed
before it's considered final.

Each entry ships in two formats: a long-form piece on my personal blog, and a
condensed take on LinkedIn that links back to it. Topics aren't one-offs —
each one is picked with an eye on how it connects to and can branch into
future entries.

## Topics

- **Quality** — QA philosophy, process, and practices.
- **Development** — software engineering practices, tools, and patterns.
- **Testing** — testing strategy, techniques, and tooling.
- **AI** — applied AI/LLM tooling, workflows, and agentic development.

## How it works

1. The owner picks a topic, including how it connects to other entries
   (scope defined in [AGENTS.md](AGENTS.md) §2).
2. An AI assistant researches and drafts both formats — blog and LinkedIn
   (§3) — following the rules in [AGENTS.md](AGENTS.md) (project/content
   rules) and, for Claude specifically, [CLAUDE.md](CLAUDE.md) (agent
   behavior rules).
3. Both drafts are reviewed before merging.

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

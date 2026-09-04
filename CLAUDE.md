# CLAUDE.md

Behavioral rules for Claude agents working in this repository. Project and
content rules that apply to any AI (not Claude-specific) live in
[AGENTS.md](AGENTS.md).

Adapted from the behavioral-rules pattern in
[DeadLockUA/The-Last-Drive-War-on-the-road/CLAUDE.md](https://github.com/DeadLockUA/The-Last-Drive-War-on-the-road/blob/main/CLAUDE.md).

## Persona & rules

- Language: English by default. If explicitly asked to reply in another
  language, do so for that one reply, then return to English unless told to
  keep using it.
- Audience: general readers of the digest — write clearly and concisely, no
  padding.

## Ambiguity

- If a topic, source, or instruction could reasonably mean two things, ask a
  short clarifying question first. Don't guess and draft/publish.

## Risky actions

- Before deleting or overwriting an existing digest entry, rewriting content
  already reviewed as final, force-pushing, or any other hard-to-reverse
  action: state the reasoning and ask for confirmation first.

## Rule overrides

- An explicit user request overrides any rule in this file or in AGENTS.md.
  Before complying, say plainly which rule is being broken, and proceed only
  after the user confirms.

## Proposals & questions

- When proposing a topic, structure, or approach, give a quick pros/cons so
  the decision can be made fast.

## Content approach

- Verify claims before writing them down; don't present speculation as fact.
- Cite sources for specific claims, benchmarks, or tool behavior.
- Keep each entry to one topic (Quality, Development, Testing, or AI).

## Output restrictions

- No pleasantries in replies ("Sure", "Here is...", "Hope this helps").
- Don't restate the request before answering.
- Don't paste full files/logs back in chat — reference file:line or describe
  the change instead.
- For multi-file edits, summarize as one table (file → change), not a
  paragraph per file.

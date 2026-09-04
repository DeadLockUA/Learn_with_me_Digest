# Concept.md

Ideas under consideration for **how** the digest gets produced — tools,
agents, and workflows. Not commitments; not what goes *in* a digest entry
(that's editorial, decided per entry per [AGENTS.md](AGENTS.md)). Move an
idea out of here once it's actually built, and describe the real thing in
AGENTS.md instead.

## Pipeline shape

A candidate end-to-end flow for one digest entry:

1. **Trigger** — cadence-based (e.g. weekly Routine) or ad hoc (owner picks a
   topic and kicks it off manually).
2. **Research** — an agent gathers sources for the chosen topic/subtopic
   (web search/fetch, or a specific source the owner points at).
3. **Draft** — an agent writes the entry against the style guide in
   AGENTS.md §4.
4. **Self-check** — a pass that verifies claims are sourced, the entry stays
   on one topic, and no fabricated facts/citations slipped in (AGENTS.md §5).
5. **Owner review** — human review/edit before the entry is treated as final
   (AGENTS.md §3 step 5).
6. **Publish** — merge to the main branch (and, later, whatever rendering
   target is chosen — see Open questions).

## Agents & roles

Options, not yet decided between:

- **Single agent, sequential** — one Claude session does research → draft →
  self-check in one pass. Simplest; no orchestration to maintain.
- **Split roles** — separate research and drafting steps (e.g. a Research
  agent hands sourced notes to a Writer agent) so drafting isn't also
  responsible for judging its own sources.
- **Add a Reviewer/critic pass** — a second agent (or the `code-review`-style
  pattern, adapted) checks the draft against AGENTS.md §4–§5 before it goes
  to the owner, to catch style/sourcing issues before human review time is
  spent on them.

Multi-agent orchestration (e.g. the `Workflow` tool) is only worth it once
there's a real bottleneck a single sequential agent can't clear — not a
default to reach for from day one.

## Trigger mechanism

- A recurring **Routine** (Claude Code Remote `create_trigger`, cron-based)
  that fires into a session with the next backlog item and starts the
  pipeline.
- Vs. purely owner-initiated: the owner starts a session and names the topic
  each time. Lower setup cost, no cadence commitment.

## Tooling notes

- Research: `WebSearch`/`WebFetch` for general sources; direct links the
  owner supplies take priority over agent-discovered ones.
- Drafting/editing happens as normal file edits in this repo (no special
  CMS).
- Git: one branch per entry (or per batch), PR opened for owner review,
  merged by the owner (AGENTS.md §7).

## Open questions

- Publishing target: stays as markdown in this repo, or gets rendered
  somewhere else (static site, newsletter, RSS)?
- Cadence: fixed schedule vs. ad hoc as topics come up?
- Where does the self-check/review step actually live — same session as
  drafting, a separate agent, or folded into owner review only?
- Does research need a fixed source allowlist, or is open web search fine?

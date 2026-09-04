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
3. **Draft** — an agent writes both formats (blog + LinkedIn, AGENTS.md §3)
   against the style guide in AGENTS.md §5.
4. **Self-check** — a pass that verifies claims are sourced, the entry stays
   on one topic, and no fabricated facts/citations slipped in (AGENTS.md §6).
5. **Owner review** — human review/edit before either format is treated as
   final (AGENTS.md §4 step 5).
6. **Publish** — merge to the main branch (and, later, whatever rendering
   target is chosen — see Open questions).

## Publishing channels — implementation

The dual-format/cross-link/CTA rules themselves are policy, not an idea —
see AGENTS.md §3. What's still open is how to *build* it:

- Does the Editor draft both formats from one pass, or does drafting the
  long form come first with the short form derived from it?
- Is the LinkedIn CTA line templated (rotate through a fixed set of variants)
  or freshly written per post within the two required functions?
- Where does the cross-link get inserted — placeholder at draft time,
  resolved once the blog URL exists post-publish?

## Topic continuity — implementation

The continuity rule itself is policy — see AGENTS.md §2. Open: does the
follow-up chain get written down anywhere durable (a running list per topic
thread), or does the owner just carry it between sessions for now?

## Agents & roles

Draft roster (not yet built):

- **Editor** — writes and edits the entry (both formats). Output targets the
  public reader, not the owner — it is **not** bound by this repo's own
  house style (CLAUDE.md's terse/no-fluff output rules govern how an agent
  talks to the owner in-session, not the digest content itself).
- **Researcher** — searches the web for sourcing material.
- **Designer** — generates the graphical part of a post. Needs a GPT/OpenAI
  API key wired in.
- **Engineer** — works out a solution/technical answer from given inputs,
  when an entry needs one (e.g. a worked example, a fix, a technique).
- **Blogger** — publishes the finished entry to the blog and to LinkedIn.

Open: single sequential agent doing all of the above vs. split roles vs.
adding a reviewer/critic pass before publish. Multi-agent orchestration
(e.g. the `Workflow` tool) is only worth it once there's a real bottleneck a
single sequential agent can't clear — not a default to reach for from day
one.

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
  merged by the owner (AGENTS.md §8).

## Open questions

- Does this repo hold both formats (long + short), or just the long-form
  source with the LinkedIn version generated at publish time?
- Cadence: fixed schedule vs. ad hoc as topics come up?
- Where does the self-check/review step actually live — same session as
  drafting, a separate agent, or folded into owner review only?
- Does research need a fixed source allowlist, or is open web search fine?
- Designer/GPT key: stored how (env var, secrets manager), and scoped to
  which agent only?

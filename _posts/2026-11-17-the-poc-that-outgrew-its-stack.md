---
layout: post
title: "The Proof of Concept That Outgrew Its Stack: 260,000 Lines, Then an Empty Repository"
date: 2026-11-17
topics: [development, ai, processes]
related_posts: [2026-09-17-a-batch-is-not-an-increment]
image: /assets/images/entries/2026-11-17-the-poc-that-outgrew-its-stack.jpg
---

![A three-panel comic. Panel 1: a yellow rubber duck with AR glasses beside block towers growing from Prototype to a tall tower in two months, with a hologram showing 260,000 lines of code. Panel 2: the tower's small foundation cracks next to a toolbox labelled prototype tools. Panel 3: a tall generic tower on a deep foundation, and the duck with a check mark. Then a Did you know? footer with the GitClear refactoring figure.]({{ "/assets/images/entries/2026-11-17-the-poc-that-outgrew-its-stack.jpg" | relative_url }})

Let me tell you how I spent two months building a game with AI coding agents, reached about
260,000 lines of code, and then started again from an empty repository.

I do not think the idea was the problem. The design was worked out and locked. What
collapsed, as I read it, was what I chose around it in the first days: the architecture, the
language and the tooling. I chose them for a small project. The project did not stay small.

I think this trap is common, and **vibe coding** — building software by prompting an AI
model and accepting most of what it writes — makes it sharper. A proof of concept (POC) is a
small build that only has to show an idea can work. With agents writing the code, it grows
into a big, complex project fast, and nobody decides that it has. The stack — language,
framework, tools — stays the one picked for the POC.

The case is one solo side project of mine. The repository and its planning docs are private,
so I can quote them but not link them. Numbers are rounded.

## A good idea, carefully planned

- The game design was locked in two days, in under ten design passes.
- The process was heavy. Every feature went spec → review → plan → code → tests, run by one
  orchestrating session and about a dozen specialist sub-agents.

This was not careless prompting.

## Three choices, sized for a small project

From my planning docs, in their own words:

- **Language.** Picked as "fast to iterate for a solo dev", with "near-zero ramp-up". A
  faster language stayed as an "escape hatch", for "when profiling says so". The trigger I
  wrote down was runtime speed. The problem that arrived was size.
- **Architecture.** Left "deliberately on the back burner".
- **Save/load.** Planned "deliberately late; cross-cuts everything".

For a small solo project I still find each of these defensible — my opinion. That is what
makes the trap easy to walk into.

## Then it grew, quietly

- The first target was one playable slice: driving, one test track, one-on-one combat.
- About six weeks in, the plan became "100% concept coverage".
- After two months: about 1,900 commits, roughly three in four co-authored by an AI agent.
  About 260,000 lines of code, around half of it tests. More than 80,000 lines of specs and
  planning docs.
- What existed: several modes, AI opponents, maps, a strategy layer with an economy,
  save/load and a prologue.
- What I had played: driving and the core mechanic.

No day looked like the day the POC became a big project. Every feature was finished against
its own spec, so every day looked like progress. An earlier post called this
[a batch, not an increment]({% post_url 2026-09-17-a-batch-is-not-an-increment %}): building
runs ahead of checking.

## Where it stopped holding

| Chosen for a small project | What it became at about 260,000 lines |
|---|---|
| A dynamically typed language (types are checked only when the code runs), quick for one person | No compiler checked types, so only tests could catch type errors — and some passed while checking nothing. |
| Architecture later | Every map was built on one base file of about 5,000 lines, changed in about 160 commits. The AI-opponent file reached about 4,400 lines. More than 40 files ran over 800 lines. |
| Save/load last | When it arrived, it could not save the combat state. |

The tooling did not hold up either:

- **Specs outgrew one agent response.** One spec reached about 600 lines — roughly 56,000
  tokens, the units of text a model reads and writes. The agent tried to rewrite the whole
  file, hit its output limit and was cut off mid-file. It fell back to throwaway patch
  scripts. One spec-revision pass cost about 425,000 tokens.
- **Parallel agents collided in shared files.** From the project's process log: three
  agents were sent into the same copy of the code, on the argument that their file sets did
  not overlap. They converged on the same four files, and one test run had to be discarded
  because the code changed while it ran. The rulebook that tells the agents how to work was
  changed in about 140 commits.
- **A check reported success on a failure.** The engine's start-up check, run without a
  window, passed while a source file had failed to load. The cause was a stale cache.

What is fact here: the file sizes, the cut-off rewrite, the agent collision and the false
pass come from the repository's history and docs. What is inference: that the language
choice itself did the damage. I did not measure it.

## Not only me

Two outside sources point the same way. Neither says how often it happens.

- A mixed-methods preprint ([arXiv 2610.07534](https://arxiv.org/abs/2610.07534),
  2026-10-06; 114 repositories and 15 interviews) reports from its interviews "missing
  constraints forcing the redesign of whole subsystems". One participant "ended up having to
  completely redo like big subsystems". Missing constraints are close to what I call missing
  boundaries — that link is my reading.
- GitClear's
  [maintainability report](https://www.gitclear.com/the_ai_code_quality_maintainability_gap)
  (vendor; undated, with coverage from early July 2026; how it attributes code to AI is not
  stated) puts the share of moved lines — its sign of refactoring — at 21% in 2022 against
  "3.8% year-to-date in 2026". Code gets piled on, not rearranged. That fits my 5,000-line
  base file; it does not prove it.

## What the restart chose instead

- A statically typed language.
- Core logic that runs without the engine, plus thin engine wiring.
- Tests from the first commit.
- A decision log, with locked decisions pinned by tests.
- One large block of work at a time, with a playtest after each.

Two months in, there is still no gameplay and no save/load decision. The list shows what I
chose differently. It does not show that it works.

## Before the first prompt

An AI project needs clear boundaries. Volume and complexity have to be planned into the
architecture and the stack from the start. That is my proposal, drawn from one project:

1. **Draw the boundaries before the first prompt.** Scope, module boundaries, and size
   limits for files and for specs.
2. **Pick the stack for the size the project will reach, not the size of the POC.** With
   vibe coding the growth is fast and quiet. Martin Fowler's
   [Sacrificial Architecture](https://martinfowler.com/bliki/SacrificialArchitecture.html)
   (2014) passes on a rule from Google's Jeff Dean: "design for ~10X growth, but plan to
   rewrite before ~100X". The rule is about system load; using it for project size is my
   stretch.
3. **Make "POC → product" a checkpoint, not a drift.** A dated decision where the stack is
   chosen again. Mine was a change of plan to "100% concept coverage"; the stack stayed as
   it was.
4. **Decide early what is expensive to undo.** For me: the state and save model, the
   boundary between core logic and engine, the language, and the test oracle — the
   observable result that proves a feature works, and who looks at it.

## What it cost

I came away with invaluable experience of how to do this right.

Remarkably, just as I was working on this post, a very old and good friend of mine,
Kostiantyn Pelikhovskyi, raised the identical problem — from the side where he did
everything right. His
[TeleTone case study](https://www.linkedin.com/posts/kpelikhovsky_teletone-casestudy-fractionalcto-share-7526409511394304000-CCc7/)
(LinkedIn, around 2026-11-11) says it in two sentences: "Vibe coding is fast either way.
Whether that speed turns into a product or into a rewrite depends on whether you made the
architecture decisions before the AI started writing code." His is one self-reported case,
like mine.

This is my hobby. So it cost me only a fresh start and two months of a Claude subscription.

Client work is another matter, in my view. There the architecture has to be worked out
properly at the very conception of the project. You do not build a Burj Khalifa on a
foundation laid for a five-storey house.

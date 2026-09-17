---
layout: post
title: "A Batch Is Not an Increment: AI Moves the Bottleneck from Production to Verification"
date: 2026-09-17
topics: [processes, ai]
related_posts: [2026-09-09-estimating-the-triage-line, 2026-09-07-ai-assisted-testing-validation-layer]
image: /assets/images/entries/2026-09-17-a-batch-is-not-an-increment.jpg
---

![A robot pours a large batch of code cards onto a conveyor; the pile stalls at a red section labelled verification, the new bottleneck, while human reviewers work through it]({{ "/assets/images/entries/2026-09-17-a-batch-is-not-an-increment.jpg" | relative_url }})

The last post ([Estimating the Triage Line When There's No Baseline to Size It From]({% post_url 2026-09-09-estimating-the-triage-line %}))
ended with a question: an agent that generates hundreds of tests in one run delivers a batch, not
an increment — so does the story-point/velocity toolkit even apply, or does an autonomous run need
to be estimated more like Waterfall than like Agile?

Short answer: the problem isn't that AI makes estimates wrong. It makes production faster than
verification, so the bottleneck — and with it the economics of the work — moves somewhere the old
metrics weren't designed to measure. In a human-only team — my model, not a measurement —
production and verification run at roughly the same rate, so no queue builds up in front of
review. An agent breaks that balance, and a queue forms in front of verification.

Two posts back, the point was that [AI doesn't remove quality work]({% post_url 2026-09-07-ai-assisted-testing-validation-layer %}).
This post's addition: it can sharply increase the volume that has to be validated, and
that volume arrives as one batch — by default, not by necessity (I correct the last post's wording on that in "The honest gap").

## What "increment" actually assumes

The Scrum Guide (2020) is precise about what an increment is: it "is additive to all prior
Increments and thoroughly verified," and "if a Product Backlog item does not meet the Definition
of Done, it cannot be released or even presented at the Sprint Review." *(Scrum Guide 2020,
scrumguides.org.)*

Note what's *not* in the Scrum Guide: the words "velocity," "story point," or "estimate." Those come
from practice, mostly via Mike Cohn:

- Stories should be small — INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable)
  says they "typically represent at most a few person-weeks worth
  of work." *(Bill Wake, INVEST, 2003.)*
- Planning is: "determine the team's historical average velocity," then "select a number of product
  backlog items equal to that velocity." *(Cohn, Velocity-driven sprint planning, 2018-09-12.)*
- The underlying model is *estimate size, derive duration* — effort tracks the size of the thing
  built. *(Cohn, Agile Estimating and Planning, 2005 — general reference.)*
- And it "works extremely well when teams are relatively stable." *(Cohn, 2023-07-13.)*

Pull those together and the machinery rests on three assumptions:

1. Work arrives as many small items.
2. Effort is roughly proportional to item size.
3. Each item is verified before it counts — "thoroughly verified" is part of the definition, not an
   afterthought.

There's a fourth assumption underneath, and it's the one that matters here: the team that produces
the item is also the team that verifies it, at roughly the same rate. Story points size production.
Velocity built on them only works as a planning number because, in a human-only team, production
and verification capacity were close enough that verification could be bundled in without anyone
measuring it separately. *(That's my framing of why
velocity worked, not a measured fact.)*

An autonomous agent run, as commonly configured, strains the first two assumptions, defers the
third, and breaks the fourth.

## What an agent run actually delivers

By default, one large batch. Three kinds of evidence, all from the last six months, with the
counter-evidence up front.

**Measured pull request (PR) size (mixed picture).** Kraishan (arXiv 2609.17598, 2026-09-12; single-author
preprint, 37,623 PRs across 2,807 repos) reports median changed lines per PR of 495 for Claude
Code, 96 for Cursor, 76 for Copilot, 63 for Codex, 61 for Devin — against 52 for humans. Claude
Code PRs "wait longest for a first human review (median 12.6 hours vs. 1–4 hours elsewhere),
plausibly because its PRs are an order of magnitude larger." **The counter is in the same table:**
four of the five agents sit near human size. Batch shape is agent- and workflow-dependent, not a
law of AI output.

**Practitioner telemetry (directional).** Brodzinski (2026-07-14; two projects)
saw average PR size go from 232 to 817 lines of code (LOC) in the AI-heavy project — "increased by
a factor of 3.5." LinearB's 2026 benchmarks (2026-05-04; vendor telemetry, correlational; 8.1M PRs, ~4,800 teams) put
AI-assisted PR size at 408 vs 157 LOC at the 75th percentile, with agentic pickup at "17.6 hours at
the 75th percentile against 3.4 hours for unassisted."

**Vendors describing their own defaults.** GitHub's engineering blog (2026-08-04) says of coding
agents that one giant PR "is their default way of shipping," and "the large pull request becomes
hard to review—so it just…sits there." Devin's blog (2026-07-30) concedes "the PR itself, however,
is often thousands of lines long across dozens of files." Both are vendor posts, both written to
introduce a stacked-PR feature — but they're a candid description of the default.

The "400 tests in one run" from my last post is an illustration of this shape, not a measured
figure.

## Why the estimate misses

**Story points size production. Once the constraint has moved to verification, the sized quantity
no longer predicts the work at the bottleneck.**

What happens on the verification side, as I'd model it, is a chain:

**batch size → verification queue → cycle time → review quality → rework → actual throughput**

| Link | What the sources say | How strong |
|---|---|---|
| Batch size → queue in front of verification → cycle time | Claude Code PRs wait a median 12.6 h for first review vs 1–4 h elsewhere *(Kraishan, preprint)*. Agentic PR pickup 17.6 h vs 3.4 h at P75 *(LinearB, 2026-05-04)*. "The large pull request becomes hard to review—so it just…sits there" *(GitHub, vendor blog)*. Queue time adds to cycle time by definition. | Correlational telemetry plus a vendor's description of its own default. Direction consistent across three sources; no control group in any of them. |
| Batch size → review quality → rework | SmartBear: "developers should review no more than 200 to 400 lines of code (LOC) at a time," and "a review of 200-400 LOC over 60 to 90 minutes should yield 70-90% defect discovery." Alaswad et al. name "corrective intervention" as a primary effort driver *(peer-reviewed; small N: 22 developers, 110 tasks, 3 large language models (LLMs))*. Peralta et al.: 15.4% of merged agentic PRs "required explicit reviewer involvement through feedback or direct commits" *(arXiv 2605.22534, preprint)*. | The weakest link. SmartBear ties batch size to review quality, but it's not AI-specific and the underlying study figures are SmartBear's own. Alaswad and Peralta show rework happens; neither ties it to review quality or to batch size. |
| Rework and queue → actual throughput | LinearB: "AI pull requests merge within 30 days 32.7% of the time against 84.4% for unassisted." A position paper frames it as a "productivity paradox: as individual productivity increases, team throughput, review capacity, and stability degrade" *(arXiv 2609.00252, 2026-08-31 — argument, not evidence)*. | Vendor telemetry, correlational — AI-heavy PRs may differ in kind, not just size. The position paper is a framing, not a finding. |

Two more pieces:

- **Story points miss this by construction.** Alaswad et al. state that story points "fail to
  capture dominant sources of effort in LLM-assisted workflows," and that "human validation and
  corrective intervention emerge as the primary drivers of effort, outweighing artifact-level
  characteristics." DORA's (DevOps Research and Assessment) ROI report calls it "the verification
  tax imposed by reviewing AI-generated code" *(via InfoQ, 2026-05-11; primary gated)*. The
  points measure the artifact; the effort now sits in the queue behind it.
- **The batch isn't pre-verified either.** Across 86,156 agent-authored test-file patches, 80.2% had
  weak or no explicit oracle signals; "quality gates based on test-file presence overestimate
  verification strength." *(arXiv 2606.18168, 2026-06-16.)* A run that "produced 400 tests" has
  not produced 400 verified tests — the "thoroughly verified" part of the increment definition is
  still owed, and it's owed at the bottleneck.

**Partial counter:** Peralta et al. also found Codex and Cursor PRs merging with minimal
interaction — review burden isn't uniform. Those are the agents with near-human PR sizes, which is
consistent with the burden following batch size, but that's a pattern across two studies, not a
controlled comparison.

So the failure mode isn't a wrong number: velocity is calibrated on production-side size, while the
constraint — and the queue, and the cycle time — now sits at verification.

## This is old batch-size theory with a new trigger

None of this needed AI to be true. Reinertsen's *Principles of Product Development Flow* (2009)
argues that smaller batches accelerate feedback and reduce risk, and that large batches drive
disproportionate cost and schedule growth — with batch size set by the trade-off between
transaction cost (the fixed cost of handling a batch) and holding cost (the cost of work sitting
unfinished). DORA's "Working in small batches" capability page says small batches reduce "the time
it takes to get feedback on changes, making it easier to triage and remediate problems." The
Kanban Guide (2025) frames the whole discipline as "optimize value by optimizing flow."

What's new is not that anyone chose large batches. It's that a single tool invocation now sets the
batch size, and it sets it without regard to transaction or holding cost — the agent pays neither.
A run is nearly free to issue, and the holding cost of the unverified batch lands on the reviewer,
not the producer, so no economic signal reaches the side that sets batch size. The batch overshoots
SmartBear's review limit and lands as WIP — work in progress, started-but-unfinished work — in
front of a verification step whose capacity hasn't changed. The batch is a side effect of the
default, not a plan — and the queue is a side effect of the batch.

## The fix is two-sided

Opinion from here on, labelled as such.

### Before the run: define acceptance criteria

If the batch arrives as one queue, the only lever you hold before it arrives is *what it will be
judged against*. That means writing acceptance criteria — the test set's scope, the oracle each
test must have, the coverage claim it's allowed to make — before the agent starts. Yes, that is a
requirements-up-front step, and yes, it looks Waterfall-shaped. For a batch delivery, I think
that's the correct shape.

Support is thin and I want to be honest about it:

- A qualitative taxonomy of spec-driven agent workflows (Spec Kit, OpenSpec, BMAD and others; arXiv
  2606.04967, 2026-06-03) finds that "persistent artifacts, work contracts, traceability and human
  review become mechanisms that reduce ambiguity" — and flags the risks: "drift between
  specification and code, excessive trust in generated artifacts."
- The same position paper cited above (arXiv 2609.00252 — argument, not evidence) frames specs as
  "the contract substrate between humans and agents."
- **Against:** Böckeler's exploratory evaluation (martinfowler.com, 2026-09-02; small, exploratory, LLM-judged)
  found, for test-driven development (TDD), that "there was no clearly discernable difference based on TDD workflow versus no TDD workflow."
  Test-first isn't the same as criteria-first, but it's the nearest thing to a test of the idea,
  and it came back flat.

No controlled study compares criteria-before-run against no-criteria on validation effort. I'm
recommending the step because it's the only pre-run lever there is, not because the data proves it.

### After the run: re-slice into increments

The batch isn't split by default — but it can be. GitHub's stacked-PR tooling and Devin's PR Stacks
both exist to take one giant agent PR and break it "into a stack of smaller, self-contained PRs,
each one reviewable on its own" *(Devin, 2026-07-30; no outcome data published for the feature itself)*. Whether or not
you use vendor tooling, the process rule is the same: nothing from the batch counts as done until
it's been sliced to a size a human can actually verify — SmartBear's 200–400 LOC is as good a
default as any — and each slice has cleared its acceptance criteria.

In flow terms: slicing makes a WIP limit on review enforceable, and each slice becomes a verified
increment again.

## Back to the estimation pattern

The last post proposed spike → PERT (Program Evaluation and Review Technique) → Rule of Five for
sizing the validation line. Here's how it fits with the batch view (again, opinion):

| Step | What it needs from this post |
|---|---|
| Spike (one batch, fully triaged, timed) | Acceptance criteria written first — otherwise "fully triaged" has no finish line and the spike time is meaningless |
| PERT from the spike | Slice size held constant between spike and production runs, or the spike doesn't transfer |
| Rule of Five re-estimate | Five *slices* of comparable size, not five runs of arbitrary size |

The pattern sizes the validation line — which, in this framing, is sizing the bottleneck. It can
only do that once the batch has defined criteria to validate against and a consistent slice size
to measure. Without those, you're timing how long someone stared at 400 files, which is not an
estimate of anything.

## The honest gap

- **"Production ≈ verification in a human team" is a model, not a measurement.** It's how I explain
  why velocity worked without anyone tracking verification capacity separately. I have no source
  that measured the two rates.
- **Batch size is agent-dependent.** Kraishan's data has four of five agents near human PR size.
  If your workflow uses one of those, the queue problem may be small. Check your own PR sizes and
  pickup times before adopting any of this.
- **The chain is assembled from separate sources.** No single study traces batch size through to
  throughput. Each link has some support; the chain as a whole is my construction.
- **Slicing already exists.** Stacked-PR tooling from at least two vendors re-slices agent output.
  "Isn't split by default" is the defensible claim; "can't be split" is not, and I retract the
  "can't be spread across sprints" wording from the last post.
- **The up-front-criteria step has no controlled evidence.** The nearest experiment (Böckeler,
  test-first vs not) found no difference. The spec-workflow paper is qualitative. Treat the step as
  a reasoned bet.
- **Alaswad is small.** 22 developers, 110 tasks — the nearest peer-reviewed data point, not a
  settled result.
- **Telemetry is correlational.** LinearB and Brodzinski measure teams that chose to use AI heavily;
  no control group, and "AI-assisted" attribution methods vary. The 32.7% vs 84.4% merge figure
  may reflect different kinds of PRs, not just bigger ones. GitHub's and Devin's posts describe a
  default they're selling a fix for.

## Where this goes next

- **Processes / measurement — testing the chain, not just its links:** every link in
  batch size → queue → cycle time → review quality → rework → throughput has partial evidence
  behind it, but the chain as a whole is my construction, and nobody has measured it end to end on
  one team. The angle: list the signals a team already has — PR size, pickup and first-review time,
  cycle time, review comments per PR, follow-up fix commits or reverts, merge rate — and design the
  minimal comparison, before/after an agent rollout or across agents with different default batch
  sizes, that would confirm the chain or break it.
- **Processes / requirements — acceptance criteria are the requirements phase nobody budgets:**
  this post recommends criteria-before-run with no controlled evidence behind it, and the deeper
  problem is that nobody has defined what an acceptance criterion for a *generated test set* even
  contains — scope, oracle, permitted coverage claim — so the step can't be measured because it
  can't be written. The angle: build the artefact — a minimal criteria template for one agent run —
  apply it to a real batch, and report what the output failed on and how long "done" took against
  an unspecified run. One data point beats the current zero.
- **Processes / metrics — verified throughput, a metric that sits at the bottleneck:** the
  candidates lined up to replace velocity — tokens spent, LOC produced, PRs opened — all count
  production, the side that is no longer the constraint, so they reward exactly the batch bloat
  described above. The angle: count what clears verification per unit of human verification
  capacity, show why each current dashboard metric points the other way, and lay out what a team
  would have to log to compute it at all.
- **Processes / AI — which Agile principles survive an agent that doesn't get tired:** small
  batches, sustainable pace, working software as the measure — all assume a human-rate producer.
  Some of those principles protect people; some protect feedback loops; nobody has separated the
  two before porting them to agents. The angle: walk the twelve Manifesto principles one by one, tag
  each as people-protecting or feedback-protecting, and show which ones an agent run silently voids.

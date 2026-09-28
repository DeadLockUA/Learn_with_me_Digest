---
layout: post
title: "Quality per Token: The Tradeoff Nobody Puts on the Invoice"
date: 2026-09-28
topics: [ai, processes]
related_posts: [2026-09-17-a-batch-is-not-an-increment, 2026-09-07-ai-assisted-testing-validation-layer]
image: /assets/images/entries/2026-09-28-quality-per-token.png
---

![Three-panel illustration: a lone robot doing a cheap one-shot run, a chain of agent, critic and retry robots with growing coin stacks, and a robot holding an invoice for cost per verified result]({{ "/assets/images/entries/2026-09-28-quality-per-token.png" | relative_url }})

A single-agent, one-shot run is the cheapest thing you can buy from a model. It is also the
least verified thing you can buy. Every step that raises confidence — a second agent, a
critic, a verifier pass, a retry — multiplies the token bill. Teams budget the cheap run and
ship the expensive one, and the gap never appears on the invoice because the invoice is
denominated in tokens, not in verified results.

The unit that should be on the invoice is **cost per verified result**. Not cost per run, not
cost per task attempted, not tokens per month. And it has to count the verifier's misses,
because a verifier that says "pass" when it shouldn't has cost you money and given you
nothing.

Two earlier posts set this up: [AI-assisted testing adds a validation layer, it doesn't remove
one]({% post_url 2026-09-07-ai-assisted-testing-validation-layer %}), and [a batch is not an
increment]({% post_url 2026-09-17-a-batch-is-not-an-increment %}) — verification is where
the bottleneck moved. This post is about what that bottleneck costs, and why the way most
teams count it hides the number.

## Three prices for the same task

The same task can carry three very different price tags depending on what you count:

| What you count | What it tells you | What it hides |
|---|---|---|
| Cost per run (tokens x price) | What the API bill will say | Whether the output was any good |
| Cost per task, averaged over attempts | How expensive the model is to *use* | Failed attempts are paid for but produce nothing |
| Cost per verified result | What a usable outcome actually costs | Requires a verifier — and the verifier can be wrong |

Leaderboards that publish cost at all, such as Artificial Analysis, report the second. Most
budgets are drawn on the first. Almost nobody reports the third — and the third is the only
one that matches what the business receives.

## "More agents" is not a dial that only goes up

The usual reflex when a one-shot run isn't good enough is to add agents: a planner, a
worker, a critic, a coordinator. That reflex assumes more agents means more quality, and the
only question is how much it costs.

The best recent evidence that this assumption is wrong comes from Google Research (Kim et
al., *Towards a Science of Scaling Agent Systems*, arXiv 2512.08296, v3 2026-04-08). Across
**260 configurations on 6 benchmarks**, the effect of going multi-agent ranged from
**+80.8%** (decomposable finance tasks, centralized coordination) to **-70.0%** (sequential
planning tasks). Same lever, opposite sign, depending on the task shape.

The mechanism is error amplification: in their measurements, independent agents amplified
errors **17.2x**, versus **4.4x** under centralized coordination *(same paper)*. More agents
means more places for an error to enter and more paths for it to propagate — unless something
in the architecture is catching it.

Their predictive model picked the best architecture for **87%** of held-out configurations
*(same paper)*. Read that both ways: the choice is predictable enough to be worth making
deliberately — and unpredictable enough that "just add agents" will be the wrong call for a
meaningful share of tasks.

So the tradeoff isn't "cheap and unverified" versus "expensive and better." Sometimes it's
"cheap and unverified" versus "expensive and worse." That's the version nobody budgets for.

## The unit: cost per successful task

Arize and Fireworks ran the measurement I wish every team ran on its own workload
*(vendor-run study — both companies sell inference or evaluation tooling; "Cost per successful
task", July 2026)*. Setup: **40 Terminal-Bench tasks x 10 models x 6 trials = 2,400 runs,
$626 total**. Their definition of the metric: **total spend across all attempts divided by the
number of successful runs**. Failed attempts count toward the numerator and contribute nothing
to the denominator.

Selected results from that study:

| Model | Pass rate | Cost per success |
|---|---|---|
| gpt-oss-120b | 33% | $0.054 |
| gemini-3.1-flash-lite | 40% | $0.063 |
| GPT-5.5 | 67% | $0.636 |
| Kimi K3 | 66% | $0.670 |

The cheapest model per success had the *worst* pass rate in the table, and still came in
roughly **12x cheaper per success** than GPT-5.5 *(Arize/Fireworks)*. A one-in-three model
that costs almost nothing per attempt beats a two-in-three model that costs a lot per attempt
— if, and only if, you can afford to retry and you can tell which run succeeded.

That conditional is the whole point. The study's own nuance: cheap-per-success works there
because the tasks were retried and **graded deterministically** *(Arize/Fireworks)*. Terminal-Bench
has a test harness that says pass or fail. Your ticket queue doesn't. Take away the
deterministic grader and the "cheap" model's 67% failure rate stops being a retry budget and
becomes 67% of output that somebody has to check by hand — which is exactly the validation
layer from the [2026-09-07 post]({% post_url 2026-09-07-ai-assisted-testing-validation-layer %}).

## Cost per task is not the same number, and the difference is the point

Styles and Miller (*WorkBench Revisited*, arXiv 2606.13715, v2 2026-07-01) report cost per
task alongside completion rate:

| Model | Completion | Cost per task |
|---|---|---|
| Claude Fable 5 | 97.7% | $0.355 |
| Gemini-3.1-pro | 95.5% | $0.076 |
| GPT-5.5 | 94.9% | $0.206 |
| Gemini-3.5-flash | 92.0% | $0.067 |
| DeepSeek-V4-pro | 84.2% | $0.017 |

Their conclusion: "buying the last few points of completion costs roughly an order of
magnitude more per task than settling just below the top of the table" *(Styles & Miller)*.

Note the unit: this is **dollars per task attempted**, not per successful task. The two only
converge when completion is near 100%. At the top of this table they're close — my arithmetic,
not theirs: $0.355 / 0.977 is about $0.36 per success for Fable 5, and $0.017 / 0.842 is about
$0.02 for DeepSeek-V4-pro. At 84% completion the correction is small. At the 33% pass rate in
the Arize table, cost per success is three times cost per attempt. Conflate the two and the
cheap models look cheaper than they are exactly where it matters most.

Two more data points on cost at the top of the table, weaker but consistent:

- Terminal-Bench 4.0 on Artificial Analysis now publishes an average cost per task
  and a score-vs-cost chart — the metric exists on a mainstream leaderboard. Per a third-party
  leaderboard summary *(codingfleet, 2026-09-25; secondary source)*, Codex with GPT-6 Astra
  scored **58.2% at roughly $3.3k** for the full evaluation, against Claude Code with Fable 5.1
  at **57.9% at roughly $6.2k** — the same score at about **2x the cost**.
- One individual blogger's aggregation *(dev.to, levash0v, 2026-07-07; indicative only)* found a
  single task, `pytorch-model-cli`, cost between **$0.001 and $1.47 across 47 successful runs** —
  a 1,109x spread for the same passing result — and that moving from roughly 62% to 87% score
  cost around **10-30x more**.

The shape repeats across three unrelated measurements: the last few points of quality are
priced in multiples, not percentages.

## The verifier is a cost line too — and it can lie

If cost per verified result is the unit, then whatever does the verifying is part of the
cost. The obvious move is to make the verifier cheap. LangChain and Harvey tried exactly that
for legal agents *(vendor blog — LangChain sells the orchestration tooling; "Designing efficient
verifiers for legal agents", 2026-06-02)*:

- Batching verification criteria and switching to open models gave roughly an
  **order-of-magnitude cost reduction**.
- Opus and GPT-5.5 as verifiers agreed with each other **95.7%** of the time.
- DeepSeek v4 Flash as a verifier was **60-1000x cheaper** than the frontier options.

And the bill for that saving:

- Haiku as a verifier had a **false-pass rate of 48.4%** per criterion, and **34.7%** in batch
  mode *(same post)*. Nearly half of the things it should have failed, it passed.
- Batch mode — the cheaper configuration — had lower agreement with the reference than
  per-criterion checking *(same post)*.

A false pass is the worst outcome in the whole pipeline: you paid for the generation, paid
for the verification, and still shipped the defect — now with a stamp on it saying it was
checked. So the cost-per-verified-result formula needs a term for verifier misses. In words:
what you spent, divided by the number of results that were *actually* correct, not the number
the verifier *said* were correct. If your verifier passes 48% of what it should have failed,
your denominator is inflated and your real cost per verified result is much higher than the
dashboard shows.

This is not an argument against cheap verifiers. It's an argument that the verifier's miss
rate has to be measured before its cost saving can be claimed. The Harvey post did measure it;
that's what makes the numbers usable. Most teams don't.

## What to put on the invoice

Opinion from here on, labelled as such.

1. **Budget the configuration you will ship, not the one you demoed.** If the pilot ran
   single-agent one-shot and the production setup has a critic and two retries, the production
   bill is a multiple of the pilot bill. Estimate the multiple before the pilot is approved,
   not after the first month's invoice.
2. **Report cost per verified result, and say what "verified" means.** Deterministic test
   harness, LLM (large language model) judge, human review — each has a different miss rate,
   and the number is meaningless without it.
3. **Measure the verifier before trusting its savings.** Take a sample the verifier passed,
   check it by hand, and record the false-pass rate. The Harvey figures show it can be near 50%
   for a cheap model; assume nothing until you've measured your own.
4. **Treat "add an agent" as an experiment with a sign, not a slider.** The Google data says
   the effect can be -70%. Try the single-agent baseline first, and add coordination only when
   the task decomposes cleanly.
5. **Retry is a cost strategy only where grading is free.** Cheap-per-success models win on
   benchmarks with a harness. If a human is the grader, every retry lands in the verification
   queue from the last post.

## The honest gap

- **Two of the six sources are vendor-run.** Arize/Fireworks sells evaluation and inference;
  LangChain sells orchestration and wrote up a customer. Their numbers are specific and the
  methods are described, but nobody independent has reproduced them.
- **No source computes cost per verified result with verifier misses included.** Arize
  defines cost per success with a deterministic grader; Harvey measures verifier false-pass
  rates. The formula that combines them is my construction, not a published metric.
- **Cost per task and cost per success are from different benchmarks.** WorkBench and
  Terminal-Bench are not comparable task sets; the per-success conversion I did on the
  WorkBench numbers is arithmetic, not a finding of that paper.
- **The Terminal-Bench 4.0 cost comparison is second-hand.** Artificial Analysis publishes
  the metric; the $3.3k vs $6.2k figures come from a third-party summary and I haven't
  verified them against the primary chart.
- **The dev.to aggregation is one person's collection.** Directionally consistent with the
  preprint and vendor data, but not evidence on its own.
- **The Google paper's task categories may not map to yours.** "Decomposable finance tasks"
  and "sequential planning" are their benchmark labels. Whether your workload decomposes is
  something you have to classify yourself, and the 87% predictor is theirs, not a tool you
  can run.
- **A term called "cost-of-pass" exists in the literature.** I'm not citing its figures here;
  the framing in this post rests on the sources above.

## Where this goes next

- **AI / processes — retry-until-pass is a benchmark trick, not a production strategy:** the
  "cheapest per success" result above depends on a deterministic harness and free retries; in
  real work the grader is a human, so every retry is an entry in the verification queue, not a
  free roll of the dice. The angle: take one workload with and without an automated oracle,
  price the retry loop under each, and expose the point where the cheap-model advantage flips
  into a cost.
- **AI / processes — can you tell single- vs multi-agent before you spend the tokens?** the
  Google spread from +80.8% to -70.0% hinges on task decomposability, and their 87% predictor
  isn't something a team can run — so the single-vs-multi choice is made by reflex, not by
  classification. The angle: derive a practical decomposability checklist from the paper's
  task categories, apply it to a real backlog, and show which tickets would have been made
  worse by adding agents.
- **Testing / AI — false pass vs false fail, the asymmetry nobody prices:** cheap verifiers
  trade false fails (rework, visible) for false passes (shipped defects, invisible until later);
  the two errors have very different costs but get reported as one "agreement" number. The
  angle: split verifier error into its two directions, attach a cost to each from incident and
  rework data, and show why "95.7% agreement" can hide an unacceptable false-pass bill.
- **Testing / AI — the leaderboard grades the run; production grades the outcome:**
  score-vs-cost charts now exist on mainstream leaderboards, but the grader is a benchmark
  harness whose definition of "pass" matches no team's Definition of Done — so leaderboard cost
  per task doesn't transfer. The angle: take one leaderboard task, re-grade its "passing" runs
  against a realistic acceptance criterion, and show how much of the published pass rate
  survives.

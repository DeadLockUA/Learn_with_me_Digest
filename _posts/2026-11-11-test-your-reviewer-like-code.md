---
layout: post
title: "Test Your Reviewer Like Code: A Red/Green Corpus for the Checklist"
date: 2026-11-11
topics: [testing, ai]
related_posts: [2026-11-03-update-the-inspectors-checklist, 2026-10-21-false-pass-false-fail]
image: /assets/images/entries/2026-11-11-test-your-reviewer-like-code.jpg
---

![Three-panel comic: a yellow rubber duck with AR glasses asks who checks an AI code reviewer's old rules after a new rule is added, then proposes one bad and one clean code sample per rule, re-run after every change.]({{ "/assets/images/entries/2026-11-11-test-your-reviewer-like-code.jpg" | relative_url }})

An LLM (large language model) reviewer's checklist grows by one line per incident. Nothing
proves that each line still fires. The code has tests, the tests have a reviewer, and the
reviewer's checklist is the one component in the pipeline with no tests of its own.

The fix proposed here: keep a small corpus of known-bad ("red") and known-good ("green")
outputs **per checklist item**, and re-run the reviewer on it after every checklist change.
An item that flags both sides, or neither, is a broken test.

One flag up front. The per-item construction is **this post's own**. I found whole-judge
versions of the idea, and mutation testing for judges, but no source that describes a
red/green pair per checklist line used as a regression gate. Everything in the "construction"
section below is a proposal, not a reported practice.

## The checklist is code that nobody runs

The [inspector's checklist post]({% post_url 2026-11-03-update-the-inspectors-checklist %})
ended with a protocol: fix the checker, hand the original broken output to a fresh reviewer
(it must go red), then hand it the corrected output (it must stay green).

That protocol runs **once**, on the day the line is added. Then the pair is thrown away. The
next incident adds another line, and nobody re-checks the first one.

In code terms: a test written, seen to fail, seen to pass, and then deleted. Three things can
break the line afterwards without anyone noticing:

- **Another line is added.** The prompt the reviewer reads is no longer the prompt the line
  was verified in.
- **The wording is tidied.** Someone merges two items or rephrases one.
- **The model changes underneath.** Li ([arXiv 2606.15474](https://arxiv.org/abs/2606.15474),
  2026-06-13; single-author preprint, abstract only read) puts it as "a silent version bump
  or scoring-prompt update changes how it scores."

## Adding a line changes the other lines

The assumption behind an ever-growing checklist is that items are independent: line 12 does
what it did yesterday, whatever line 13 says. The evidence I found says otherwise — for
judges and rubrics, which is the nearest studied relative of a review checklist.

- **Verdicts depend on which other rubrics are present.** Yu et al.
  ([arXiv 2608.14684](https://arxiv.org/abs/2608.14684), August 2026; preprint, abstract
  only read) judged all rubrics in a single pass and found the verdict on one rubric shifts
  depending on which other rubrics sit beside it. Only about one-third of samples got fully
  consistent verdicts across rubric sets of varying composition.
- **An instruction change moves individual verdicts far more than the total.** Yorke
  ([arXiv 2610.30512](https://arxiv.org/abs/2610.30512), 2026-10-21; single author,
  non-archival NeurIPS 2026 workshop paper, abstract only read) ran a pairwise judge —
  GPT-4.1, pinned version, temperature 0 — over 500 Arena-Hard v2.0 prompts. One instruction
  change (asking for the verdict without reasoning) shifted outcomes on 28.2 percentage
  points more prompts than the average of two unchanged reruns did, and the aggregate fell
  by 4.09 points. Figures are from arXiv v1; the NeurIPS workshop listing reports different
  numbers.

Both are about judges scoring answers, not a reviewer walking a checklist over a pull
request. Carrying them over to "line 13 changes line 12" is my inference.

And here is the gap, stated plainly: **I found no study from the last six months that varies
checklist size for an LLM reviewer** and measures what happens to each item. The closest
evidence is on instructions and constraints, and it does not settle the question — Vasileva
([arXiv 2608.12426](https://arxiv.org/abs/2608.12426), 2026-08-12) found per-constraint pass
rates fall gradually as constraints are added, though the failures were near-independent
(they compound multiplicatively rather than one constraint breaking another); McMillan
([arXiv 2605.10039](https://arxiv.org/abs/2605.10039), 2026-05-11 — exactly at this digest's
six-month recency limit for AI sources) found no detectable effect of file
size. Nobody knows whether your item 12 survived item 13. That is the argument for measuring
it yourself.

## A line can be present and still not be read

The second assumption is that a checklist line makes the reviewer look at the work
differently. For small judges, at least, that is shaky.

Bagaria et al. ([arXiv 2609.02942](https://arxiv.org/abs/2609.02942), 2026-08-31; EMNLP 2026
paper, five pages) ran reversal tests on a 7B-class judge — the one judge the paper names is
Qwen2.5-7B-Instruct:

- **Reverse the response:** the verdict flipped as expected in only 37.7% of cases (186 of
  493; HealthBench).
- **Reverse the rubric criterion:** the desired flip happened in 16.8% of cases on responses
  from Gemma and 32.2% on responses from LLaMA.
- **Hide the response entirely:** a classifier that saw only the rubric text predicted the
  judge's label with 0.826-0.900 accuracy, depending on which of four candidate models
  (Gemma, LLaMA, MedGemma, MedLLaMA) wrote the judged responses.

Read the last one twice. In that setup, much of the verdict was predictable from the
wording of the criterion alone. This is a small judge; I would not generalise the numbers
to a frontier reviewer without data. The failure shape is what matters: a line that produces
a verdict without consulting the thing being reviewed.

Two results from the earlier posts sit on the same axis:

- Zhang, Wang and Lei ([arXiv 2606.10315](https://arxiv.org/abs/2606.10315), 2026-06-09): of
  114 rounds where the judge's note described a real defect, 113 were scored under the wrong
  heading. The reviewer saw it; the *item* did not fire.
- Mohammadi ([arXiv 2609.00038](https://arxiv.org/abs/2609.00038), v1 2026-08-29): same
  model, different instructions and inputs, 34-76% versus 100% on the same four fault types.
  What the reviewer is told and shown decides recall.

On code review specifically, Pan et al. (CRJudgeBench,
[arXiv 2609.37216](https://arxiv.org/abs/2609.37216), 2026-09-29; abstract only read, and
confirmed only on its arXiv page — I found no second, independent record of it) built
1,199 instances from real pull requests (PRs) with expert-verified perturbations, covering
both valid and plausible-but-invalid review comments, and report that "even state-of-the-art general-purpose LLMs
struggle to identify untrustworthy comments." Their own trained judge reached 76.60%
accuracy, 6.13 points above GLM-5.3. That says the task is hard, not that the best models
fail most of the time — the abstract gives no such figure.

## What already exists — and where it stops

The idea of testing the test is old. The idea of testing the judge is recent. Neither goes
down to the single checklist line.

| Practice | What it does | Where it stops |
|---|---|---|
| Mutation testing | Plant small faults in the program; a fault the tests don't catch exposes weak tests | Tests the test suite, not a reviewer |
| Known-answer tests | Fixed inputs with known outputs; an implementation must reproduce them | Deterministic systems |
| Mutation testing of LLM judges | Plant faults in the judged artefact, see if the judge's ranking follows | Red side only, one narrow domain |
| Anchor set for a judge | Fixed human-labelled set, re-scored by the current judge to detect drift | Whole judge, not per item |
| Evaluator alignment set | Share of examples where the evaluator matches a human label | One set per evaluator |

Sources, in table order:

- **Mutation testing.** DeMillo, Lipton and Sayward,
  ["Hints on Test Data Selection: Help for the Practicing Programmer"](https://doi.org/10.1109/C-M.1978.218136),
  IEEE Computer 11(4):34-41, 1978 — the founding paper. The standard survey is Jia and
  Harman,
  ["An Analysis and Survey of the Development of Mutation Testing"](https://doi.org/10.1109/TSE.2010.62),
  IEEE Transactions on Software Engineering 37(5), 2011.
- **Known-answer tests.** NIST's (US National Institute of Standards and Technology)
  [Cryptographic Algorithm Validation Program](https://csrc.nist.gov/Projects/cryptographic-algorithm-validation-program/Block-Ciphers)
  publishes Known Answer Test vectors (fixed inputs with known outputs) used in validating
  cipher implementations. Described from a
  summary of that page, not a close reading. The analogy to a reviewer is mine, and it is
  loose: a cipher is deterministic, a reviewer is not.
- **Mutation testing of judges.** Delcourt et al.
  ([arXiv 2608.14315](https://arxiv.org/abs/2608.14315), 2026-08-14; MODELS 2026, abstract
  only read) applied 11 mutation operators to domain class diagrams across 6 judge
  configurations; the mutation-based ranking was largely consistent with manual assessment.
- **Anchor set.** [Li](https://arxiv.org/abs/2606.15474) again: re-scoring a fixed
  human-labelled anchor set with the current judge detected a version bump in 60 of 60 runs
  and attributed a prompt change in 110 of 120. The baseline it replaces, a rolling z-test,
  false-alarmed on 75% of drift-free streams. This is the closest prior practice I found.
- **Alignment set.** LangSmith's
  [Align Evaluator docs](https://docs.langchain.com/langsmith/improve-judge-evaluator-feedback)
  (undated page, accessed 2026-11-11) define an alignment score as the share of examples
  where the evaluator matches a human expert, and ask for "at least 20 examples," "balanced
  in both 0 and 1 labels." Both sides are present — but as one set per evaluator, not framed
  as a per-item regression gate.

The closest published *wording* for the two failure modes comes from a small open-source
tool for deterministic graders, [evalmut](https://github.com/egnaro9/evalmut) (4 stars when
checked — hobby scale, not an established practice). It names a **blind spot** (a defective
output passes) and a **brittle spot** (a correct output is flagged): "A defect that survives
the grader is a hole in the eval, and so is a correct output it flags."

Those two words are the
[false pass and the false fail]({% post_url 2026-10-21-false-pass-false-fail %}) of the
earlier post, moved from the judge as a whole down to one line of it.

## The construction: one red, one green, per item

Proposal from here on. Mine, untested at scale, labelled as such.

**For every checklist item, store a pair:**

- **Red** — an output that contains the defect the item exists to catch.
- **Green** — the nearest clean version: ideally the same output with only that defect fixed.

The inspector's-checklist protocol already produces both. The red is the original broken
output from the incident; the green is the corrected one. The change is to **stop throwing
them away**.

**After every checklist change — and every model change — re-run the reviewer on the whole
corpus, in a fresh context, and read each item's pair:**

| Red (known-bad) | Green (known-good) | Reading |
|---|---|---|
| Flagged, by this item | Quiet | Works on this pair |
| Quiet | Quiet | Blind spot: the line is decoration. False pass |
| Flagged | Flagged | Brittle spot: the line is armed, not tested. False fail |
| Quiet | Flagged | Inverted: the line reads backwards, or the pair is mislabelled |

Three details that carry the weight:

- **"By this item" matters.** The Zhang case is a reviewer that noticed the defect and
  filed it elsewhere. If the red goes red under a *different* item, the item under test
  still failed. Make the reviewer name the item it is flagging under.
- **The green side is not optional.** Han, Yan and Zhang
  ([arXiv 2608.23941](https://arxiv.org/abs/2608.23941), 2026-08-25): "Catch alone misleads: rejecting
  everything catches everything." A red-only corpus — which is what mutation testing of
  judges gives you — rewards the checklist for getting more eager.
- **The whole corpus, not the new pair.** If the co-presence result from Yu et al. carries
  over, the item most likely to break when you add line 13 is not line 13.

## One run is not a result

A deterministic test fails or passes. A reviewer does neither reliably.

[Yorke](https://arxiv.org/abs/2610.30512) reran the same judge, unchanged, at temperature 0:
the aggregate moved about one point, but the win/tie/loss outcome changed on **21.2% of
prompts** (arXiv v1 figures, as above). The abstract's own line: "A stable aggregate score therefore does not establish
that individual verdicts are repeatable."

A corpus pair is an individual verdict. So a single run cannot tell a broken line from a
noisy one. Feng et al. ([arXiv 2608.16253](https://arxiv.org/abs/2608.16253), v1 2026-08-17;
abstract only read) make the statistical version of the point: the usual prompt-instability
estimator is biased upward at finite repeat budgets, because it mixes within-prompt noise
with between-prompt variation. Applying that to a checklist corpus is my reading, not
theirs.

Practical consequences — opinion:

- **Run each pair several times and record "k of n," not pass/fail.** I would start at
  five. That number is a guess with no source behind it.
- **Treat a flaky item as a finding.** A line that fires three times in five is not a
  check you can lean on; it is a candidate for a deterministic rule or a rewrite.
- **Do not read the corpus as a rate.** One pair per item, five runs each, says the line is
  alive. It does not say how often it catches the defect in the wild. LangSmith's floor of
  20 balanced examples is per evaluator; per item, that budget is rarely realistic.

## What it costs, and what it buys

Costs, honestly — all three are my expectations, not measurements:

- **Reviewer calls.** Items x 2 x repeats, on every checklist change. Thirty items at five
  repeats is 300 reviewer runs.
- **Teaching to the test.** Tune the wording until the corpus goes green and you have a
  checklist fitted to thirty examples. Minimal pairs help; they do not remove the risk.
- **Label debt.** Each pair is one person's judgement of "bad" and "good."

What it buys is a **deletion rule**. A checklist only ever grows because no one can show a
line is dead. An item that sits in the "quiet, quiet" row across repeated runs has shown it.
Fix it or delete it — either way the checklist stops being append-only.

## This repo, again

Same confession format as last time. This digest's reviewer is an LLM agent with a written
checklist:
[`.claude/agents/critic.md`](https://github.com/DeadLockUA/Learn_with_me_Digest/blob/90d47145f589e0d00a29bb37dcc335090bb71a45/.claude/agents/critic.md)
(pinned to the commit discussed below).

On 2026-11-03 it gained item 2b — every citation in a blog post must be a clickable link —
after bare arXiv IDs in plain text were caught in that day's post. The protocol was followed:
the message of
[commit 90d4714](https://github.com/DeadLockUA/Learn_with_me_Digest/commit/90d47145f589e0d00a29bb37dcc335090bb71a45),
which added the rule, records that a blind reviewer "went red on the old post, green on the
fixed one."

Once. The pair is not kept as a corpus; both versions sit in git history, but nothing re-runs
them. The repo contains no corpus files at
all (checked 2026-11-11), so the items that were on the checklist before 2b — fabricated
citations, Markdown in the LinkedIn file, missing invitations — have no pairs either. I do
not know whether adding 2b changed how any of them fire. By this post's own argument, neither
does the reviewer.

## Where this goes next

- **Testing / AI — three out of five is not a pass: the flaky checklist line.** This post
  says "record k of n" and then picks five repeats out of thin air. A reviewer item that
  fires 60% of the time has no agreed status, so in practice it gets rounded up to "works."
  The angle: work out how many repeats it takes to separate a dead line from a noisy one, set
  an explicit threshold, and treat a flaky reviewer item with the playbook already used for
  flaky tests — quarantine it, rewrite it, or demote it to a deterministic check.

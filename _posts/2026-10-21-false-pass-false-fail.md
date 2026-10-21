---
layout: post
title: "False Pass vs False Fail: The Verifier Error Nobody Prices"
date: 2026-10-21
topics: [testing, ai]
related_posts: [2026-09-28-quality-per-token, 2026-09-07-ai-assisted-testing-validation-layer, 2026-09-09-estimating-the-triage-line]
image: /assets/images/entries/2026-10-21-false-pass-false-fail.jpg
---

![Infographic: a 90 percent agreement gauge in the middle hides the split between a false fail on the left, rejected good work billed to the verifier owner today, and a false pass on the right, defective work accepted and billed to support and ops next month; a bottom strip lists what to report instead]({{ "/assets/images/entries/2026-10-21-false-pass-false-fail.jpg" | relative_url }})

An automated verifier — an LLM (large language model) judge, a generated oracle, a cheap
model checking an expensive one — reports one number. Agreement. Accuracy. Pass rate. One
number for two errors that are nothing alike.

A **false fail** rejects a correct result. Somebody reworks it, re-runs it, or overrides the
judge. Visible, immediate, and charged straight to the verifier's account: "the judge is too
strict, it's wasting our time."

A **false pass** accepts a defective result. It ships with a stamp on it. The cost arrives
later — an incident, a support ticket, a customer — and lands on whoever is on call that week.
Nobody traces it back to the judge. The judge's dashboard still says 90%.

The [quality-per-token post]({% post_url 2026-09-28-quality-per-token %}) argued that cost per
verified result has to count the verifier's misses. This post splits those misses into their
two directions, because the two are priced by different people — and one of them is usually
not priced at all. It also leans on the [validation layer]({% post_url 2026-09-07-ai-assisted-testing-validation-layer %})
post: the judge's verdict is itself something that has to be validated, and the direction of
the error decides who ends up doing that.

## One number, two ledgers

| Error direction | What happens | Who sees it | Who pays | Attributed to the judge? |
|---|---|---|---|---|
| False fail (correct result rejected) | Rework, retry, manual override | The team using the judge, today | Same team | Yes — immediately |
| False pass (defect accepted) | Defect ships with a "verified" stamp | Support, ops, customers, later | Someone else's budget | Almost never |

This table is a framework, not a measurement. No source I found prices both directions in
hours or money for an LLM judge; see "The honest gap" below. The asymmetry it rests on is not
a multiplier — it is **who gets charged**. A false fail is debited to the verifier. A false
pass is debited to the incident queue, where it is indistinguishable from any other escaped
defect, and the verifier's record stays clean.

That is why an agreement number can look fine while the false-pass bill is unacceptable: the
number is computed where the false fails live, and the false passes are counted somewhere
else, if at all.

## The direction judges actually err in

For small judges, the evidence points one way. Laddha, Pradhan and Srivastava (*SLMJury*,
arXiv 2606.07810, 2026-06-05) analysed the errors of their top three small-model judges
(Phi-4, Qwen3-8B, Qwen3-14B — 8B-14B parameters, at the short-verdict budget; the paper's
overall range is 0.6B-14B) and report in Appendix D.1 that **"false positives dominate: roughly
60-65% of errors accept an incorrect answer rather than reject a correct one."** That is a
result about small models; I would not generalise it to frontier judges without data.

The same paper shows the direction is **steerable by prompt** (§4.3). A "lenient" persona
dropped LLaMA-3.1-8B from 86.79 to 76.59 (about 10 points, at a 10-token budget) by accepting
wrong answers; a "strict" persona dropped Phi-4-mini from 87.61 to 75.70 (about 12 points, at
an 8,192-token budget) by rejecting correct ones. Two judges, different budgets, comparable
headline drops, opposite error directions, opposite cost profiles. A single accuracy
figure cannot tell them apart.

Zhou (*More Convincing, Not More Correct*, arXiv 2607.05904, 2026-07-07; single-author
preprint) shows what happens when the generator is optimised against a reference-free judge.
On GSM8K with Qwen3, self-play raised the judge's pass rate from **0.72 to 0.94** while true
accuracy stayed at **0.20**. The outputs got more convincing, not more correct — every one of
those extra passes is a false pass. Having the judge solve the problem itself before seeing
the candidate ("blind solving") cut the judge's false-positive rate from **0.719 to 0.012**. A
strict three-judge ensemble, by contrast, still accepted **55%** of bad answers. More judges
is not the fix; a judge with its own ground truth is.

## Zero flagged, twenty-three found

The production case is Zhang, Wang and Lei (*Catching One in Five*, arXiv 2606.10315,
2026-06-09; single-company case study of a food-and-beverage ordering agent, preprint). Their
LLM-as-judge gate on multi-turn transactions:

- In one batch, auto-captured **2 of 9** defect patterns that humans identified.
- In another batch, **flagged zero of 100 rounds** where human review confirmed **23 distinct
  defects**.
- Of 114 rounds whose raw judge note described a confirm-gate or cart-state defect, **113** had
  been scored under "brand voice" instead. The authors call the 0% "a routing-and-wiring
  failure, not blindness" — the judge *saw* the defect and filed it under the wrong heading.
- Where the gate did report a nonzero rate, their estimator implies a **3-6x undercount**,
  which they present as directional.

Two lines from the paper are the whole argument of this post. First: **"A consumer handed a
0% judge rate cannot bound the true rate at all without independent (human) data."** Second:
**"automated judging is a regression floor, not a substitute for human review."**

Note what the paper does *not* do: it discusses misses only. There is no false-alarm cost
anywhere in it. That is the pattern — the false-pass side gets studied once it has already
caused damage; the false-fail side gets felt daily and written up rarely.

## The other direction has a cost too — it just isn't a money cost

Han, Yan and Zhang (*More Rejective, Not More Discriminative*, arXiv 2608.23941, 2026-08-25)
study monitors that review agent actions before execution. They score monitors by
**informedness = catch rate minus false-rejection rate**, for a reason they state plainly in
the abstract: "Catch alone misleads: rejecting everything catches everything."

Their finding on longer review windows: they "make zero-shot monitors more rejective, not
more discriminative." Give the monitor more to look at and it blocks more — both bad actions
and good ones. The cost they identify is operational, not financial: over-blocking reduces
the system's usefulness and can push deployers to **disable oversight altogether**. That is
the false-fail bill at its most expensive — not the rework, but the moment the team turns the
verifier off and the false-pass rate goes to 100%.

Their recommendation is the one I would carry over to any judge: report **clean-control
results** (how many correct inputs the monitor rejects) alongside catch rates. Catch rate
alone is the false-pass number with the false-fail number hidden.

## Why the headline number hides it

Lee, Zeng, Jeong, Sohn and Lee (*How to Correctly Report LLM-as-a-Judge Evaluations*, arXiv
2511.21140, v4 2026-05-31; ICML 2026, peer-reviewed) put it in statistical terms: "imperfect
sensitivity and specificity of the LLM judges induce bias in naive evaluation scores." Their
fix is a bias correction with confidence intervals, built from a **human-labelled calibration
set**. In that paper's framing the positive class is "correct," so sensitivity is one minus
the false-fail rate and specificity is one minus the false-pass rate. The paper's point is that you need both to correct the headline, and a single agreement
figure gives you neither.

A practitioner's version, from Nawaz Dhandala at OneUptime (blog, 2026-08-31; **opinion
piece**, labelled as such): "Report precision and recall for the harmful or failing class";
"A judge with high overall accuracy can still pass nearly every rare unsafe response"; inspect
"false-pass and false-fail rates at the actual release threshold." When the defect class is
rare, overall accuracy is dominated by the easy majority. A judge that passes everything
scores well on a dataset that is mostly fine.

## What a shipped defect costs — and what it doesn't

The folklore number is 100x. The Boehm and Basili list (*Software Defect Reduction Top 10
List*, IEEE Computer 34(1), January 2001) says post-delivery fixes are "often 100 times more
expensive" than early ones — but in the same item adds that for small noncritical systems the
ratio is "more like 5:1 than 100:1." The widely reproduced "IBM Systems Sciences Institute"
chart that puts exact figures on each phase is unsupported folklore (The Register,
2021-07-22, reporting Laurent Bossavit's tracing of the chart to 1987 course-notes citations
with no data behind the figures). And Menzies, Nichols, Shull and Layman
(*Are Delayed Issues Harder to Resolve?*, Empirical Software Engineering 2017, arXiv
1609.04886) looked at 171 projects and found **no consistent evidence** of the delayed-issue
cost effect — with the caveat that all 171 were TSP (Team Software Process) projects, which
may not be typical.

So I am not going to rest this post on "a false pass costs 100x a false fail." The multiplier
is contested and context-dependent. The argument does not need it. It needs only this: a
false fail is charged to the verifier's owner, and a false pass is charged to someone else.
Even at 1:1 in hours, the two are accounted in different ledgers, and only one of those
ledgers ever reaches the decision about whether the judge is good enough.

## An illustrative split

**Hypothetical numbers, chosen to make the arithmetic visible. Not measured.**

Suppose a judge reviews 1,000 outputs, 100 of which are actually defective. It reports 90%
agreement with a human sample. Two judges can produce that same 90%:

| | Judge A (strict) | Judge B (lenient) |
|---|---|---|
| False fails (correct, rejected) | 90 | 10 |
| False passes (defective, accepted) | 10 | 90 |
| Agreement | 90% | 90% |
| Rework visible to the judge's owner | 90 items | 10 items |
| Defects shipped with a "verified" stamp | 10 | 90 |

Judge A looks worse in every meeting about the judge — it generates ninety complaints. Judge
B looks better and ships nine times as many defects. If the per-item costs were equal, B is
still the one whose cost is invisible to the people deciding which judge to keep. If the
shipped-defect cost is any multiple above 1x, B is the expensive one by a wide margin, and the
dashboard says they are identical.

## What to do with this

Opinion from here on, labelled as such.

1. **Report two numbers, never one.** False-pass rate and false-fail rate at the threshold you
   actually ship at. Agreement, accuracy, and pass rate each collapse the two into one and
   lose the direction.
2. **Measure both with a human-labelled set — including the clean cases.** The ICML paper
   needs a calibration set for the correction; the pre-execution oversight paper needs clean
   controls for informedness. Same requirement from two directions: label a sample that
   contains known-good *and* known-bad items, and count errors in each direction.
3. **Route false-pass incidents back to the judge.** When a shipped defect turns out to have
   passed verification, record it against the verifier, not just the feature. Otherwise the
   judge's record stays clean by construction.
4. **Treat a 0% judge rate as "unknown," not "clean."** Per the production case study, a zero
   cannot bound the true rate. If the judge reports nothing, audit by hand before believing it.
5. **Pick the error direction on purpose.** The persona results show the direction is
   steerable. Decide which way you want the judge to lean based on who pays for each error in
   your context — then prompt for it, and re-measure.
6. **Watch for the oversight-off cliff.** If false fails are high enough that people start
   bypassing the judge, the false-pass rate is about to go to 100%. That is a false-fail cost,
   and it belongs in the same discussion.

## The honest gap

- **No source prices both directions.** The cost split in this post is a framework I am
  proposing, not a measured result. The case study measures misses only; the oversight paper
  identifies the false-fail cost as operational and does not quantify it; the SLMJury error
  breakdown is counts, not costs.
- **The illustrative table is invented.** The 90/10 split is chosen to make the point, not
  taken from any dataset.
- **The "false positives dominate" result is for three small judges only** (Phi-4, Qwen3-8B,
  Qwen3-14B, at the short-verdict budget; the paper's full range is 0.6B-14B). Whether
  frontier judges err in the same direction is not established by these sources.
- **The production case study is one company, one agent, one preprint.** Its "3-6x
  undercount" is the authors' own estimator and they call it directional.
- **The self-play paper is single-author and a preprint.** Its numbers are specific and the
  setup is described, but nobody independent has reproduced them.
- **The 100x folklore is contested.** Boehm and Basili give 5:1 for small systems; Menzies et
  al. found no consistent effect; the IBM chart has no data behind it. The argument above
  deliberately does not depend on a multiplier.
- **The OneUptime piece is a practitioner's opinion**, cited as such, not as evidence.

## Where this goes next

- **Testing / AI — ninety percent of whose opinion?** The human-labelled set you would use to
  calibrate a judge is itself one labeller's reading of ambiguous fields, so the "ground truth"
  for the judge's error has its own error. The angle: double-label a sample, measure
  inter-annotator agreement, and see how much of the judge's "error" sits inside the range
  where two humans disagree with each other.
- **Testing / AI — what a zero from the judge actually tells you:** prevalence correction
  breaks down at a 0% judge rate — there is nothing to correct — and the production case
  above shows a zero coexisting with 23 confirmed defects. The angle: work out how big a human
  audit sample is needed to put an upper bound on the true defect rate when the judge reports
  nothing at all.
- **Testing / processes — set the threshold by cost, not by agreement:** judge thresholds get
  tuned to maximise agreement with a reference, which treats both error directions as equal
  when the team's own costs say they aren't. The angle: run one judge at several thresholds
  against a labelled set, price each threshold with the team's false-pass and false-fail
  costs, and see how far the cost-optimal threshold sits from the agreement-optimal one.

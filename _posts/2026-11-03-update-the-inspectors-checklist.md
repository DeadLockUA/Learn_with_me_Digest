---
layout: post
title: "Don't Tell the Model It Was Wrong — Update the Inspector's Checklist"
date: 2026-11-03
topics: [ai, processes]
related_posts: [2026-10-21-false-pass-false-fail, 2026-09-07-ai-assisted-testing-validation-layer, 2026-09-28-quality-per-token]
image: /assets/images/entries/2026-11-03-update-the-inspectors-checklist.jpg
---

![Three-panel pencil illustration of a workshop worker. The Problem: he repeats the same mistake while a status box beside him glows "SUCCESS". Why it happens: yesterday's worker leaves at night, a speech bubble fades, and today's worker arrives with no memory of it. The Fix: an inspector adds a line to a clipboard checklist while the worker keeps working, above three steps — fix the checker, re-check blind, clean version passes. Footer: one extra "please verify" sentence nearly doubled AI error detection, 12% to 22%.]({{ "/assets/images/entries/2026-11-03-update-the-inspectors-checklist.jpg" | relative_url }})

The [last post]({% post_url 2026-10-21-false-pass-false-fail %}) said a false pass should be
charged to the verifier, not the feature. This one is about what you do with the verifier once
it is.

The short version: when an AI assistant gets something wrong, don't correct the assistant.
Correct the thing that was supposed to catch it — silently — and then make a fresh instance
of the assistant find the error on its own. If it can, the fix is in the harness. If it can't,
you only fixed today.

## The worker who forgets every night

Picture a skilled worker who starts a fresh shift every morning and remembers nothing of
yesterday. Competent, fast, and blank. The only thing that survives the night is the
inspector's checklist pinned to the wall.

That is a reasonable picture of a deployed LLM (large language model). The weights don't
change at inference: Dennis et al. ([arXiv 2605.24657](https://arxiv.org/abs/2605.24657), 2026-05-23) describe how "major LLM
platforms deploy models in an inference-only configuration" where "the model serves requests
but never updates per-user weights," so "users must repeatedly re-teach preferences,
corrections, and project context." Anthropic's own docs say the same thing from the tool
side: "Each Claude Code session begins with a fresh context window"
([memory docs](https://code.claude.com/docs/en/memory), accessed 2026-11-03).

This is not "LLMs have no memory." Memory features exist — instruction files, auto-memory,
retrieval. But every one of them is something *around* the model that gets loaded in at the
start of the shift. They are the checklist, not the worker. Which is the point of this post.

So when the worker makes a mistake, there are two moves:

- **Correct the worker.** Show them the error, show them the right way. Today's shift is
  fixed. Tomorrow's worker never met you.
- **Update the checklist.** Add the line the inspector should have checked. Every future shift
  gets inspected against it.

The first move feels productive because the model agrees with you, thanks you, and produces a
correct result right there in the conversation. The second move is the only one that
outlives the conversation.

## Why "showing it the right way" proves nothing

There is a second, quieter problem with correcting the worker: once you have named the error,
the worker finding it is not evidence of anything.

I want to be careful here, because I found no study that tests exactly this — "a model told
about an error finds it trivially." What follows is my reasoning, supported by two proxies:

- **A hint changes what a reviewer finds.** Alharbi ([arXiv 2608.28626](https://arxiv.org/abs/2608.28626), 2026-07-31) planted
  145 errors in documents and measured detection: 12.1% under natural prompting, 22.2% when
  a single verification sentence was added. One sentence nearly doubled the catch rate. If a
  generic "please verify" does that, it is hard to see how a specific "you missed X" would do
  less — that last step is my inference, not the paper's.
- **Who the error is attributed to changes whether it gets corrected.** Chen et al. ([arXiv 2606.05976](https://arxiv.org/abs/2606.05976), v1 2026-06-04, v2 2026-07-31) took the same erroneous claim and relabelled it
  from the model's own reasoning to an external role — user, tool, memory. Explicit correction
  rose by 23 to 93 percentage points, significant in 10 of 12 settings. The model's behaviour
  toward an error depends heavily on how the error arrived in context.

Put the two together and the conclusion I draw is: a model that has just been told "line 40
is wrong" and then says "yes, line 40 is wrong" has demonstrated reading comprehension. It
has not demonstrated that anything would catch line 40 next time. Treat that as inference,
not proof.

## Three rungs of checklist

"Update the checklist" covers three very different things. They form a ladder.

**Rung (a) — a rule in the prompt or instruction file.** "Never use parentheses in LinkedIn
drafts." This is still showing the worker the right way; it is just persistent. And it is
persistent, not reliable. Anthropic's [memory docs](https://code.claude.com/docs/en/memory) say instruction files are treated "as
context, not enforced configuration" and that "there's no guarantee of strict compliance,
especially for vague or conflicting instructions." The
[best-practices page](https://code.claude.com/docs/en/best-practices) (accessed 2026-11-03)
is blunter: a line like "Always typecheck before you finish" "works most of the time, not every
time," and "if you keep adding emphasis to a CLAUDE.md line and Claude still misses it, that's
a sign the line belongs in a hook." One user report on Claude Code's auto-memory (not
instruction files) puts the failure mode in a sentence: "The model acknowledges the memory,
but then repeats the same behavior it was corrected for"
([issue #76408](https://github.com/anthropics/claude-code/issues/76408), opened 2026-07-10,
closed by the stale bot with no maintainer reply — a single report, not a measurement).

**Rung (b) — an LLM reviewer with the item on its checklist.** A separate model pass whose
job is to look for the thing. This catches the pattern *most likely*, not always — but the
gap between (b) and (c) is narrower than "LLM reviewers are leaky" suggests, and it depends
almost entirely on the checklist. Mohammadi ([arXiv 2609.00038](https://arxiv.org/abs/2609.00038), v1 2026-08-29, v3 2026-11-01;
NeurIPS 2026 workshop poster) compared two judges on the same model:

- **Outcome-only judge:** caught 34-76% of faults that left the final reply unchanged (84% for
  "loud" faults, 45% for "silent" ones), and flagged 33 of 100 clean runs.
- **Step-level judge, given the intermediate steps:** flagged every fault of those four
  reply-unchanged types, with 0 of 100 false alarms on clean runs (upper 95% confidence bound
  on the false-alarm rate: 3.6%).
- **Across all six fault types:** the step-level judge caught 85.7% (257 of 300), dropping to
  18% on "unsupported claim" faults — a checklist that reads steps misses a fault that lives
  in the final reply.

The checklist decides what is caught. Same model, different checklist, different result.

The flip side is the production case from the last post: Zhang, Wang and Lei ([arXiv 2606.10315](https://arxiv.org/abs/2606.10315), 2026-06-09) had a judge flag 0 of 100 rounds in which humans confirmed 23 defects
— the judge saw the defects and filed them under the wrong heading. An LLM reviewer is as good
as the instructions and inputs it is handed.

**Rung (c) — a deterministic check.** A hook, a lint rule, a test, a CI (continuous
integration) job. A regex that fails the build if a `(` appears in the LinkedIn file. The
[best-practices page](https://code.claude.com/docs/en/best-practices) describes hooks as "Deterministic: ... Claude Code applies this every
time, no matter what the model decided to do." That is not a finding, it is a definition: a
deterministic check catches its pattern every time by construction. The empirical question
is only whether the harness as a whole pays off, and the evidence there is thin but
positive: Jain (martinfowler.com,
[*Are harnesses worth the cost?*](https://martinfowler.com/articles/are-harnesses-worth-the-cost.html),
2026-10-13) reports a GPT-6 Luna model that "succeeded in only 3 of 10 unharnessed runs and
all 10 with the harness," at roughly 3.9x the tokens. Ten paired runs, and the article's
"guides" and "sensors" aren't separated in the headline result, so take it as one data point,
not a rate.

Don't over-climb. The same [best-practices page](https://code.claude.com/docs/en/best-practices) says: "if you have hooks for things that are
only preferences, delete them and let Claude decide." Rung (c) is for patterns that are
mechanically checkable and where a miss costs real money or a live retraction. Judgement
calls stay at (b). Taste stays at (a).

## The protocol: fix silently, re-check blind

Three steps. The order and the silence matter.

**1. Silently fix the checker.** Pick the rung. Add the lint rule, extend the reviewer's
checklist, or — if that is all you can do today — write the instruction. Do not tell the
model what went wrong. Do not paste the diff into the conversation and ask it to confirm.

**2. Blind re-check in a fresh context.** Start a new session or a subagent that never saw the
original diff, the discussion, or your fix. Hand it the *original, broken* output and the
updated checker. It should catch the bug. This is the red step, in the TDD (test-driven
development) sense: Beck (*TDD by Example*, 2002; a print book, no canonical URL) describes "Red — write a little test that
doesn't work," then "run all tests and fail" before making the change; Fowler's
[bliki summary](https://martinfowler.com/bliki/TestDrivenDevelopment.html) is "Red - Green -
Refactor." Neither of them frames the red step as "testing the test" — that
reading is mine. But it is the reading that matters here: if the re-check does not go red on
the known-bad output, the checklist does not actually cover the case, however convincing the
new line looks.

Why fresh, and why blind? Because the alternative proves the wrong thing. Anthropic describes
their own review mode this way on the [best-practices page](https://code.claude.com/docs/en/best-practices): "/code-review reviews the diff in a fresh subagent that never
saw your conversation. It isn't swayed by the reasoning that produced the code." And the
[Chen result](https://arxiv.org/abs/2606.05976) above (30 paired tasks per setting) points the same direction for errors: how an error
arrived in context changes what the model does with it. If the re-checker has seen the discussion, it is checking your
discussion. If it has only seen the checklist, it is checking the checklist. Only the second
tells you about tomorrow's shift.

**3. The corrected output passes.** Green. Run the same fresh checker on the fixed output and
confirm it is quiet. This step is not ceremony. In the vocabulary of the last post, step 2
guards against a false pass; step 3 guards against a false fail — a checker so eager that it
flags the correct version too. The [best-practices page](https://code.claude.com/docs/en/best-practices) has the warning: "A reviewer that's
asked to find problems will always find *something*." A checklist line that goes red on both
the broken and the fixed output has not been tested; it has been armed.

One honest limit on the whole protocol. Passing step 2 and step 3 once tells you the checker
catches *this instance* of the error in *this* fresh context. For rung (c) that generalises
by construction. For rung (b), and even more for rung (a), it is a strong signal, not a
guarantee — which is exactly why the thesis says "most likely," not "certainly."

## Fix the class, not the instance

Every one of these fixes adds a line somewhere, and lines accumulate. The evidence on what
accumulation costs is mixed, and I'll say so rather than pick a side. Vasileva ([arXiv 2608.12426](https://arxiv.org/abs/2608.12426), 2026-08-12; 15 models, 369,753 checks) found that at eight simultaneous
constraints on one output, per-constraint pass was around 41% but all-eight pass was 5.7% —
constraints compete. Anthropic's [memory docs](https://code.claude.com/docs/en/memory) advise targeting "under 200 lines per CLAUDE.md
file. Longer files consume more context and reduce adherence."

But McMillan ([arXiv 2605.10039](https://arxiv.org/abs/2605.10039), 2026-05-11; 1,650 Claude Code sessions) found *no detectable
effect* of instruction-file size, structure, or conflicts on compliance — and instead found a
within-session decline, non-monotonic, roughly 5.6% lower odds of compliance per generated
function (odds ratio 0.944), identified post hoc. So "bloat kills adherence" is widely
believed and not cleanly shown. The rule I follow anyway, as a matter of hygiene rather than
evidence: fix the class of error, not the instance. One line that says "no reserved characters" beats five that each name one. That
is a post of its own — how harnesses bloat, and why the reflex of adding a rule every time
something goes wrong is itself a rung-(a) habit.

## The repo that wrote this post

This digest has its own long-running false pass, and I am the author of all of it.

LinkedIn's Posts API (application programming interface) parses the post text as a "little" format. Reserved characters —
`| { } @ [ ] ( ) < > # \ * _ ~` — used as plain punctuation stop the parser, the rest of the
post is silently dropped, and the API still returns success. A second, related one: a
box-drawing divider line rendered on LinkedIn as one solid black bar. Both were caught on
2026-09-14, in live posts. The truncation hit twice: a subagent escaped one pair of
parentheses and missed a second pair later in the same text, and the truncated post came back
with a success status.

Here is what the harness looked like when this post went out, with links pinned to that commit so you can check me:

| Where | What it says | Rung |
|---|---|---|
| [`AGENTS.md` §3, reserved-character bullet](https://github.com/DeadLockUA/Learn_with_me_Digest/blob/0081f8fb4bedbe1b09b05cad6d06a8cbca312512/AGENTS.md#L114-L119) | Avoid the reserved characters; "escaping at send time ... has already been missed mid-pipeline" | (a) — prose |
| [`AGENTS.md` §3, TL;DR divider bullet](https://github.com/DeadLockUA/Learn_with_me_Digest/blob/0081f8fb4bedbe1b09b05cad6d06a8cbca312512/AGENTS.md#L83-L93) | Use a spaced dot row, not box-drawing dashes; the latter "renders on LinkedIn as one solid black bar" | (a) — prose |
| [`.claude/agents/publisher.md`, lines 86-101](https://github.com/DeadLockUA/Learn_with_me_Digest/blob/0081f8fb4bedbe1b09b05cad6d06a8cbca312512/.claude/agents/publisher.md#L86-L101) | Escape reserved characters before sending; "the API still returned `201`, no error" | (a) — prose to a model |
| Auto-memory `feedback_linkedin_little_text_format.md` (local to my machine, not in the repo) | Same bug, "this bit twice"; "escaping-at-send-time is fragile" | (a) — prose to a model |
| [`.claude/agents/critic.md`, step 5](https://github.com/DeadLockUA/Learn_with_me_Digest/blob/0081f8fb4bedbe1b09b05cad6d06a8cbca312512/.claude/agents/critic.md#L47-L50) | Reviewer checks the LinkedIn file for Markdown syntax, cross-link, CTAs and hashtags — not reserved characters | (b) — but not for this bug |
| Scripts, hooks, validators, `.claude/settings.json`, CI | None tracked (`git ls-files`, checked 2026-11-03; the only workflow builds Jekyll) | (c) — nothing |

Count: three prose rules, one LLM reviewer check that looks for a different problem, and
zero deterministic checks. For a bug that is a regex.

And the commit history is the worker-correction pattern on display: four commits on
2026-09-14, all on LinkedIn formatting ([c6015f2](https://github.com/DeadLockUA/Learn_with_me_Digest/commit/c6015f2dd19ab50a31ff46e50f699b1d32ee4049), [656501e](https://github.com/DeadLockUA/Learn_with_me_Digest/commit/656501ea8a5dbbfc81bc2e62715be13b10e49ee6), [c595787](https://github.com/DeadLockUA/Learn_with_me_Digest/commit/c595787da27dca4aa997cbe425d7a26b4809bb2d), [ec88e43](https://github.com/DeadLockUA/Learn_with_me_Digest/commit/ec88e43cae539262e9c126e95395ae90afd4dfbe)). Three touched
the punctuation bug — two added prose rules (c6015f2 to the publisher agent, ec88e43 to
`AGENTS.md`, the latter alongside the divider rule) and one (656501e) hand-fixed the
truncated post's text, which is the "correct the worker" move in its purest form. The fourth
(c595787) fixed a different bug, stray Markdown, again with prose across four files. Zero
checks. The reviewer's checklist was never updated to include the item, and nothing
mechanical was added at all. As far as I have seen, the posts since then came out intact —
a run of good shifts, not a verified harness; in the last post's terms, a clean record by
construction.

The obvious next step — my opinion, and not yet built — is a rung-(c) check: a script that
fails on any reserved character or box-drawing run in `entries/linkedin/*.md`, run before
publish, with the blind re-check done against the 2026-09-14 text that broke. Red on the old
file, green on the current ones. Until that exists, this repo is a worked example of the
problem rather than of the fix.

## Where this goes next

- **Processes / AI — harness bloat: the rule you added without thinking.** Every incident adds
  a line, and the evidence that lines degrade adherence is contradictory — Vasileva and
  Anthropic's 200-line guidance say yes, McMillan finds a null and within-session decline
  instead. The reflex to add a rule is itself the "correct the worker" habit at rung (a). The
  angle: audit one real instruction file line by line — which lines name a class, which name
  an instance, which duplicate a check that already exists — and measure what is left after
  collapsing instances into classes. This is the post the caveat above was holding a place for.
- **Testing / AI — test your reviewer like code: a red/green corpus for rung (b).** Nobody
  regression-tests the LLM reviewer; its checklist grows, nothing proves each line still
  fires, and the Mohammadi gap (34-76% vs 100% on the same four fault types) shows the
  checklist, not the model, decides recall. The angle: keep a small corpus of known-bad and known-good outputs per
  checklist item, re-run the reviewer on it after every checklist change, and treat a line
  that goes red on both sides — or green on both — as a broken test.
- **AI — memory products are harness, not learning.** Vendors sell "memory" as the model
  learning from you, but at inference the weights don't move; memory is a checklist loaded at
  shift start, with rung-(a) reliability, and the user report quoted above — the model
  "acknowledges the memory, but then repeats the same behavior it was corrected for" — says
  exactly that. The angle: put auto-memory,
  instruction files and retrieval on the same three-rung ladder, show where each actually
  sits, and ask what a memory feature would have to do to count as rung (b) or (c).

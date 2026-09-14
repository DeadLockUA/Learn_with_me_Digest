---
layout: post
title: "AI-Assisted Testing Adds a Validation Layer, It Doesn't Remove One"
date: 2026-09-14
topic: testing
related_posts: []
image: /assets/images/entries/2026-09-14-ai-assisted-testing-validation-layer.jpg
---

## The estimate that doubled

*Personal experience, not a general claim.* A rollout of AI-assisted testing was scoped at two
weeks. It took two months.

The tools worked. The scoping didn't account for a new layer of work:

- **Before:** validate the defect.
- **Now:** validate the defect → validate the AI's verdict on the defect.

That second layer rarely makes it into planning, because there's no reference point yet for how
long "validating the validation" takes.

Still faster than testing without AI — just significantly slower than expected going in.

## Why the layer appears

More AI-generated tests → more coverage → more alerts, flaky results, duplicate scenarios.
Someone still has to sort through it and decide what to trust. That sorting is the hidden cost.

This isn't just an anecdote. Research on LLM-generated tests backs the pattern:

- A study on the common "code first, then generate tests" workflow found that tests LLMs write
  *after* buggy code are much weaker at catching the bugs than tests written independently:
  **14% vs. 25% fault-detection effectiveness**. The mechanism: faults in the generated code get
  "baked into" the matching generated tests — code and tests stay mutually consistent while
  missing the real defect. *Caveat: this is an arXiv preprint (submitted 2026-07-06), not yet
  peer-reviewed at a venue.* *(arXiv 2607.05139 —
  [abs](https://arxiv.org/abs/2607.05139))*

## A caution on "AI makes you faster"

It's tempting to assume AI-assisted work is a straightforward speed-up. The best available
evidence here is weaker than we'd like — flagging that limitation rather than hiding it:

- A METR survey (349 technical workers, Feb–Apr 2026, published 2026-05-11) found people
  self-report large speed gains from AI — a **median of roughly 3x**. But METR's own analysis
  flags this as likely overstated, citing a prior finding that people overestimate AI's time
  savings **by 40 percentage points on average**.
- **This is self-report survey data, not a controlled (RCT) productivity measurement** — it
  documents a perception-vs-reality gap, not a hard "AI is slower" result. No source under 3
  months old and RCT-grade was found for this angle; this ~4-month-old survey is the best
  available and should be read as a caveat, not a settled claim.
  *([METR, May 2026](https://metr.org/blog/2026-05-11-ai-usage-survey/))*

## Takeaway

Don't plan AI-assisted testing as "testing, but faster." Plan it as testing plus a validation
layer you haven't measured yet — and budget for someone to own the triage.

## Where this goes next

- **Testing:** how to actually scope the "validate the AI's verdict" layer up front, instead of
  discovering it mid-rollout like I did.
- **AI:** the triage bottleneck — who or what handles the flood of alerts, flaky results, and
  duplicate scenarios once coverage goes up.
- **Quality:** who owns the call on what to trust, when the thing checking the work also needs
  checking.

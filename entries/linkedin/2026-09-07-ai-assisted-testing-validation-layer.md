AI-assisted testing doesn't remove a layer of work. It adds one.

Before: validate the defect.
Now: validate the defect → validate the AI's verdict on the defect.

That second layer rarely gets scoped. On a recent rollout, that gap turned a 2-week estimate into
2 months — not because the tools failed, but because "validating the validation" had no reference
point yet. (Personal experience — your mileage will vary.)

The mechanism: more AI-generated tests → more coverage → more alerts, flaky results, duplicate
scenarios. Someone still has to triage what to trust.

It's not just anecdote — a study on "code first, then generate tests" workflows found LLM tests
written after buggy code catch far fewer bugs than tests written independently (14% vs. 25%
fault-detection). Bugs get baked into the matching tests. (Preprint, not yet peer-reviewed.)

And on the broader "AI makes you faster" assumption: a 2026 METR survey found people self-report
~3x speed gains from AI — but METR flags this as likely overstated (people typically overestimate
AI's time savings by ~40 points). That's self-report data, not a controlled measurement — best
available source, not a settled claim either way.

Full write-up and sources: https://deadlockua.github.io/Learn_with_me_Digest/2026/09/07/ai-assisted-testing-validation-layer.html

Where this could go next:
- Testing: putting a number on the hidden "validate the AI's verdict" cost, from a real rollout.
- AI: isolating the test-writing AI from the implementation entirely — does that close the
  blind-spot gap?
- Processes: who should validate the AI's verdict — same tester or a different person.

Comment which of these (or another angle) you want covered next.

Always happy to answer questions within my knowledge.

#AITesting #SoftwareTesting #TestAutomation #QualityAssurance #LLMTesting

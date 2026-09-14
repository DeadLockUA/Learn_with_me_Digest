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
- Processes: the triage line item that isn't in your estimate — how do you size it with no
  baseline?
- Processes: owning triage vs. having it "handled" — a real role, not whoever notices first.
- Testing: a minimal 3-number triage log to build the missing reference point.
- Testing: duplicate AI-generated tests — the coverage number that lies.

Comment which of these (or another angle) you want covered next.

Always happy to answer questions within my knowledge.

#AITesting #SoftwareTesting #TestAutomation #QualityAssurance #LLMTesting

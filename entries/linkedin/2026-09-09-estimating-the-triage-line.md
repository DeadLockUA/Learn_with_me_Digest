TL;DR: How to turn "name the validation layer" into an actual estimate line item, and how to size that line when you have zero historical data to size it from - five standard methods checked against the zero-baseline case, plus what I'd actually write.

Follow-up to my last post on the hidden validation layer in AI-assisted testing. Two questions were left open: what does "name the layer" look like as an actual estimate line, and how do you size it with zero history?

First one has a clean answer. Second one doesn't.

Line item, not buffer.

Padding is an undisclosed reserve. PMI's contingency reserve is for known risks, visible, and can sit at activity level. Triage of AI-generated tests is a known unknown - you know the work exists, you don't know its size. So it belongs in the visible baseline as a named line, not in silent padding.

What the line needs: named activity, named owner, explicit basis - "no baseline, sized by method X" - and a re-estimate trigger. A buffer has no basis and no trigger. It can only be spent.

Sizing with no history - what the standard methods actually give you:

• Reference class forecasting: wants roughly 20-30 comparable projects. Nothing on what to do when the class is empty. Borrowing an adjacent class, like flaky-test triage, is a guess in disguise - label it.
• Three-point / PERT: needs no history, but the pessimistic value must be honestly wide or you're laundering one guess into three.
• Cone of Uncertainty: initial estimates can be 4x off either way. It bounds your error, doesn't give you a number. It narrows through work, not time.
• Spikes: one time-boxed batch, fully triaged and timed. Converts "no data" into "one data point."
• Hubbard's Rule of Five: any random sample of 5 bounds the population median with 93.75% confidence. Five measured triage batches fit inside the first sprint. Bounds the median, not the tail - and the tail is where my two weeks became two months.

My working pattern, opinion not standard: spike first, PERT from the spike with pessimistic at 4x, Rule of Five written into the line as the re-estimate trigger, basis kept visible.

The honest gap: no controlled measurement of AI-verdict-triage overhead exists in the last six months. The nearest peer-reviewed data, Alaswad et al. in Discover Computing, July 2026, N=22, finds human validation is the primary driver of effort in LLM-assisted work. DORA's "verification tax" and its 15% figure are reported via secondary write-ups, not verified against the gated primary report, and the 15% is a calculator default, not a measurement either way. Vendor telemetry from Faros and LinearB shows review load up sharply, but it's correlational and about code review, not test triage.

Full breakdown with the estimate-line template and all sources on the blog: [BLOG_URL_PLACEHOLDER]

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#SoftwareEstimation #ProjectManagement #AITesting #TestAutomation #EngineeringProcesses

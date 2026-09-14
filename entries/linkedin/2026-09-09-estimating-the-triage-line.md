𝗧𝗟;𝗗𝗥 How to turn "name the validation layer" into a real estimate line item, and how to size it with zero historical data - what the standard methods actually give you, plus what I'd write.

───────────────────

Follow-up to my last post on the hidden validation layer in AI-assisted testing. Two questions were left open: what does "name the layer" look like as an estimate line, and how do you size it with zero history?

First one has a clean answer. Second one doesn't.

Line item, not buffer. Triage of AI-generated tests is a known unknown - you know the work exists, you don't know its size. That belongs in the visible baseline as a named line with an owner, an explicit basis ("no baseline, sized by method X") and a re-estimate trigger. A buffer has none of that. It can only be spent.

Sizing with no history: reference class forecasting wants 20-30 comparable projects and says nothing about an empty class. PERT needs no history, but the pessimistic value has to be honestly wide or you're laundering one guess into three. A spike converts "no data" into "one data point", and Hubbard's Rule of Five bounds the median from five measured batches - the median, not the tail, and the tail is where my two weeks became two months.

My working pattern, opinion not standard: spike first, PERT from the spike with pessimistic at 4x, Rule of Five as the re-estimate trigger, basis kept visible.

The honest gap: no controlled measurement of AI-verdict-triage overhead exists in the last six months. The nearest peer-reviewed data (Alaswad et al., Discover Computing, July 2026, N=22) finds human validation is the primary effort driver in LLM-assisted work. DORA's "verification tax" figure is only reported second-hand and is a calculator default, not a measurement.

───────────────────
👉 If you're interested in the topic, I recommend visiting my blog, where I cover it in much more depth: https://yevhenprodan.com/2026/09/09/estimating-the-triage-line.html
───────────────────

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#SoftwareEstimation #ProjectManagement #AITesting #TestAutomation #EngineeringProcesses

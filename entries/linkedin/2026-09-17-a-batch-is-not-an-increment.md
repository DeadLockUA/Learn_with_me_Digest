𝗔 𝗕𝗮𝘁𝗰𝗵 𝗜𝘀 𝗡𝗼𝘁 𝗮𝗻 𝗜𝗻𝗰𝗿𝗲𝗺𝗲𝗻𝘁: 𝗔𝗜 𝗠𝗼𝘃𝗲𝘀 𝘁𝗵𝗲 𝗕𝗼𝘁𝘁𝗹𝗲𝗻𝗲𝗰𝗸 𝘁𝗼 𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻

𝗧𝗟;𝗗𝗥 The problem isn't that AI makes estimates wrong. It makes production faster than verification, so the bottleneck - and with it the economics of the work - moves somewhere the old metrics weren't designed to measure.

• • • • • • • • • •

Follow-up to my last post on sizing the AI-test triage line. It asked: does the velocity toolkit apply to an agent that produces hundreds of tests in one go?

𝗧𝗵𝗲 𝗰𝗼𝗻𝘀𝘁𝗿𝗮𝗶𝗻𝘁 𝗵𝗮𝘀 𝗺𝗼𝘃𝗲𝗱. My framing: in a human-only team, production and verification run at roughly the same rate, so no queue builds in front of review. An agent breaks that balance, and a queue forms in front of verification.

𝗧𝗵𝗲 𝗰𝗵𝗮𝗶𝗻: batch size → verification queue → cycle time → review quality → rework → actual throughput. A 2026 study of 37k pull requests - PRs - puts Claude Code's median at 495 changed lines vs 52 for humans. Vendor telemetry: AI PRs merge within 30 days 32.7 percent of the time vs 84.4 unassisted - correlation, not proof.

𝗦𝘁𝗼𝗿𝘆 𝗽𝗼𝗶𝗻𝘁𝘀 𝘀𝗶𝘇𝗲 𝗽𝗿𝗼𝗱𝘂𝗰𝘁𝗶𝗼𝗻. 𝗢𝗻𝗰𝗲 𝘁𝗵𝗲 𝗰𝗼𝗻𝘀𝘁𝗿𝗮𝗶𝗻𝘁 𝗵𝗮𝘀 𝗺𝗼𝘃𝗲𝗱 𝘁𝗼 𝘃𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻, 𝘁𝗵𝗲 𝘀𝗶𝘇𝗲𝗱 𝗾𝘂𝗮𝗻𝘁𝗶𝘁𝘆 𝗻𝗼 𝗹𝗼𝗻𝗴𝗲𝗿 𝗽𝗿𝗲𝗱𝗶𝗰𝘁𝘀 𝘁𝗵𝗲 𝘄𝗼𝗿𝗸 𝗮𝘁 𝘁𝗵𝗲 𝗯𝗼𝘁𝘁𝗹𝗲𝗻𝗲𝗰𝗸. That's the symptom, not the disease. AI doesn't remove quality work; it can multiply what has to be verified, and by default that arrives as one batch.

𝗧𝘄𝗼-𝘀𝗶𝗱𝗲𝗱 𝗳𝗶𝘅, my opinion: 𝗯𝗲𝗳𝗼𝗿𝗲 𝘁𝗵𝗲 𝗿𝘂𝗻, write acceptance criteria - a requirements-up-front step, Waterfall-shaped, and rightly so, I think. 𝗔𝗳𝘁𝗲𝗿 𝘁𝗵𝗲 𝗿𝘂𝗻, re-slice the output into reviewable increments - the batch isn't split by default, but it can be.

• • • • • • • • • •
👉 If you're interested in the topic, I recommend visiting my blog, where I cover it in much more depth: BLOG-URL-PLACEHOLDER
• • • • • • • • • •

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#AgileEstimation #AICodingAgents #CodeReview #BatchSize #EngineeringProcesses

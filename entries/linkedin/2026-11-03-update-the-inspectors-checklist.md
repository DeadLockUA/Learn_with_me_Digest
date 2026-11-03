I wrote the rule down. The bug still cut a live LinkedIn post off mid-sentence - and the API still returned success. So I wrote the rule down again, in a second file.

The bug is small: a handful of ordinary punctuation marks that LinkedIn's API treats as formatting. The lesson was not about punctuation.

𝗧𝗵𝗲 𝗺𝗼𝗱𝗲𝗹 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗿𝗲𝗺𝗲𝗺𝗯𝗲𝗿 𝗯𝗲𝗶𝗻𝗴 𝗰𝗼𝗿𝗿𝗲𝗰𝘁𝗲𝗱. A deployed LLM runs inference-only; its weights do not change when you tell it it was wrong. Every session is a skilled worker starting a fresh shift with no memory of yesterday. The only thing that survives the night is the inspector's checklist pinned to the wall.

So when the worker slips, showing it the right way fixes today's shift. Tomorrow's worker never met you.

𝗙𝗶𝘅 𝘁𝗵𝗲 𝗰𝗵𝗲𝗰𝗸𝗲𝗿, 𝗻𝗼𝘁 𝘁𝗵𝗲 𝘄𝗼𝗿𝗸𝗲𝗿. Do not tell the model what it got wrong. Add the line to the checklist - a lint rule, a reviewer item, or at minimum an instruction - silently.

𝗥𝗲-𝗰𝗵𝗲𝗰𝗸 𝗯𝗹𝗶𝗻𝗱, 𝗶𝗻 𝗮 𝗳𝗿𝗲𝘀𝗵 𝗰𝗼𝗻𝘁𝗲𝘅𝘁. Hand the original broken output to a new session that never saw the discussion. It should go red. Then run the fixed output through it and confirm it goes green. A model that finds the error after you named it has demonstrated reading comprehension, not that anything would catch it next time.

I audited my own repo for that punctuation bug: three prose rules, one reviewer check that looks for a different problem, zero deterministic checks. Four commits in one day on LinkedIn formatting, three on that punctuation bug: two rules and one hand-fix of the broken post. Zero checks. As far as I've checked, the posts since then came out intact - a run of good shifts, not a verified harness.

One question: the last time your AI assistant got something wrong, did you fix the assistant, or the thing that was supposed to catch it?

Full post, with the three rungs of checklist and the sources: https://yevhenprodan.com/2026/11/03/update-the-inspectors-checklist.html

#AIAgents #LLM #CodeReview #DeveloperWorkflow #ClaudeCode #QualityEngineering

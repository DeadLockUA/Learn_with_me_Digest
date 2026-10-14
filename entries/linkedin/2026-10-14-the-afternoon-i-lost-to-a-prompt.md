𝗧𝗵𝗲 𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻 𝗜 𝗟𝗼𝘀𝘁 𝘁𝗼 𝗮 𝗣𝗿𝗼𝗺𝗽𝘁

𝗧𝗟;𝗗𝗥 I know how to prompt, and I still lost half a day - because I was improving a prompt with no way to measure it. A 40-minute script with about 30 real examples showed the errors were not in the prompt at all. Technique without measurement runs blind.

• • • • • • • • • •

The task: parse bug reports and return JSON - component, severity, reproduction steps - for automated triage.

𝗙𝗼𝘂𝗿 𝗵𝗼𝘂𝗿𝘀, 𝗯𝘆 𝘁𝗵𝗲 𝗯𝗼𝗼𝗸. I completed Claude Certified Developer - Foundations and I did everything it teaches: XML-tagged sections, strict JSON schema, few-shot examples for different cases, a reasoning block before the output, a rule for missing fields. Every step helped on the report in front of me. After about four hours I still could not say whether the prompt was better overall than in the morning. I was checking against four or five reports and hoping.

𝗙𝗼𝗿𝘁𝘆 𝗺𝗶𝗻𝘂𝘁𝗲𝘀 𝘁𝗵𝗮𝘁 𝘀𝗵𝗼𝘂𝗹𝗱 𝗵𝗮𝘃𝗲 𝗰𝗼𝗺𝗲 𝗳𝗶𝗿𝘀𝘁. I stopped and wrote a script: about 30 real reports, expected fields written by hand, automatic comparison. First run: roughly 70 percent correct. The failures fell into two clusters, and neither was caused by the prompt.

𝗔 𝗴𝗼𝗼𝗱 𝗽𝗿𝗼𝗺𝗽𝘁 𝗰𝗮𝗻𝗻𝗼𝘁 𝗳𝗶𝘅 𝗮 𝗯𝗮𝗱𝗹𝘆 𝗱𝗲𝗳𝗶𝗻𝗲𝗱 𝘁𝗮𝘀𝗸. About half the failures were reports with no reproduction steps - nothing to extract, so the model invented them. The rest came from severity meaning different things to different people on the team, because nobody had written it down. Two fixes, neither a prompting technique: allow null, and define severity in one paragraph. Another 20 minutes or so. About 90 percent.

This matches what the research says. A 2026 study of prompt sensitivity across GPT-5.4, Claude Opus 4.6 and Gemini 3 Flash found the best prompt configuration differs per model and even per institution for the same model - the authors say there is no universal prompt recipe, calibrate empirically. And Anthropic's own prompt engineering guide tells you to have success criteria and a way to test against them before the first draft prompt. I had read that. I skipped it because the task looked too small.

𝗣𝗿𝗼𝗺𝗽𝘁𝗶𝗻𝗴 𝘀𝗸𝗶𝗹𝗹 𝗱𝗼𝗲𝘀 𝗻𝗼𝘁 𝗿𝗲𝗽𝗹𝗮𝗰𝗲 𝗺𝗲𝗮𝘀𝘂𝗿𝗲𝗺𝗲𝗻𝘁 𝗼𝗻 𝗿𝗲𝗮𝗹 𝗲𝘅𝗮𝗺𝗽𝗹𝗲𝘀. My rule now: if after two or three edits I cannot say whether it got better or worse, I stop and build the check - 20 to 30 real examples plus automatic comparison. Then I go back to the prompt. Usually the first run tells me the prompt is not where the problem is.

• • • • • • • • • •
👉 Full story, the sources, and the caveats on my blog: https://yevhenprodan.com/2026/10/14/the-afternoon-i-lost-to-a-prompt.html
• • • • • • • • • •

Always happy to answer questions within my knowledge - ask in the comments.
And if there is a specific topic you want covered next, say so and we will dig into it.

#PromptEngineering #LLMEvals #AIDevelopment #DeveloperProductivity #StructuredOutput

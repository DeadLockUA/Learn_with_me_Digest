𝗤𝘂𝗮𝗹𝗶𝘁𝘆 𝗽𝗲𝗿 𝗧𝗼𝗸𝗲𝗻: 𝗧𝗵𝗲 𝗧𝗿𝗮𝗱𝗲𝗼𝗳𝗳 𝗡𝗼𝗯𝗼𝗱𝘆 𝗣𝘂𝘁𝘀 𝗼𝗻 𝘁𝗵𝗲 𝗜𝗻𝘃𝗼𝗶𝗰𝗲

𝗧𝗟;𝗗𝗥 A one-shot single-agent run is the cheapest thing you can buy from a model and the least verified. Every agent, critic or retry you add to fix that multiplies the bill. Teams budget the cheap run and ship the expensive one. The unit that belongs on the invoice is cost per verified result - and it has to count the verifier's misses.

• • • • • • • • • •

𝗖𝗼𝘀𝘁 𝗽𝗲𝗿 𝘃𝗲𝗿𝗶𝗳𝗶𝗲𝗱 𝗿𝗲𝘀𝘂𝗹𝘁. Not cost per run, not tokens per month. Leaderboards that publish cost at all, such as Artificial Analysis, report cost per task attempted; budgets are drawn on cost per run; almost nobody reports what a usable outcome actually costs.

𝗠𝗼𝗿𝗲 𝗮𝗴𝗲𝗻𝘁𝘀 𝗶𝘀 𝗻𝗼𝘁 𝗮 𝗱𝗶𝗮𝗹 𝘁𝗵𝗮𝘁 𝗼𝗻𝗹𝘆 𝗴𝗼𝗲𝘀 𝘂𝗽. Google Research measured 260 agent configurations on 6 benchmarks: going multi-agent ranged from plus 80.8 percent on decomposable tasks to minus 70 percent on sequential planning. Independent agents amplified errors 17.2x vs 4.4x with central coordination. Sometimes the choice is cheap-and-unverified vs expensive-and-worse.

𝗖𝗵𝗲𝗮𝗽 𝗽𝗲𝗿 𝘀𝘂𝗰𝗰𝗲𝘀𝘀 𝗼𝗻𝗹𝘆 𝘄𝗼𝗿𝗸𝘀 𝘄𝗵𝗲𝗻 𝗴𝗿𝗮𝗱𝗶𝗻𝗴 𝗶𝘀 𝗳𝗿𝗲𝗲. A vendor study of 2,400 Terminal-Bench runs found the cheapest model per successful task passed only 33 percent of the time and still came in about 12x cheaper per success than GPT-5.5 at 67 percent. That works because the harness grades pass or fail and retries are cheap. Your ticket queue has no harness - there, 67 percent failure is 67 percent of output a human has to check.

𝗧𝗵𝗲 𝘃𝗲𝗿𝗶𝗳𝗶𝗲𝗿 𝗰𝗮𝗻 𝗹𝗶𝗲. Harvey and LangChain cut verifier cost by roughly an order of magnitude with batching and open models. The bill: a cheap model as verifier had a false-pass rate of 48.4 percent per criterion. You paid for generation, paid for verification, and still shipped the defect - with a stamp on it. Cost per verified result has to divide by what was actually correct, not what the verifier said was correct.

𝗕𝘂𝗱𝗴𝗲𝘁 𝘁𝗵𝗲 𝗰𝗼𝗻𝗳𝗶𝗴𝘂𝗿𝗮𝘁𝗶𝗼𝗻 𝘆𝗼𝘂 𝘄𝗶𝗹𝗹 𝘀𝗵𝗶𝗽, 𝗻𝗼𝘁 𝘁𝗵𝗲 𝗼𝗻𝗲 𝘆𝗼𝘂 𝗱𝗲𝗺𝗼𝗲𝗱. My take: if the pilot was one agent, one shot, and production adds a critic and two retries, the bill is a multiple of the pilot. Estimate the multiple before approval, and measure your verifier's miss rate before claiming its savings.

• • • • • • • • • •
👉 If you're interested in the topic, I recommend visiting my blog, where I cover it in much more depth: https://yevhenprodan.com/2026/09/28/quality-per-token.html
• • • • • • • • • •

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#AIAgents #MultiAgentSystems #LLMEvaluation #AICost #EngineeringProcesses

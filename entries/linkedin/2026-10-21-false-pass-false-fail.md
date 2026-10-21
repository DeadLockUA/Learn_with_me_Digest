𝗙𝗮𝗹𝘀𝗲 𝗣𝗮𝘀𝘀 𝘃𝘀 𝗙𝗮𝗹𝘀𝗲 𝗙𝗮𝗶𝗹: 𝗧𝗵𝗲 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗿 𝗘𝗿𝗿𝗼𝗿 𝗡𝗼𝗯𝗼𝗱𝘆 𝗣𝗿𝗶𝗰𝗲𝘀

𝗧𝗟;𝗗𝗥 An LLM judge reports one agreement number for two errors that cost very differently. A false fail rejects good work - visible rework, charged to the judge. A false pass ships a defect with a verified stamp - the cost lands on support or ops later and is never traced back to the judge. A 90 percent headline can hide an unacceptable false-pass bill because the two errors are counted in different ledgers.

• • • • • • • • • •

𝗢𝗻𝗲 𝗻𝘂𝗺𝗯𝗲𝗿, 𝘁𝘄𝗼 𝗹𝗲𝗱𝗴𝗲𝗿𝘀. The asymmetry is not a fixed multiplier - it is who gets charged. A false fail is debited to the verifier's owner today. A false pass is debited to the incident queue next month, where it looks like any other escaped defect. Only the first ledger ever reaches the meeting about whether the judge is good enough.

𝗦𝗺𝗮𝗹𝗹 𝗷𝘂𝗱𝗴𝗲𝘀 𝗹𝗲𝗮𝗻 𝘁𝗼𝘄𝗮𝗿𝗱 𝗳𝗮𝗹𝘀𝗲 𝗽𝗮𝘀𝘀𝗲𝘀. A June 2026 study of small-model judges found roughly 60 to 65 percent of their errors accept a wrong answer rather than reject a right one. And the direction is steerable by prompt: a lenient persona and a strict persona each dropped a judge about ten points - in opposite directions. Same headline drop, opposite cost profile.

𝗭𝗲𝗿𝗼 𝗳𝗹𝗮𝗴𝗴𝗲𝗱, 𝘁𝘄𝗲𝗻𝘁𝘆-𝘁𝗵𝗿𝗲𝗲 𝗳𝗼𝘂𝗻𝗱. A production case study of an ordering agent: the LLM judge gate flagged zero of 100 rounds in a batch where human review confirmed 23 distinct defects. The judge had seen the defects and filed them under the wrong category. The authors' line: a consumer handed a 0 percent judge rate cannot bound the true rate at all without independent human data.

𝗧𝗵𝗲 𝗳𝗮𝗹𝘀𝗲 𝗳𝗮𝗶𝗹 𝗵𝗮𝘀 𝗮 𝗰𝗹𝗶𝗳𝗳 𝘁𝗼𝗼. Research on pre-execution monitors scores them by catch rate minus false-rejection rate, because a monitor that rejects everything catches every error. Over-blocking pushes teams to switch oversight off - at which point the false-pass rate goes to 100 percent. That is the most expensive false fail there is.

𝗥𝗲𝗽𝗼𝗿𝘁 𝘁𝘄𝗼 𝗻𝘂𝗺𝗯𝗲𝗿𝘀, 𝗻𝗲𝘃𝗲𝗿 𝗼𝗻𝗲. My take: false-pass rate and false-fail rate at the threshold you actually ship at, measured on a human-labelled set that contains known-good and known-bad items. Route every shipped defect that passed verification back to the judge's record. Treat a zero from the judge as unknown, not clean.

• • • • • • • • • •
👉 If you're interested in the topic, I recommend visiting my blog, where I cover it in much more depth: https://yevhenprodan.com/2026/10/21/false-pass-false-fail.html
• • • • • • • • • •

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#LLMAsAJudge #AIEvaluation #SoftwareTesting #AIQuality #TestAutomation

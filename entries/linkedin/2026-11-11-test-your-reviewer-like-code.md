Last week I added a line to my AI reviewer's checklist. I tested it properly: a blind run went red on the broken post and green on the fixed one. Then I kept neither as a test.

So the line was proven to work once, on the day it was written. No line added before it has a stored test at all.

𝗧𝗵𝗲 𝗰𝗵𝗲𝗰𝗸𝗹𝗶𝘀𝘁 𝗶𝘀 𝘁𝗵𝗲 𝗼𝗻𝗲 𝗰𝗼𝗺𝗽𝗼𝗻𝗲𝗻𝘁 𝘄𝗶𝘁𝗵 𝗻𝗼 𝘁𝗲𝘀𝘁𝘀. The code has tests. The tests have a reviewer. The reviewer's checklist grows by one line per incident, and nothing shows each line still fires.

It matters because lines are not independent. An August 2026 study of LLM judges found the verdict on one rubric shifts depending on which other rubrics sit beside it - only about a third of samples got fully consistent verdicts. Line 12 is not guaranteed to survive line 13.

𝗢𝗻𝗲 𝗿𝗲𝗱, 𝗼𝗻𝗲 𝗴𝗿𝗲𝗲𝗻, 𝗽𝗲𝗿 𝗶𝘁𝗲𝗺. My own construction, not a published practice: keep the broken output and the fixed one for every checklist line, and re-run the reviewer on all of them after every checklist change. A line that flags both is armed, not tested. A line that flags neither is decoration.

One question: if you deleted a random line from your AI reviewer's checklist today, how would you find out whether anything got worse?

Full post, with the four outcomes per item and the sources: https://yevhenprodan.com/2026/11/11/test-your-reviewer-like-code.html

#LLMAsAJudge #AICodeReview #SoftwareTesting #RegressionTesting #AIEvaluation

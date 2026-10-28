I stopped trusting my coding agent's time estimates the day I read a study where the models liked to predict around an hour and a half, whatever the task - and the real runtimes ran from 5 minutes to 3 hours.

The agent was not lying. It has no clock, no memory of its own past runs, and a strong pull toward one familiar number.

Two facts that changed how I plan agent work:

𝗔𝗴𝗲𝗻𝘁𝘀 𝗼𝘃𝗲𝗿-𝗲𝘀𝘁𝗶𝗺𝗮𝘁𝗲 𝘁𝗵𝗲𝗶𝗿 𝗼𝘄𝗻 𝗿𝘂𝗻𝘁𝗶𝗺𝗲 𝗯𝘆 𝟯𝘅 𝘁𝗼 𝟭𝟬𝘅, depending on model and harness. Strip the timestamps out of their logs and the error doubles. The agent's best proxy for elapsed time is how much text it has read.

𝗬𝗼𝘂 𝗮𝗿𝗲 𝘁𝗵𝗲 𝘀𝗹𝗼𝘄 𝗽𝗮𝗿𝘁. In one lab's trace data, 92 percent of session wall-clock was a human thinking, 3 percent the model generating, 5 percent tools running. The agent says 90 minutes; the pull request waits half a day for a reviewer. Different clocks, and nobody says which one they mean.

What works instead: do not ask for a duration. Ask for a step count, multiply by the per-step cost from your own logs, add the retry loop and the test-suite runtime, and list the human waits separately. Give the agent the current time and its own history, and the estimate turns from a guess into arithmetic.

The full breakdown - the ranked factor table, a copy-paste estimation prompt, a scoring rubric, the telemetry setup for Claude Code and Codex, and a before/after worked example - is on the blog.

One question: when your agent says a task will take an hour, which clock do you hear - machine minutes, or time until it is merged?

Full post, with sources and the caveats on every number: https://yevhenprodan.com/2026/10/28/the-agent-that-says-about-ninety-minutes.html

#AIAgents #AgenticCoding #Estimation #DeveloperProductivity #ClaudeCode

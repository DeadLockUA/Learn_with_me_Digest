𝗘𝘀𝘁𝗶𝗺𝗮𝘁𝗶𝗻𝗴 𝘁𝗵𝗲 𝗧𝗿𝗶𝗮𝗴𝗲 𝗟𝗶𝗻𝗲: 𝗛𝗼𝘄 𝘁𝗼 𝗦𝗶𝘇𝗲 𝗪𝗼𝗿𝗸 𝗪𝗶𝘁𝗵 𝗭𝗲𝗿𝗼 𝗕𝗮𝘀𝗲𝗹𝗶𝗻𝗲 𝗗𝗮𝘁𝗮

𝗧𝗟;𝗗𝗥 How to turn "name the validation layer" into a real estimate line item, and how to size it with zero historical data - what the standard methods actually give you, plus what I'd write.

• • • • • • • • • •

Follow-up to my last post on the hidden validation layer in AI-assisted testing. Two questions were left open: what does "name the layer" look like as an estimate line, and how do you size it with zero history?

First one has a clean answer. Second one doesn't.

𝗟𝗶𝗻𝗲 𝗶𝘁𝗲𝗺, 𝗻𝗼𝘁 𝗯𝘂𝗳𝗳𝗲𝗿. Triage of AI-generated tests is a known unknown - you know the work exists, you don't know its size. That belongs in the visible baseline as a named line with an owner, an explicit basis - "no baseline, sized by method X" - and a re-estimate trigger. A buffer has none of that. It can only be spent.

Sizing with no history: 𝗿𝗲𝗳𝗲𝗿𝗲𝗻𝗰𝗲 𝗰𝗹𝗮𝘀𝘀 𝗳𝗼𝗿𝗲𝗰𝗮𝘀𝘁𝗶𝗻𝗴 wants 20-30 comparable projects and says nothing about an empty class. 𝗣𝗘𝗥𝗧 needs no history, but the pessimistic value has to be honestly wide or you're laundering one guess into three. A 𝘀𝗽𝗶𝗸𝗲 converts "no data" into "one data point", and 𝗛𝘂𝗯𝗯𝗮𝗿𝗱'𝘀 𝗥𝘂𝗹𝗲 𝗼𝗳 𝗙𝗶𝘃𝗲 bounds the median from five measured batches - the median, not the tail, and the tail is where my two weeks became two months.

𝗠𝘆 𝘄𝗼𝗿𝗸𝗶𝗻𝗴 𝗽𝗮𝘁𝘁𝗲𝗿𝗻, opinion not standard: 𝘀𝗽𝗶𝗸𝗲 first, 𝗣𝗘𝗥𝗧 from the 𝘀𝗽𝗶𝗸𝗲 with pessimistic at 4x, Rule of Five as the re-estimate trigger, basis kept visible.

• • • • • • • • • •
👉 If you're interested in the topic, I recommend visiting my blog, where I cover it in much more depth: https://yevhenprodan.com/2026/09/09/estimating-the-triage-line.html
• • • • • • • • • •

Always happy to answer questions within my knowledge - ask away in the comments.
And if there's a specific topic you want covered, comment and we'll dig into it next time.

#SoftwareEstimation #ProjectManagement #AITesting #TestAutomation #EngineeringProcesses

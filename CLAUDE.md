# CLAUDE.md

All operating context and rules for this repository are in `AGENTS.md`, imported at the bottom of
this file. **Keep that `@AGENTS.md` line.** It is the mechanical import that inlines the whole rule
set (including `AGENTS.md`'s own import of `BEHAVIOUR.md`) into every session *and every subagent
dispatch* before the first token — a prose "read that file" instruction only reaches an agent that
chooses to spend a `Read` call.

@AGENTS.md

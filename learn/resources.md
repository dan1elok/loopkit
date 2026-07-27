# Resources

Short list. Quality over dump.

## Pattern

- [The Ralph Wiggum technique](https://ghuntley.com/ralph/) — origin write-up for the restart-until-done coding loop.
- [What is the Ralph technique?](https://ralphloop.sh/blog/what-is-the-ralph-technique/) — clear explanation of filesystem-as-memory.

## Why gates matter

Production agents fail as systems, not as models: silent regressions,
retry storms, context poisoning. A loop that cannot fail closed will
burn tokens and ship breakage. LoopKit treats gates as load-bearing,
not optional.

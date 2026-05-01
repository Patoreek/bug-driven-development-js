# Hint 2: The recurrence structure

For each position `i`, you need to consider all possible "break points" `j` where:
- You built up `dp[j]` characters using the first `j` keystrokes
- Keystroke `j+1` is Ctrl-A
- Keystroke `j+2` is Ctrl-C
- Keystrokes `j+3` through `i` are all Ctrl-V

The number of Ctrl-V presses is `i - j - 2`, but the total multiplier on the buffer is `i - j - 1` (because the original content is still on screen, plus the pastes).

So: `dp[i] = max(dp[i], dp[j] * (i - j - 1))` for all valid `j`.

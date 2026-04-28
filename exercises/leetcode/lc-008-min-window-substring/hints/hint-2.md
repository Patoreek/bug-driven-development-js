# Hint 2 — Technique

Maintain two frequency maps:
- `tFreq`: character counts needed from `t` (computed once)
- `windowFreq`: character counts in the current window (updated as you expand/contract)

Track a `have` counter: the number of unique characters in `t` whose frequency requirement is fully met in the window. When `have === need` (the number of unique characters in `t`), the window is valid.

This avoids comparing the full maps on every step. Only update `have` when a character count crosses the threshold.

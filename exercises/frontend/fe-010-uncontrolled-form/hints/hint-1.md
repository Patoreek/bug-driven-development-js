# Hint 1 (Mild)

The form inputs don't have `value` and `onChange` props. React has no way to control or reset what they display. Notice how `handleReset` only sets `submitted` to `false` but doesn't clear any input values.

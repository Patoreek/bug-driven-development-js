# Hint 2 -- Medium

The assignment `acc[key] = [item]` creates a **brand new** single-element array every time. You need to either check if `acc[key]` already exists and push to it, or use a pattern like `acc[key] = [...(acc[key] || []), item]`.

The same pattern applies to `countBy` -- you need to read the existing count before setting the new one.

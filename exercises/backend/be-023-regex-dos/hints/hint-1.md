# Hint 1 -- Mild

Look for the pattern `(X+)+` or `(X*)*` in each regex. These nested quantifiers are the root cause. When the overall match fails, the regex engine backtracks through exponentially many ways to divide the input between the inner and outer quantifiers.

For example, `^([a-z0-9-]+)+$` applied to `"aaa!"` tries: can the inner `+` match all of "aaa"? No, because "!" fails the `$`. Can the inner `+` match "aa" and then "a"? Still fails. Can it match "a" then "aa"? Still fails. For each split, there are further sub-splits to try.

The fix is to remove the redundant outer quantifier -- `^[a-z0-9-]+$` matches the same valid inputs without the nesting.

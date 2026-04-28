# Solution: ReDoS -- Catastrophic Backtracking in Validation

## The Problem

The regex patterns contained **nested quantifiers** that cause exponential backtracking:

```typescript
// Vulnerable patterns:
const emailRegex = /^([a-zA-Z0-9._%-]+)+@.../;  // (+)+
const urlRegex   = /^...([\w.-]+)+(\.[\w.-]+)+.../;  // (+)+
const safeRegex  = /^([a-zA-Z0-9 ]*|[a-zA-Z0-9 _-]*)*$/;  // (|)*
const slugRegex  = /^([a-z0-9-]+)+$/;  // (+)+
```

When the regex engine encounters a string that **almost matches** but ultimately fails, it backtracks through every possible way to distribute characters between the inner and outer quantifiers. For `([a-z0-9-]+)+` applied to a 25-character string ending with `!`, this means roughly 2^25 (33 million) combinations to try. Each additional character doubles the time.

## The Fix

Remove nested quantifiers and overlapping alternations:

```typescript
// Before (vulnerable):
const emailRegex = /^([a-zA-Z0-9._%-]+)+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// After (safe):
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Before (vulnerable):
const urlRegex = /^(https?:\/\/)?([\w.-]+)+(\.[\w.-]+)+([\/\w ...]*)*$/;
// After (safe):
const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

// Before (vulnerable):
const safeRegex = /^([a-zA-Z0-9 ]*|[a-zA-Z0-9 _-]*)*$/;
// After (safe):
const safeRegex = /^[a-zA-Z0-9 _-]*$/;

// Before (vulnerable):
const slugRegex = /^([a-z0-9-]+)+$/;
// After (safe):
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
```

### Why the fix works

- **Email**: `([...]+)+` becomes `[...]+` -- the outer group was redundant. The inner `+` already matches one or more characters.
- **URL**: Removed nested `([\w.-]+)+` and simplified the path portion to a single non-whitespace match.
- **JSON-safe**: The two alternation branches `[a-zA-Z0-9 ]*` and `[a-zA-Z0-9 _-]*` overlapped heavily. Merging them into one `[a-zA-Z0-9 _-]*` eliminates the ambiguity.
- **Slug**: `([a-z0-9-]+)+` becomes `[a-z0-9]+(?:-[a-z0-9]+)*` which matches the same valid slugs but uses non-capturing groups with explicit structure, preventing nesting.

## How Catastrophic Backtracking Works

For the pattern `^(A+)+$` tested against `"AAAX"`:

1. The engine tries `(AAAA)` -- fails at `$` because of `X`
2. Backtracks: tries `(AAA)(A)` -- still fails
3. Tries `(AA)(AA)` -- still fails
4. Tries `(AA)(A)(A)` -- still fails
5. Tries `(A)(AAA)` -- still fails
6. ... and so on for every possible partition

With N characters, there are 2^(N-1) ways to partition them. This is why adding just one character to the attack string roughly doubles the execution time.

## Common Variations

- **Nested `*` quantifiers**: `(a*)*` is equally dangerous
- **Overlapping alternation**: `(a|a)*` or `(ab|a)*` cause the same issue
- **Greedy vs lazy**: Neither `+?` nor `+` fixes the nesting -- both are vulnerable
- **Real-world regexes**: Stack Overflow's 2016 outage was caused by a ReDoS in a regex parsing HTML content

## Documentation

- [OWASP: ReDoS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)
- [Catastrophic Backtracking (regular-expressions.info)](https://www.regular-expressions.info/catastrophic.html)
- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices#denial-of-service-of-http-server-redos)

## Interview Context

ReDoS is a common topic in security-focused backend interviews. Interviewers may show a regex and ask "what's wrong with this?" or ask how to protect a server from regex-based DoS. Key points to mention: avoid nested quantifiers, use linear-time regex engines (like RE2) for untrusted input, apply input length limits, and test regex patterns with tools like [safe-regex](https://github.com/substack/safe-regex). In Node.js specifically, regex runs on the main thread, so a hanging regex blocks the entire event loop -- making this a single-request DoS vector.

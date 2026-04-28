# Hint 2 -- Medium

Here are the specific vulnerable patterns and what to look for:

1. **Email**: `([a-zA-Z0-9._%-]+)+` -- the `()+` wrapping `[]+` is redundant. Remove the outer group and `+`.

2. **URL**: `([\w.-]+)+(\.[\w.-]+)+` and `([\/\w ...]*)*` -- both have nested quantifiers. Simplify to non-repeating groups.

3. **JSON-safe**: `([a-zA-Z0-9 ]*|[a-zA-Z0-9 _-]*)*` -- the two alternation branches overlap (both match `a-zA-Z0-9` and spaces), and the outer `*` causes exponential splits. Replace with a single character class: `[a-zA-Z0-9 _-]*`.

4. **Slug**: `([a-z0-9-]+)+` -- classic ReDoS. Replace with `[a-z0-9]+(?:-[a-z0-9]+)*` to enforce no leading/trailing hyphens while avoiding nesting.

The general principle: never nest quantifiers where the inner pattern can match an empty string or overlaps with the outer pattern.

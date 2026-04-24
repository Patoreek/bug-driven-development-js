# Hint 2

`.map()` calls the callback with `(element, index, array)`. `parseInt` accepts `(string, radix)`. When you write `.map(parseInt)`, the **array index** gets used as the **radix** (number base). So `parseInt("2", 1)` means "parse 2 in base 1" — which is `NaN`.

# Hint 2 (Medium)

Use `crypto.timingSafeEqual(bufA, bufB)`. It requires two `Buffer` objects of **equal length**. You need to handle the case where strings have different lengths without leaking that information through timing. If lengths differ, still perform a comparison (against a dummy) to take constant time, then return `false`.

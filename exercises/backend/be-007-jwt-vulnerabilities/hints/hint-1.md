# Hint 1 (Mild)

Look at what happens when `header.alg` is `"none"`. The function skips signature verification entirely. Should a server ever accept unsigned tokens? What about the `exp` and `iss` fields in the payload -- are they being checked?

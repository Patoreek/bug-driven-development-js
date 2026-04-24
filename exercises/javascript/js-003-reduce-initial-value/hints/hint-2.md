# Hint 2

`Array.reduce()` accepts an optional **second argument**: the initial value for the accumulator. Without it, the first array element is used as the accumulator — which is a problem when the array is empty (throws TypeError) or when the elements are objects but you want a number/array/object accumulator.

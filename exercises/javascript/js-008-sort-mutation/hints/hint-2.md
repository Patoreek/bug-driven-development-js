# Hint 2

`.sort()` **mutates the original array** in place and returns a reference to the same array. Writing `const sorted = arr.sort()` does NOT create a copy — `sorted` and `arr` are the same object.

You need to create a copy of the array **before** sorting it. There are several ways to copy an array in JavaScript.

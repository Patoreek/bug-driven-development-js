# Hint 2 -- Medium

The code uses `Map` where it should use `WeakMap`. The key difference:

- **Map** holds **strong references** to keys -- the key object cannot be garbage-collected as long as it's in the Map.
- **WeakMap** holds **weak references** to keys -- if nothing else references the key, the entry is automatically garbage-collected.

`WeakMap` has a restricted API: no `.size`, no `.entries()`, no `.keys()`, no `.values()`, no `.forEach()`. You can only use `.get()`, `.set()`, `.has()`, and `.delete()`.

You need to remove any methods from the returned API that rely on iterability or size.

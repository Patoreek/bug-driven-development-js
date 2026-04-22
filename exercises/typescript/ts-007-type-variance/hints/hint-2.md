# Hint 2 (Medium)

Think through each case:

1. **ReadonlyBox**: The `set()` method lets you write a value of type `T`. If `ReadonlyBox<Dog>` is assigned to `ReadonlyBox<Animal>`, someone could call `set(cat)` on it. Remove `set()` to make it safely covariant.

2. **DogHandler as AnimalHandler**: A `DogHandler` expects a `Dog` (with `breed`, `fetch()`). If used as an `AnimalHandler`, it could receive a plain `Animal` that doesn't have those properties. The cast `handler as AnimalHandler` is a lie.

3. **AnimalFactory as DogFactory**: A factory that returns `Animal` might not return a `Dog`. You can't safely pretend it's a `DogFactory`.

4. **Mutable arrays**: TypeScript treats arrays as covariant (an unsoundness for practical reasons), but you should still avoid pushing a `Dog` into what might be a `GuideDog[]`.

The tests expect you to REMOVE the unsound functions, not fix them.

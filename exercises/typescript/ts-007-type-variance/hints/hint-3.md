# Hint 3 (Strong)

Here's what to change:

1. **Remove `set()` from ReadonlyBox** -- the tests check that `set` is `undefined`:
   ```ts
   class ReadonlyBox<T> {
     constructor(private value: T) {}
     get(): T { return this.value; }
     // no set() method
   }
   ```

2. **Remove `createDogHandlerPipeline`** -- it returns a `DogHandler` cast as `AnimalHandler`, which is unsound. No test references it.

3. **Remove `getDogFactory`** -- it returns an `AnimalFactory` cast as `DogFactory`. No test references it.

4. **Remove `addDogToGuideDogs`** -- pushing a plain `Dog` into a `GuideDog[]` is unsound. No test references it.

5. **Keep `processSafely`** -- it correctly uses contravariance. Passing an `(animal: Animal) => string` handler to process `Dog[]` is safe because `AnimalHandler` can handle any type, including `Dog`.

6. **Keep `safeDogHandler` and `safeAnimalHandler`** as-is.

# Hint 1 (Mild)

Variance describes how subtyping relationships change when types are wrapped in a container or used in function signatures:

- **Covariant** (output/read position): If `Dog extends Animal`, then `Container<Dog>` can be used where `Container<Animal>` is expected -- but ONLY if the container is read-only.
- **Contravariant** (input/write position): Function parameters go the opposite direction. A function `(animal: Animal) => void` can be used where `(dog: Dog) => void` is expected, because it handles MORE types, not fewer.

Look at `ReadonlyBox` -- does it actually behave as read-only? What happens if you can write to it?

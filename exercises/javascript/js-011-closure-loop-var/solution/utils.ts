/**
 * Creates an array of n callback functions.
 * Each callback should return its own index (0, 1, 2, ..., n-1).
 *
 * Example: createTimers(3) => [fn0, fn1, fn2]
 *   fn0() should return 0
 *   fn1() should return 1
 *   fn2() should return 2
 */
export function createTimers(n: number): (() => number)[] {
  const callbacks: (() => number)[] = [];

  // FIX: Use `let` instead of `var`. `let` is block-scoped,
  // so each iteration of the loop creates a new binding.
  for (let i = 0; i < n; i++) {
    callbacks.push(() => i);
  }

  return callbacks;
}

/**
 * Creates click handler functions for a list of button labels.
 * Each handler should return a message including the button's index
 * and its label.
 *
 * Example: createHandlers(["Save", "Cancel"])
 *   handler0() => "Button 0: Save"
 *   handler1() => "Button 1: Cancel"
 */
export function createHandlers(
  labels: string[]
): (() => string)[] {
  const handlers: (() => string)[] = [];

  // FIX: Use `let` for block scoping
  for (let i = 0; i < labels.length; i++) {
    handlers.push(() => `Button ${i}: ${labels[i]}`);
  }

  return handlers;
}

/**
 * Creates an array of multiplier functions.
 * Each function should multiply its input by a different factor (1, 2, 3, ..., n).
 *
 * Example: createMultipliers(3) => [mul1, mul2, mul3]
 *   mul1(5) => 5   (5 * 1)
 *   mul2(5) => 10  (5 * 2)
 *   mul3(5) => 15  (5 * 3)
 */
export function createMultipliers(n: number): ((x: number) => number)[] {
  const multipliers: ((x: number) => number)[] = [];

  // FIX: Use `let` for block scoping
  for (let factor = 1; factor <= n; factor++) {
    multipliers.push((x: number) => x * factor);
  }

  return multipliers;
}

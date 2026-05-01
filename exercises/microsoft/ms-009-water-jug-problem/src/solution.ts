// BUGGY: BFS approach — O(x*y) time and space, TLE on large inputs
export function canMeasureWater(x: number, y: number, z: number): boolean {
  if (z === 0) return true;
  if (x + y < z) return false;

  const visited = new Set<string>();
  const queue: [number, number][] = [[0, 0]];
  visited.add("0,0");

  while (queue.length > 0) {
    const [a, b] = queue.shift()!;

    if (a === z || b === z || a + b === z) return true;

    const nextStates: [number, number][] = [
      [x, b], // Fill jug 1
      [a, y], // Fill jug 2
      [0, b], // Empty jug 1
      [a, 0], // Empty jug 2
      // Pour jug 1 -> jug 2
      [a - Math.min(a, y - b), b + Math.min(a, y - b)],
      // Pour jug 2 -> jug 1
      [a + Math.min(b, x - a), b - Math.min(b, x - a)],
    ];

    for (const [na, nb] of nextStates) {
      const key = `${na},${nb}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([na, nb]);
      }
    }
  }

  return false;
}

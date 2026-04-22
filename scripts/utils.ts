import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
export const EXERCISES_DIR = path.join(ROOT, "exercises");
export const SANDBOX_DIR = path.join(ROOT, "sandbox");
export const META_FILE = path.join(SANDBOX_DIR, ".exercise-meta.json");

export interface ExerciseJson {
  id: string;
  title: string;
  category: "frontend" | "backend" | "fullstack" | "typescript" | "testing";
  difficulty: number;
  tags: string[];
  concepts: string[];
  estimatedMinutes: number;
  prerequisites: string[];
  testCommand: string;
  files: {
    buggy: string[];
    testFiles: string[];
    solutionFiles: string[];
  };
}

export interface ExerciseEntry {
  id: string;
  meta: ExerciseJson;
  dir: string;
}

export async function getAllExercises(): Promise<ExerciseEntry[]> {
  const files = await glob("**/exercise.json", { cwd: EXERCISES_DIR });
  const exercises: ExerciseEntry[] = [];

  for (const file of files) {
    const fullPath = path.join(EXERCISES_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const meta: ExerciseJson = JSON.parse(raw);
    exercises.push({
      id: meta.id,
      meta,
      dir: path.dirname(fullPath),
    });
  }

  return exercises.sort((a, b) => a.id.localeCompare(b.id));
}

export function findExercise(
  exercises: ExerciseEntry[],
  query: string
): ExerciseEntry | undefined {
  // Exact match first
  const exact = exercises.find((e) => e.id === query);
  if (exact) return exact;

  // Partial/fuzzy match
  const lower = query.toLowerCase();
  return exercises.find(
    (e) =>
      e.id.toLowerCase().includes(lower) ||
      e.meta.title.toLowerCase().includes(lower)
  );
}

export function getActiveExercise(): { id: string; dir: string } | null {
  if (!fs.existsSync(META_FILE)) return null;
  const raw = fs.readFileSync(META_FILE, "utf-8");
  return JSON.parse(raw);
}

export function difficultyStars(n: number): string {
  return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
}

import fs from "fs";
import path from "path";
import chalk from "chalk";
import {
  getAllExercises,
  findExercise,
  SANDBOX_DIR,
  META_FILE,
  difficultyStars,
} from "./utils.js";

function copyDirSync(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function clearSandbox() {
  if (!fs.existsSync(SANDBOX_DIR)) {
    fs.mkdirSync(SANDBOX_DIR, { recursive: true });
    return;
  }
  for (const entry of fs.readdirSync(SANDBOX_DIR)) {
    if (entry === ".gitkeep") continue;
    const fullPath = path.join(SANDBOX_DIR, entry);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

async function main() {
  const query = process.argv[2];

  if (!query) {
    console.log(chalk.red("Usage: npm run exercise -- <exercise-id>"));
    console.log(chalk.gray("Example: npm run exercise -- fe-001"));
    console.log(chalk.gray("Run `npm run exercise:list` to see all exercises."));
    process.exit(1);
  }

  const exercises = await getAllExercises();
  const exercise = findExercise(exercises, query);

  if (!exercise) {
    console.log(chalk.red(`Exercise not found: "${query}"`));
    console.log(chalk.gray("Run `npm run exercise:list` to see all exercises."));
    process.exit(1);
  }

  // Clear and populate sandbox
  clearSandbox();

  // Copy src/ directory
  const srcDir = path.join(exercise.dir, "src");
  if (fs.existsSync(srcDir)) {
    copyDirSync(srcDir, path.join(SANDBOX_DIR, "src"));
  }

  // Copy README.md
  const readme = path.join(exercise.dir, "README.md");
  if (fs.existsSync(readme)) {
    fs.copyFileSync(readme, path.join(SANDBOX_DIR, "README.md"));
  }

  // Copy hints/
  const hintsDir = path.join(exercise.dir, "hints");
  if (fs.existsSync(hintsDir)) {
    copyDirSync(hintsDir, path.join(SANDBOX_DIR, "hints"));
  }

  // Write meta file
  fs.writeFileSync(
    META_FILE,
    JSON.stringify({ id: exercise.id, dir: exercise.dir }, null, 2)
  );

  // Display exercise info
  console.log(chalk.bold.green(`\n  Exercise loaded: ${exercise.meta.title}\n`));
  console.log(`  ID:         ${chalk.cyan(exercise.id)}`);
  console.log(`  Difficulty: ${difficultyStars(exercise.meta.difficulty)}`);
  console.log(`  Time:       ~${exercise.meta.estimatedMinutes} minutes`);
  console.log(`  Tags:       ${exercise.meta.tags.join(", ")}`);
  console.log(`  Concepts:   ${exercise.meta.concepts.join(", ")}`);

  if (exercise.meta.prerequisites.length > 0) {
    console.log(
      `  Prereqs:    ${exercise.meta.prerequisites.join(", ")}`
    );
  }

  console.log(chalk.gray("\n  Files copied to ./sandbox/"));
  console.log(chalk.gray("  Read the exercise: sandbox/README.md"));
  console.log(
    chalk.yellow("\n  Run tests: npm run test:exercise")
  );
  console.log(chalk.yellow("  Get a hint: npm run exercise:hint\n"));
}

main().catch(console.error);

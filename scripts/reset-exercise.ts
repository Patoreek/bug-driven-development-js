import fs from "fs";
import path from "path";
import chalk from "chalk";
import { getActiveExercise, SANDBOX_DIR } from "./utils.js";

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

function main() {
  const active = getActiveExercise();

  if (!active) {
    console.log(chalk.red("No active exercise. Start one first:"));
    console.log(chalk.gray("  npm run exercise -- <exercise-id>"));
    process.exit(1);
  }

  // Clear sandbox src/ and re-copy from exercise
  const sandboxSrc = path.join(SANDBOX_DIR, "src");
  if (fs.existsSync(sandboxSrc)) {
    fs.rmSync(sandboxSrc, { recursive: true, force: true });
  }

  const exerciseSrc = path.join(active.dir, "src");
  if (fs.existsSync(exerciseSrc)) {
    copyDirSync(exerciseSrc, sandboxSrc);
  }

  console.log(chalk.green(`\n  Exercise "${active.id}" reset to original state.\n`));
  console.log(chalk.yellow("  Run tests: npm run test:exercise\n"));
}

main();

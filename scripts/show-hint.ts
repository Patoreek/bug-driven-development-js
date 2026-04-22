import fs from "fs";
import path from "path";
import chalk from "chalk";
import { getActiveExercise, SANDBOX_DIR } from "./utils.js";

const HINT_TRACKER = path.join(SANDBOX_DIR, ".hint-level");

function main() {
  const active = getActiveExercise();

  if (!active) {
    console.log(chalk.red("No active exercise. Start one first:"));
    console.log(chalk.gray("  npm run exercise -- <exercise-id>"));
    process.exit(1);
  }

  // Read current hint level
  let level = 1;
  if (fs.existsSync(HINT_TRACKER)) {
    level = parseInt(fs.readFileSync(HINT_TRACKER, "utf-8").trim(), 10) || 1;
  }

  const hintFile = path.join(SANDBOX_DIR, "hints", `hint-${level}.md`);

  if (!fs.existsSync(hintFile)) {
    console.log(
      chalk.yellow(`\n  No more hints available (showed ${level - 1} of 3).\n`)
    );
    console.log(
      chalk.gray(
        "  Check the solution: exercises/.../" +
          active.id +
          "/solution/EXPLANATION.md\n"
      )
    );
    return;
  }

  const content = fs.readFileSync(hintFile, "utf-8");

  const labels = ["Mild nudge", "Getting warmer", "Strong hint"];
  console.log(
    chalk.bold.yellow(`\n  Hint ${level}/3 — ${labels[level - 1] || "Hint"}\n`)
  );
  console.log(
    content
      .split("\n")
      .map((line) => "  " + line)
      .join("\n")
  );
  console.log();

  // Increment hint level
  fs.writeFileSync(HINT_TRACKER, String(level + 1));

  if (level < 3) {
    console.log(
      chalk.gray("  Run again for the next hint: npm run exercise:hint\n")
    );
  }
}

main();

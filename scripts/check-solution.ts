import { execSync } from "child_process";
import chalk from "chalk";
import { getActiveExercise } from "./utils.js";

function main() {
  const active = getActiveExercise();

  if (!active) {
    console.log(chalk.red("No active exercise. Start one first:"));
    console.log(chalk.gray("  npm run exercise -- <exercise-id>"));
    process.exit(1);
  }

  console.log(
    chalk.cyan(`\n  Checking solution for: ${active.id}\n`)
  );

  try {
    execSync("npx vitest run --config vitest.sandbox.config.ts", {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    console.log(chalk.bold.green("\n  All tests passed! Great job!\n"));
    console.log(
      chalk.gray(
        "  Check the explanation: exercises/.../" +
          active.id +
          "/solution/EXPLANATION.md"
      )
    );
    console.log(
      chalk.gray("  Next exercise: npm run exercise:list\n")
    );
  } catch {
    console.log(chalk.red("\n  Some tests failed. Keep working!\n"));
    console.log(chalk.yellow("  Get a hint: npm run exercise:hint"));
    console.log(chalk.yellow("  Reset: npm run exercise:reset\n"));
    process.exit(1);
  }
}

main();

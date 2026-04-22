import chalk from "chalk";
import { getAllExercises, difficultyStars, type ExerciseEntry } from "./utils.js";

async function main() {
  const exercises = await getAllExercises();

  if (exercises.length === 0) {
    console.log(chalk.yellow("No exercises found. Generate some first!"));
    process.exit(0);
  }

  const categories = new Map<string, ExerciseEntry[]>();
  for (const ex of exercises) {
    const cat = ex.meta.category;
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(ex);
  }

  const categoryLabels: Record<string, string> = {
    frontend: "Frontend (React / Next.js)",
    backend: "Backend (Node.js / API)",
    fullstack: "Fullstack",
    typescript: "TypeScript",
    testing: "Testing (Unit / Integration)",
  };

  for (const [cat, exs] of categories) {
    console.log(
      `\n${chalk.bold.cyan(categoryLabels[cat] || cat)} (${exs.length} exercises)\n`
    );
    console.log(
      chalk.gray(
        `  ${"ID".padEnd(35)} ${"Title".padEnd(45)} ${"Diff".padEnd(7)} ${"Time".padEnd(6)} Tags`
      )
    );
    console.log(chalk.gray("  " + "-".repeat(110)));

    for (const ex of exs) {
      const id = chalk.green(ex.id.padEnd(35));
      const title = ex.meta.title.padEnd(45);
      const diff = difficultyStars(ex.meta.difficulty).padEnd(7);
      const time = `${ex.meta.estimatedMinutes}m`.padEnd(6);
      const tags = chalk.gray(ex.meta.tags.join(", "));
      console.log(`  ${id} ${title} ${diff} ${time} ${tags}`);
    }
  }

  console.log(
    `\n${chalk.bold(`Total: ${exercises.length} exercises`)}\n`
  );
  console.log(
    chalk.gray("Start an exercise: npm run exercise -- <exercise-id>\n")
  );
}

main().catch(console.error);

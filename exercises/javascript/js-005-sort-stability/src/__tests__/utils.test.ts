import { describe, it, expect } from "vitest";
import { sortEmployees, sortTasks } from "../utils";
import type { Employee, Task } from "../utils";

describe("sortEmployees", () => {
  const employees: Employee[] = [
    { name: "Alice", department: "Engineering", salary: 120000 },
    { name: "Bob", department: "Marketing", salary: 85000 },
    { name: "Charlie", department: "Engineering", salary: 95000 },
    { name: "Diana", department: "Marketing", salary: 110000 },
    { name: "Eve", department: "Engineering", salary: 150000 },
    { name: "Frank", department: "HR", salary: 75000 },
    { name: "Grace", department: "HR", salary: 90000 },
  ];

  it("should sort by department alphabetically", () => {
    const sorted = sortEmployees(employees);
    const departments = sorted.map((e) => e.department);
    expect(departments).toEqual([
      "Engineering",
      "Engineering",
      "Engineering",
      "HR",
      "HR",
      "Marketing",
      "Marketing",
    ]);
  });

  it("should sort by salary descending within each department", () => {
    const sorted = sortEmployees(employees);

    // Engineering department: Eve (150k), Alice (120k), Charlie (95k)
    const engineering = sorted.filter(
      (e) => e.department === "Engineering"
    );
    expect(engineering.map((e) => e.name)).toEqual([
      "Eve",
      "Alice",
      "Charlie",
    ]);
    expect(engineering.map((e) => e.salary)).toEqual([150000, 120000, 95000]);

    // HR department: Grace (90k), Frank (75k)
    const hr = sorted.filter((e) => e.department === "HR");
    expect(hr.map((e) => e.name)).toEqual(["Grace", "Frank"]);

    // Marketing department: Diana (110k), Bob (85k)
    const marketing = sorted.filter((e) => e.department === "Marketing");
    expect(marketing.map((e) => e.name)).toEqual(["Diana", "Bob"]);
  });

  it("should handle employees in a single department", () => {
    const singleDept: Employee[] = [
      { name: "A", department: "Sales", salary: 50000 },
      { name: "B", department: "Sales", salary: 80000 },
      { name: "C", department: "Sales", salary: 60000 },
    ];
    const sorted = sortEmployees(singleDept);
    expect(sorted.map((e) => e.salary)).toEqual([80000, 60000, 50000]);
  });

  it("should handle an empty array", () => {
    expect(sortEmployees([])).toEqual([]);
  });

  it("should not mutate the original array", () => {
    const original = [...employees];
    sortEmployees(employees);
    expect(employees).toEqual(original);
  });
});

describe("sortTasks", () => {
  const tasks: Task[] = [
    { title: "Fix login bug", priority: "high", createdAt: "2024-03-15" },
    { title: "Update docs", priority: "low", createdAt: "2024-03-10" },
    { title: "Code review", priority: "medium", createdAt: "2024-03-12" },
    { title: "Deploy hotfix", priority: "high", createdAt: "2024-03-10" },
    { title: "Write tests", priority: "medium", createdAt: "2024-03-14" },
    { title: "Refactor API", priority: "low", createdAt: "2024-03-08" },
  ];

  it("should sort by priority (high, medium, low)", () => {
    const sorted = sortTasks(tasks);
    const priorities = sorted.map((t) => t.priority);
    expect(priorities).toEqual([
      "high",
      "high",
      "medium",
      "medium",
      "low",
      "low",
    ]);
  });

  it("should sort by creation date (oldest first) within same priority", () => {
    const sorted = sortTasks(tasks);

    // High priority: Deploy hotfix (Mar 10) before Fix login bug (Mar 15)
    const highPriority = sorted.filter((t) => t.priority === "high");
    expect(highPriority.map((t) => t.title)).toEqual([
      "Deploy hotfix",
      "Fix login bug",
    ]);

    // Medium priority: Code review (Mar 12) before Write tests (Mar 14)
    const mediumPriority = sorted.filter((t) => t.priority === "medium");
    expect(mediumPriority.map((t) => t.title)).toEqual([
      "Code review",
      "Write tests",
    ]);

    // Low priority: Refactor API (Mar 8) before Update docs (Mar 10)
    const lowPriority = sorted.filter((t) => t.priority === "low");
    expect(lowPriority.map((t) => t.title)).toEqual([
      "Refactor API",
      "Update docs",
    ]);
  });

  it("should handle empty array", () => {
    expect(sortTasks([])).toEqual([]);
  });

  it("should handle all same priority", () => {
    const samePriority: Task[] = [
      { title: "C", priority: "medium", createdAt: "2024-03-15" },
      { title: "A", priority: "medium", createdAt: "2024-03-10" },
      { title: "B", priority: "medium", createdAt: "2024-03-12" },
    ];
    const sorted = sortTasks(samePriority);
    expect(sorted.map((t) => t.createdAt)).toEqual([
      "2024-03-10",
      "2024-03-12",
      "2024-03-15",
    ]);
  });
});

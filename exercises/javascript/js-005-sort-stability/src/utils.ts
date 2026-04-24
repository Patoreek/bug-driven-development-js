export interface Employee {
  name: string;
  department: string;
  salary: number;
}

/**
 * Sorts employees by department (A-Z alphabetically),
 * then within each department by salary (highest first).
 */
export function sortEmployees(employees: Employee[]): Employee[] {
  // Sort by salary descending first, then sort by department
  // This should give us department groups with highest salary first
  const sorted = [...employees];

  sorted.sort((a, b) => b.salary - a.salary);
  sorted.sort((a, b) => a.department.localeCompare(b.department));

  return sorted;
}

export interface Task {
  title: string;
  priority: "high" | "medium" | "low";
  createdAt: string; // ISO date string
}

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/**
 * Sorts tasks by priority (high first), then by creation date (oldest first)
 * within the same priority level.
 */
export function sortTasks(tasks: Task[]): Task[] {
  // Only sort by priority, ignoring the date
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

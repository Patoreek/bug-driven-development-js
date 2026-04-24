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
  return [...employees].sort((a, b) => {
    const deptCompare = a.department.localeCompare(b.department);
    if (deptCompare !== 0) return deptCompare;
    return b.salary - a.salary; // descending salary within department
  });
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
  return [...tasks].sort((a, b) => {
    const priorityCompare =
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityCompare !== 0) return priorityCompare;
    return a.createdAt.localeCompare(b.createdAt); // oldest first
  });
}

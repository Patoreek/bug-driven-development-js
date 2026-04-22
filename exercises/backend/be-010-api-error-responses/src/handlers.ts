// Simulated database
const tasks = new Map<string, { id: string; title: string; completed: boolean }>([
  ["1", { id: "1", title: "Buy groceries", completed: false }],
  ["2", { id: "2", title: "Write tests", completed: true }],
]);

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

export function getTask(id: string): ApiResponse {
  if (!id) {
    // BUG: Wrong format and wrong status code
    return { status: 500, body: { msg: "ID is required" } };
  }

  const task = tasks.get(id);
  if (!task) {
    // BUG: Returns 200 for not found, wrong format
    return { status: 200, body: { message: "Task not found" } };
  }

  return { status: 200, body: { data: task } };
}

export function createTask(data: { title?: string }): ApiResponse {
  if (!data.title || data.title.trim() === "") {
    // BUG: Wrong status code (500 for validation), wrong format
    return { status: 500, body: { error: "Title is required" } };
  }

  if (data.title.length > 100) {
    // BUG: Wrong status code, inconsistent format
    return { status: 200, body: { msg: "Title too long" } };
  }

  const id = String(tasks.size + 1);
  const task = { id, title: data.title.trim(), completed: false };
  tasks.set(id, task);

  return { status: 201, body: { data: task } };
}

export function deleteTask(id: string): ApiResponse {
  if (!id) {
    // BUG: Inconsistent format
    return { status: 500, body: { message: "ID is required" } };
  }

  const task = tasks.get(id);
  if (!task) {
    // BUG: Returns 500 for not found, wrong format
    return { status: 500, body: { error: "not found" } };
  }

  tasks.delete(id);
  return { status: 200, body: { data: { success: true } } };
}

export function updateTask(
  id: string,
  data: { title?: string; completed?: boolean }
): ApiResponse {
  if (!id) {
    // BUG: Wrong format
    return { status: 500, body: { msg: "ID is required" } };
  }

  const task = tasks.get(id);
  if (!task) {
    // BUG: Returns 200 for not found
    return { status: 200, body: { error: "Task does not exist" } };
  }

  if (data.title !== undefined && data.title.trim() === "") {
    // BUG: Wrong status code, wrong format
    return { status: 500, body: { message: "Title cannot be empty" } };
  }

  const updated = {
    ...task,
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.completed !== undefined && { completed: data.completed }),
  };
  tasks.set(id, updated);

  return { status: 200, body: { data: updated } };
}

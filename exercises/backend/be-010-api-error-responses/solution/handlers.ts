// Simulated database
const tasks = new Map<string, { id: string; title: string; completed: boolean }>([
  ["1", { id: "1", title: "Buy groceries", completed: false }],
  ["2", { id: "2", title: "Write tests", completed: true }],
]);

export interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

function errorResponse(
  status: number,
  code: string,
  message: string
): ApiResponse {
  return { status, body: { error: { code, message } } };
}

export function getTask(id: string): ApiResponse {
  if (!id) {
    return errorResponse(400, "VALIDATION_ERROR", "ID is required");
  }

  const task = tasks.get(id);
  if (!task) {
    return errorResponse(404, "NOT_FOUND", "Task not found");
  }

  return { status: 200, body: { data: task } };
}

export function createTask(data: { title?: string }): ApiResponse {
  if (!data.title || data.title.trim() === "") {
    return errorResponse(400, "VALIDATION_ERROR", "Title is required");
  }

  if (data.title.length > 100) {
    return errorResponse(400, "VALIDATION_ERROR", "Title too long");
  }

  const id = String(tasks.size + 1);
  const task = { id, title: data.title.trim(), completed: false };
  tasks.set(id, task);

  return { status: 201, body: { data: task } };
}

export function deleteTask(id: string): ApiResponse {
  if (!id) {
    return errorResponse(400, "VALIDATION_ERROR", "ID is required");
  }

  const task = tasks.get(id);
  if (!task) {
    return errorResponse(404, "NOT_FOUND", "Task not found");
  }

  tasks.delete(id);
  return { status: 200, body: { data: { success: true } } };
}

export function updateTask(
  id: string,
  data: { title?: string; completed?: boolean }
): ApiResponse {
  if (!id) {
    return errorResponse(400, "VALIDATION_ERROR", "ID is required");
  }

  const task = tasks.get(id);
  if (!task) {
    return errorResponse(404, "NOT_FOUND", "Task not found");
  }

  if (data.title !== undefined && data.title.trim() === "") {
    return errorResponse(400, "VALIDATION_ERROR", "Title cannot be empty");
  }

  const updated = {
    ...task,
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.completed !== undefined && { completed: data.completed }),
  };
  tasks.set(id, updated);

  return { status: 200, body: { data: updated } };
}

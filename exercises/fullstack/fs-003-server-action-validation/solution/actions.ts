import { z } from "zod/v4";

// Simulated database
const tickets: Array<{
  id: string;
  title: string;
  description: string;
  priority: number;
  email: string;
  createdAt: Date;
}> = [];

let nextId = 1;

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  ticket?: (typeof tickets)[number];
};

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string().min(1, "Description is required"),
  priority: z.coerce.number().int().min(1, "Priority must be between 1 and 5").max(5, "Priority must be between 1 and 5"),
  email: z.email("Invalid email address"),
});

export async function createTicket(formData: FormData): Promise<ActionResult> {
  const raw = {
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    priority: formData.get("priority") ?? "",
    email: formData.get("email") ?? "",
  };

  const result = ticketSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  const ticket = {
    id: `TICKET-${nextId++}`,
    ...result.data,
    createdAt: new Date(),
  };

  tickets.push(ticket);

  return { success: true, ticket };
}

export function getTickets() {
  return [...tickets];
}

export function clearTickets() {
  tickets.length = 0;
  nextId = 1;
}

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

// BUG: No validation on form data -- trusts raw input directly
export async function createTicket(formData: FormData): Promise<ActionResult> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = Number(formData.get("priority"));
  const email = formData.get("email") as string;

  const ticket = {
    id: `TICKET-${nextId++}`,
    title,
    description,
    priority,
    email,
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

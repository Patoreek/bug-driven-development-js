import { z } from "zod";

const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});

export interface CreateProductResponse {
  status: number;
  body: {
    product?: {
      id: string;
      name: string;
      price: number;
      category: string;
    };
    error?: string;
    errors?: Array<{ field: string; message: string }>;
  };
}

let nextId = 1;

export async function handleCreateProduct(
  body: unknown
): Promise<CreateProductResponse> {
  const result = CreateProductSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "unknown"),
      message: issue.message,
    }));

    return {
      status: 400,
      body: {
        error: "Validation failed",
        errors,
      },
    };
  }

  const { name, price, category } = result.data;

  const product = {
    id: String(nextId++),
    name,
    price,
    category,
  };

  return {
    status: 201,
    body: { product },
  };
}

// BUG: This handler accepts user input without any validation.
// Invalid data (empty strings, negative prices, wrong types) is silently accepted.

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
}

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
  // BUG: No validation — directly destructures and trusts the input
  const { name, price, category } = body as CreateProductRequest;

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

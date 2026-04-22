import { useState, useMemo } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Mouse", price: 29.99, quantity: 150, category: "Electronics" },
  { id: 2, name: "Mechanical Keyboard", price: 89.99, quantity: 75, category: "Electronics" },
  { id: 3, name: "USB-C Hub", price: 45.0, quantity: 200, category: "Electronics" },
  { id: 4, name: "Standing Desk", price: 499.99, quantity: 30, category: "Furniture" },
  { id: 5, name: "Monitor Arm", price: 129.99, quantity: 60, category: "Furniture" },
  { id: 6, name: "Desk Lamp", price: 39.99, quantity: 120, category: "Furniture" },
  { id: 7, name: "Notebook Set", price: 12.99, quantity: 500, category: "Office Supplies" },
  { id: 8, name: "Pen Pack", price: 8.99, quantity: 800, category: "Office Supplies" },
];

// Simulates an expensive computation by tracking call count
let computationCount = 0;

export function getComputationCount() {
  return computationCount;
}

export function resetComputationCount() {
  computationCount = 0;
}

function computeProductStats(products: Product[], sortBy: "name" | "price") {
  computationCount++;

  // Expensive sort
  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  // Expensive aggregation
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

  return { sorted, totalValue, averagePrice, totalItems };
}

export function ProductList() {
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [notes, setNotes] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const { sorted, totalValue, averagePrice, totalItems } = useMemo(
    () => computeProductStats(PRODUCTS, sortBy),
    [sortBy]
  );

  return (
    <div style={{ background: darkMode ? "#333" : "#fff", color: darkMode ? "#fff" : "#333" }}>
      <h2>Product Inventory</h2>

      <div>
        <button data-testid="toggle-theme" onClick={() => setDarkMode((d) => !d)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button data-testid="sort-name" onClick={() => setSortBy("name")}>
          Sort by Name
        </button>
        <button data-testid="sort-price" onClick={() => setSortBy("price")}>
          Sort by Price
        </button>
      </div>

      <textarea
        data-testid="notes-input"
        placeholder="Admin notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div data-testid="stats">
        <p>Total Value: ${totalValue.toFixed(2)}</p>
        <p>Average Price: ${averagePrice.toFixed(2)}</p>
        <p>Total Items: {totalItems}</p>
      </div>

      <ul data-testid="product-list">
        {sorted.map((p) => (
          <li key={p.id} data-testid={`product-${p.id}`}>
            {p.name} — ${p.price.toFixed(2)} (qty: {p.quantity})
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: Omit<CartItem, "quantity">, quantity = 1): void {
    const existing = this.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...item, quantity });
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateQuantity(id: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const item = this.items.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
    }
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotal(): number {
    return Math.round(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100;
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

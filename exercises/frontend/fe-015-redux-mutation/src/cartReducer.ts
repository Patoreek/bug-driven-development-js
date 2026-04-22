export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const initialState: CartState = {
  items: [],
  total: 0,
};

export function cartReducer(
  state: CartState = initialState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        // BUG: Direct mutation of nested object
        existing.quantity += 1;
        state.total = calculateTotal(state.items);
        return state;
      }
      // BUG: Array.push mutates the original array
      state.items.push({ ...action.payload, quantity: 1 });
      state.total = calculateTotal(state.items);
      return state;
    }

    case "REMOVE_ITEM": {
      // BUG: splice mutates the original array
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items.splice(index, 1);
        state.total = calculateTotal(state.items);
      }
      return state;
    }

    case "UPDATE_QUANTITY": {
      // BUG: Direct mutation of nested object
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state.items);
      }
      return state;
    }

    case "CLEAR_CART": {
      // BUG: Mutating properties instead of returning new object
      state.items = [];
      state.total = 0;
      return state;
    }

    default:
      return state;
  }
}

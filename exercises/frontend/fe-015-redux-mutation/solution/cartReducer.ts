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
        const newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: newItems, total: calculateTotal(newItems) };
      }
      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: newItems, total: calculateTotal(newItems) };
    }

    case "CLEAR_CART": {
      return { ...state, items: [], total: 0 };
    }

    default:
      return state;
  }
}

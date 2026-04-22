# Solution: Redux Mutation

## The Problem

The reducer was directly mutating state in every action handler:

```tsx
// push mutates the array
state.items.push({ ...action.payload, quantity: 1 });

// splice mutates the array
state.items.splice(index, 1);

// Direct property assignment mutates the object
existing.quantity += 1;
item.quantity = action.payload.quantity;

// Property assignment on state
state.items = [];
state.total = 0;
```

All these operations modify the existing objects in place and then return the **same reference**. Redux uses `===` to check if state changed. Since the reference is the same, it thinks nothing changed and doesn't notify subscribers.

## The Fix

Every case must return a **new object** with new references for any changed data:

- **ADD_ITEM (new):** `[...state.items, newItem]` instead of `state.items.push()`
- **ADD_ITEM (existing):** `state.items.map()` to create new array with updated item
- **REMOVE_ITEM:** `state.items.filter()` instead of `splice()`
- **UPDATE_QUANTITY:** `state.items.map()` with spread on the changed item
- **CLEAR_CART:** `{ ...state, items: [], total: 0 }` instead of property assignment

## Key Takeaway

Redux reducers must be pure functions. Never use mutating array methods (`push`, `splice`, `sort` in-place) or assign to object properties. Always return new objects using spread (`...`), `Array.map`, `Array.filter`, and `Array.concat`.

Alternatively, Redux Toolkit's `createSlice` uses Immer under the hood, which lets you write "mutating" code that is automatically converted to immutable updates.

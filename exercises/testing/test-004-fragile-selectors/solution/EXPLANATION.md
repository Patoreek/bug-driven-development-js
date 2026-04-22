# Explanation: Fragile Test Selectors

## Why the Tests Were Flawed

The original tests used `container.querySelector` and `container.querySelectorAll` with raw CSS selectors to find elements. This creates tests that are **tightly coupled to the DOM structure** rather than the user-facing behavior. When a developer changes a class name, wraps elements in a new `<div>`, or restructures the markup, these tests break -- even though the feature works exactly the same for users.

This is one of the most common causes of **test maintenance burden**. Teams end up spending more time updating broken selectors than catching real bugs.

## What Was Wrong

```tsx
// BEFORE: Fragile container queries
const heading = container.querySelector("h1");
expect(heading?.textContent).toBe("My Todo List");

const input = container.querySelector("input[type='text']") as HTMLInputElement;
const deleteButtons = container.querySelectorAll("li button");
await user.click(deleteButtons[0]); // index-based, breaks if order changes
```

Key issues:
1. **`container.querySelector("h1")`** -- breaks if heading level changes to `<h2>`
2. **`container.querySelectorAll("li")`** -- breaks if list markup changes
3. **`container.querySelector("input[type='text']")`** -- finds by implementation detail, not by what the user sees
4. **`querySelectorAll("li button")[0]`** -- index-based selection is fragile and unclear
5. **Style attribute checks** -- testing `style.textDecoration` is testing implementation, not behavior

## What Makes Good Test Selectors

```tsx
// AFTER: Accessible, resilient queries
expect(screen.getByRole("heading", { name: "My Todo List" })).toBeInTheDocument();

await user.type(screen.getByLabelText("Add a task"), "New task");
await user.click(screen.getByRole("button", { name: "Add" }));

await user.click(screen.getByRole("button", { name: "Delete Buy groceries" }));
```

React Testing Library's query priority:
1. **`getByRole`** -- the gold standard; queries the accessibility tree
2. **`getByLabelText`** -- for form controls with labels
3. **`getByText`** -- for non-interactive content
4. **`getByTestId`** -- last resort when no accessible query works

Benefits:
- Tests break only when **behavior** changes, not when markup is restructured
- Tests double as **accessibility verification** -- if you can't query by role, the component may not be accessible
- Tests read like **user interactions**, making them easier to understand

## Interview Context

This comes up frequently in frontend interviews:
- "How do you write tests that don't break on refactors?"
- "What's the difference between testing implementation details vs behavior?"
- "Why does React Testing Library not expose `querySelector` as the primary API?"

The key insight is that **good tests mirror how users interact with the UI** -- users don't find buttons by CSS selector, they find them by their visible label. Tests should do the same.

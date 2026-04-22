# Hint 3 (Strong)

Replace synchronous queries with async ones after the click:

```tsx
// Instead of:
expect(screen.getByText("React Testing")).toBeInTheDocument();

// Use:
expect(await screen.findByText("React Testing")).toBeInTheDocument();
```

For the error test, use `waitFor`:
```tsx
await waitFor(() => {
  expect(screen.getByRole("alert")).toHaveTextContent("API is down");
});
```

Don't forget to import `waitFor` from `@testing-library/react`:
```tsx
import { render, screen, waitFor } from "@testing-library/react";
```

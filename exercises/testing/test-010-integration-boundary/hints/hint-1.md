# Hint 1 (Mild)

Look at the top of the test file: `vi.mock("react", ...)` replaces React's own `useState` and `useEffect` with mocks. Each test then manually choreographs the return values of 7 `useState` calls. This is testing the wiring of the component, not its behavior. The component already accepts `apiClient` as a prop -- that's the natural boundary to mock at.

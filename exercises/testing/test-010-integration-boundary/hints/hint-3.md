# Hint 3 (Strong)

Here's the complete approach for the key tests:

```tsx
// Loading state: use a never-resolving promise
it("should show loading state initially", () => {
  const apiClient = {
    getUser: vi.fn().mockReturnValue(new Promise(() => {})),
    updateUser: vi.fn(),
  };
  render(<UserProfile userId="user-1" apiClient={apiClient} />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading profile...");
});

// Loaded state: let the promise resolve, wait for text
it("should display user data", async () => {
  const apiClient = {
    getUser: vi.fn().mockResolvedValue(mockUser),
    updateUser: vi.fn(),
  };
  render(<UserProfile userId="user-1" apiClient={apiClient} />);
  expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
});

// Edit + Save flow: full user interaction
it("should save changes", async () => {
  const user = userEvent.setup();
  const updated = { ...mockUser, name: "Jane Smith" };
  const apiClient = {
    getUser: vi.fn().mockResolvedValue(mockUser),
    updateUser: vi.fn().mockResolvedValue(updated),
  };
  render(<UserProfile userId="user-1" apiClient={apiClient} />);
  
  await screen.findByText("Jane Doe");
  await user.click(screen.getByRole("button", { name: "Edit Profile" }));
  
  const nameInput = screen.getByLabelText("Name");
  await user.clear(nameInput);
  await user.type(nameInput, "Jane Smith");
  await user.click(screen.getByRole("button", { name: "Save" }));
  
  expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
  expect(apiClient.updateUser).toHaveBeenCalledWith("user-1", expect.objectContaining({ name: "Jane Smith" }));
});
```

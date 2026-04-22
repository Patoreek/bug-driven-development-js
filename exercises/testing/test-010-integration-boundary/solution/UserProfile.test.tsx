import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile, type UserApiClient, type User } from "../UserProfile";

// Mock at the boundary: provide a fake apiClient, not fake React internals

const mockUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  bio: "Software engineer",
};

function createMockApiClient(overrides?: Partial<UserApiClient>): UserApiClient {
  return {
    getUser: vi.fn().mockResolvedValue(mockUser),
    updateUser: vi.fn().mockResolvedValue(mockUser),
    ...overrides,
  };
}

describe("UserProfile", () => {
  it("should show loading state initially", () => {
    // API that never resolves keeps component in loading state
    const apiClient = createMockApiClient({
      getUser: vi.fn().mockReturnValue(new Promise(() => {})),
    });

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading profile...");
  });

  it("should display user data after loading", async () => {
    const apiClient = createMockApiClient();

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Software engineer")).toBeInTheDocument();
    expect(apiClient.getUser).toHaveBeenCalledWith("user-1");
  });

  it("should show error state when API fails", async () => {
    const apiClient = createMockApiClient({
      getUser: vi.fn().mockRejectedValue(new Error("Network error")),
    });

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Network error");
  });

  it("should switch to edit mode when Edit Profile is clicked", async () => {
    const user = userEvent.setup();
    const apiClient = createMockApiClient();

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    await screen.findByText("Jane Doe");
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));

    expect(screen.getByLabelText("Name")).toHaveValue("Jane Doe");
    expect(screen.getByLabelText("Bio")).toHaveValue("Software engineer");
  });

  it("should save changes and return to view mode", async () => {
    const user = userEvent.setup();
    const updatedUser = { ...mockUser, name: "Jane Smith", bio: "Staff engineer" };
    const apiClient = createMockApiClient({
      updateUser: vi.fn().mockResolvedValue(updatedUser),
    });

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    await screen.findByText("Jane Doe");
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));

    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Smith");

    const bioInput = screen.getByLabelText("Bio");
    await user.clear(bioInput);
    await user.type(bioInput, "Staff engineer");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Staff engineer")).toBeInTheDocument();
    expect(apiClient.updateUser).toHaveBeenCalledWith("user-1", {
      name: "Jane Smith",
      bio: "Staff engineer",
    });
  });

  it("should cancel editing and restore original values", async () => {
    const user = userEvent.setup();
    const apiClient = createMockApiClient();

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    await screen.findByText("Jane Doe");
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));

    const nameInput = screen.getByLabelText("Name");
    await user.clear(nameInput);
    await user.type(nameInput, "Changed Name");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("should show error when save fails", async () => {
    const user = userEvent.setup();
    const apiClient = createMockApiClient({
      updateUser: vi.fn().mockRejectedValue(new Error("Save failed")),
    });

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    await screen.findByText("Jane Doe");
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Save failed");
  });

  it("should disable buttons while saving", async () => {
    const user = userEvent.setup();
    const apiClient = createMockApiClient({
      updateUser: vi.fn().mockReturnValue(new Promise(() => {})), // Never resolves
    });

    render(<UserProfile userId="user-1" apiClient={apiClient} />);

    await screen.findByText("Jane Doe");
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    });
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});

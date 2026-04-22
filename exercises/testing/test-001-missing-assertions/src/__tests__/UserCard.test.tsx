import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserCard } from "../UserCard";

// BUG: These tests render the component and call functions,
// but never actually assert anything meaningful.
// They "pass" because no error is thrown, not because anything is verified.

describe("UserCard", () => {
  it("should render user information", () => {
    render(
      <UserCard name="Alice Johnson" email="alice@example.com" role="admin" />
    );
    // Test just renders -- no assertions!
  });

  it("should display the user role", () => {
    render(
      <UserCard name="Bob Smith" email="bob@example.com" role="editor" />
    );
    screen.getByText; // This doesn't even call the function
  });

  it("should show avatar when avatarUrl is provided", () => {
    render(
      <UserCard
        name="Carol White"
        email="carol@example.com"
        role="viewer"
        avatarUrl="https://example.com/carol.jpg"
      />
    );
    // Renders with avatar but doesn't check if it appears
  });

  it("should not show avatar when avatarUrl is not provided", () => {
    render(
      <UserCard name="Dave Brown" email="dave@example.com" role="admin" />
    );
    // Renders without avatar but doesn't verify absence
  });

  it("should call onContact with email when contact button is clicked", async () => {
    const handleContact = vi.fn();
    render(
      <UserCard
        name="Eve Davis"
        email="eve@example.com"
        role="editor"
        onContact={handleContact}
      />
    );
    // Creates a mock but never clicks the button or checks the mock
  });

  it("should not show contact button when onContact is not provided", () => {
    render(
      <UserCard name="Frank Wilson" email="frank@example.com" role="viewer" />
    );
    // Renders without onContact but doesn't verify button is absent
  });
});

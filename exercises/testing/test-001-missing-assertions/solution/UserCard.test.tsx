import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserCard } from "../UserCard";

describe("UserCard", () => {
  it("should render user information", () => {
    render(
      <UserCard name="Alice Johnson" email="alice@example.com" role="admin" />
    );

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
  });

  it("should display the user role", () => {
    render(
      <UserCard name="Bob Smith" email="bob@example.com" role="editor" />
    );

    expect(screen.getByText("Editor")).toBeInTheDocument();
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

    const avatar = screen.getByAltText("Carol White's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/carol.jpg");
  });

  it("should not show avatar when avatarUrl is not provided", () => {
    render(
      <UserCard name="Dave Brown" email="dave@example.com" role="admin" />
    );

    expect(screen.queryByAltText("Dave Brown's avatar")).not.toBeInTheDocument();
  });

  it("should call onContact with email when contact button is clicked", async () => {
    const user = userEvent.setup();
    const handleContact = vi.fn();
    render(
      <UserCard
        name="Eve Davis"
        email="eve@example.com"
        role="editor"
        onContact={handleContact}
      />
    );

    await user.click(screen.getByRole("button", { name: "Contact" }));

    expect(handleContact).toHaveBeenCalledTimes(1);
    expect(handleContact).toHaveBeenCalledWith("eve@example.com");
  });

  it("should not show contact button when onContact is not provided", () => {
    render(
      <UserCard name="Frank Wilson" email="frank@example.com" role="viewer" />
    );

    expect(screen.queryByRole("button", { name: "Contact" })).not.toBeInTheDocument();
  });
});

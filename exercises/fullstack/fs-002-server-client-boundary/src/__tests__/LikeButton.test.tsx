import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "../LikeButton";

describe("LikeButton", () => {
  it("renders with initial unlike state", () => {
    render(<LikeButton userId="user-1" />);
    const button = screen.getByTestId("like-button");
    expect(button).toHaveTextContent("Like (0)");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles to liked state on click", async () => {
    const user = userEvent.setup();
    render(<LikeButton userId="user-1" />);

    await user.click(screen.getByTestId("like-button"));

    const button = screen.getByTestId("like-button");
    expect(button).toHaveTextContent("Unlike (1)");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles back to unliked on second click", async () => {
    const user = userEvent.setup();
    render(<LikeButton userId="user-1" />);

    await user.click(screen.getByTestId("like-button"));
    await user.click(screen.getByTestId("like-button"));

    const button = screen.getByTestId("like-button");
    expect(button).toHaveTextContent("Like (0)");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("does not accept an onLike function prop (non-serializable)", () => {
    // The component should work without an onLike prop
    // because functions can't cross the server-client boundary
    render(<LikeButton userId="user-1" />);
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
  });

  it("has the 'use client' directive", async () => {
    // Read the source file to verify it starts with "use client"
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.resolve(__dirname, "../LikeButton.tsx");
    const source = fs.readFileSync(filePath, "utf-8");
    const firstNonEmpty = source
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0 && !l.startsWith("//"))[0];
    expect(firstNonEmpty).toMatch(/^["']use client["'][;]?$/);
  });
});

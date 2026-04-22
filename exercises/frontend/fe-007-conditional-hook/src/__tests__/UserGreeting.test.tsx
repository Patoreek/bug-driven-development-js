import { render, screen } from "@testing-library/react";
import { UserGreeting } from "../UserGreeting";

describe("UserGreeting", () => {
  it("shows login prompt when not logged in", () => {
    render(<UserGreeting isLoggedIn={false} username="" />);
    expect(screen.getByTestId("login-prompt")).toBeInTheDocument();
    expect(screen.getByText("Please log in to continue.")).toBeInTheDocument();
  });

  it("shows greeting when logged in", () => {
    render(<UserGreeting isLoggedIn={true} username="Alice" />);
    expect(screen.getByTestId("greeting-container")).toBeInTheDocument();
    expect(screen.getByTestId("greeting-message")).toHaveTextContent(/Good .+, Alice!/);
  });

  it("shows visit count when logged in", () => {
    render(<UserGreeting isLoggedIn={true} username="Bob" />);
    expect(screen.getByTestId("visit-count")).toHaveTextContent("Visits: 1");
  });

  it("shows active status when logged in", () => {
    render(<UserGreeting isLoggedIn={true} username="Charlie" />);
    expect(screen.getByTestId("user-status")).toHaveTextContent("Status: Active");
  });

  it("can switch from logged out to logged in without crashing", () => {
    const { rerender } = render(
      <UserGreeting isLoggedIn={false} username="" />
    );

    expect(screen.getByTestId("login-prompt")).toBeInTheDocument();

    // Switch to logged in — this crashes with conditional hooks
    rerender(<UserGreeting isLoggedIn={true} username="Diana" />);

    expect(screen.getByTestId("greeting-container")).toBeInTheDocument();
    expect(screen.getByTestId("greeting-message")).toHaveTextContent(/Good .+, Diana!/);
  });

  it("can switch from logged in to logged out without crashing", () => {
    const { rerender } = render(
      <UserGreeting isLoggedIn={true} username="Eve" />
    );

    expect(screen.getByTestId("greeting-container")).toBeInTheDocument();

    // Switch to logged out — this crashes with conditional hooks
    rerender(<UserGreeting isLoggedIn={false} username="" />);

    expect(screen.getByTestId("login-prompt")).toBeInTheDocument();
  });

  it("can toggle login state multiple times", () => {
    const { rerender } = render(
      <UserGreeting isLoggedIn={false} username="" />
    );

    // Log in
    rerender(<UserGreeting isLoggedIn={true} username="Frank" />);
    expect(screen.getByTestId("greeting-container")).toBeInTheDocument();

    // Log out
    rerender(<UserGreeting isLoggedIn={false} username="" />);
    expect(screen.getByTestId("login-prompt")).toBeInTheDocument();

    // Log in again
    rerender(<UserGreeting isLoggedIn={true} username="Frank" />);
    expect(screen.getByTestId("greeting-container")).toBeInTheDocument();
  });
});

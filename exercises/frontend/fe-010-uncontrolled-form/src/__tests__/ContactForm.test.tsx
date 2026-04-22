import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { ContactForm, getSubmittedData, resetSubmittedData } from "../ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    resetSubmittedData();
  });

  it("renders the form fields", () => {
    render(<ContactForm />);
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
  });

  it("submits the form with entered data", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId("name-input"), "Alice");
    await user.type(screen.getByTestId("email-input"), "alice@example.com");
    await user.type(screen.getByTestId("message-input"), "Hello there!");

    await user.click(screen.getByTestId("submit-button"));

    expect(screen.getByTestId("success-message")).toBeInTheDocument();
    expect(getSubmittedData()).toHaveLength(1);
    expect(getSubmittedData()[0]).toEqual({
      name: "Alice",
      email: "alice@example.com",
      message: "Hello there!",
    });
  });

  it("shows success message after submission", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    await user.type(screen.getByTestId("name-input"), "Bob");
    await user.type(screen.getByTestId("email-input"), "bob@test.com");
    await user.type(screen.getByTestId("message-input"), "Hi");

    await user.click(screen.getByTestId("submit-button"));

    expect(screen.getByText("Thank you for your message!")).toBeInTheDocument();
    expect(screen.getByTestId("reset-button")).toBeInTheDocument();
  });

  it("resets the form with empty fields after clicking Send Another", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    // Fill and submit
    await user.type(screen.getByTestId("name-input"), "Charlie");
    await user.type(screen.getByTestId("email-input"), "charlie@test.com");
    await user.type(screen.getByTestId("message-input"), "Test message");
    await user.click(screen.getByTestId("submit-button"));

    // Reset
    await user.click(screen.getByTestId("reset-button"));

    // Form should be visible again with EMPTY fields
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    expect(screen.getByTestId("name-input")).toHaveValue("");
    expect(screen.getByTestId("email-input")).toHaveValue("");
    expect(screen.getByTestId("message-input")).toHaveValue("");
  });

  it("can submit multiple times with fresh data each time", async () => {
    render(<ContactForm />);
    const user = userEvent.setup();

    // First submission
    await user.type(screen.getByTestId("name-input"), "Dana");
    await user.type(screen.getByTestId("email-input"), "dana@test.com");
    await user.type(screen.getByTestId("message-input"), "First message");
    await user.click(screen.getByTestId("submit-button"));
    await user.click(screen.getByTestId("reset-button"));

    // Second submission with different data
    await user.type(screen.getByTestId("name-input"), "Eve");
    await user.type(screen.getByTestId("email-input"), "eve@test.com");
    await user.type(screen.getByTestId("message-input"), "Second message");
    await user.click(screen.getByTestId("submit-button"));

    expect(getSubmittedData()).toHaveLength(2);
    expect(getSubmittedData()[1]).toEqual({
      name: "Eve",
      email: "eve@test.com",
      message: "Second message",
    });
  });
});

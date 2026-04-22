import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "../Accordion";

describe("Accordion — compound component pattern", () => {
  it("renders accordion items with headers", () => {
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item itemId="faq2">
          <Accordion.Header>What is JSX?</Accordion.Header>
          <Accordion.Content>A syntax extension for JavaScript.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    expect(screen.getByText("What is React?")).toBeInTheDocument();
    expect(screen.getByText("What is JSX?")).toBeInTheDocument();
  });

  it("content is hidden by default", () => {
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    expect(screen.queryByText("A JavaScript library for building UIs.")).not.toBeInTheDocument();
  });

  it("expands content when header is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    await user.click(screen.getByText("What is React?"));
    expect(screen.getByText("A JavaScript library for building UIs.")).toBeInTheDocument();
  });

  it("collapses content when header is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    await user.click(screen.getByText("What is React?"));
    expect(screen.getByText("A JavaScript library for building UIs.")).toBeInTheDocument();

    await user.click(screen.getByText("What is React?"));
    expect(screen.queryByText("A JavaScript library for building UIs.")).not.toBeInTheDocument();
  });

  it("sets aria-expanded correctly on the header", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library for building UIs.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    const header = screen.getByText("What is React?");
    expect(header).toHaveAttribute("aria-expanded", "false");

    await user.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
  });

  it("only one item is expanded at a time by default", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item itemId="faq2">
          <Accordion.Header>What is JSX?</Accordion.Header>
          <Accordion.Content>A syntax extension.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    // Expand first item
    await user.click(screen.getByText("What is React?"));
    expect(screen.getByText("A JavaScript library.")).toBeInTheDocument();

    // Expand second item — first should collapse
    await user.click(screen.getByText("What is JSX?"));
    expect(screen.getByText("A syntax extension.")).toBeInTheDocument();
    expect(screen.queryByText("A JavaScript library.")).not.toBeInTheDocument();
  });

  it("allows multiple items when allowMultiple is set", async () => {
    const user = userEvent.setup();
    render(
      <Accordion allowMultiple>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item itemId="faq2">
          <Accordion.Header>What is JSX?</Accordion.Header>
          <Accordion.Content>A syntax extension.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    await user.click(screen.getByText("What is React?"));
    await user.click(screen.getByText("What is JSX?"));

    // Both should be expanded
    expect(screen.getByText("A JavaScript library.")).toBeInTheDocument();
    expect(screen.getByText("A syntax extension.")).toBeInTheDocument();
  });

  it("content region has role='region'", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <Accordion.Item itemId="faq1">
          <Accordion.Header>What is React?</Accordion.Header>
          <Accordion.Content>A JavaScript library.</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    await user.click(screen.getByText("What is React?"));
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  it("sub-components work via Accordion.Item, Accordion.Header, Accordion.Content", () => {
    // This test verifies the compound component API exists
    expect(typeof Accordion.Item).toBe("function");
    expect(typeof Accordion.Header).toBe("function");
    expect(typeof Accordion.Content).toBe("function");
  });
});

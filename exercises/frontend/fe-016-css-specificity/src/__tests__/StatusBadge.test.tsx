import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge, getStatusColor, type Status } from "../StatusBadge";

describe("StatusBadge", () => {
  it("renders the label text", () => {
    render(<StatusBadge status="success" label="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("has role='status'", () => {
    render(<StatusBadge status="success" label="Active" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it('applies "badge-success" class for success status', () => {
    render(<StatusBadge status="success" label="Active" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("badge", "badge-success");
  });

  it('applies "badge-warning" class for warning status', () => {
    render(<StatusBadge status="warning" label="Pending" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("badge", "badge-warning");
  });

  it('applies "badge-error" class for error status', () => {
    render(<StatusBadge status="error" label="Failed" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("badge", "badge-error");
  });

  it('applies "badge-default" class for default status', () => {
    render(<StatusBadge status="default" label="Unknown" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("badge", "badge-default");
  });

  it("uses correct inline background color for success", () => {
    render(<StatusBadge status="success" label="Active" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge.style.backgroundColor).toBe(getStatusColor("success"));
  });

  it("uses correct inline background color for warning", () => {
    render(<StatusBadge status="warning" label="Pending" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge.style.backgroundColor).toBe(getStatusColor("warning"));
  });

  it("uses correct inline background color for error", () => {
    render(<StatusBadge status="error" label="Failed" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge.style.backgroundColor).toBe(getStatusColor("error"));
  });

  it("uses correct inline background color for default", () => {
    render(<StatusBadge status="default" label="Unknown" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge.style.backgroundColor).toBe(getStatusColor("default"));
  });

  it("applies different classes for different statuses", () => {
    const { rerender } = render(
      <StatusBadge status="success" label="Active" />
    );
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("badge-success");
    expect(badge).not.toHaveClass("badge-error");

    rerender(<StatusBadge status="error" label="Failed" />);
    const badgeAfter = screen.getByTestId("status-badge");
    expect(badgeAfter).toHaveClass("badge-error");
    expect(badgeAfter).not.toHaveClass("badge-success");
  });
});

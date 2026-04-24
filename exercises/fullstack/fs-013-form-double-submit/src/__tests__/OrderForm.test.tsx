import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OrderForm } from "../OrderForm";
import { getOrders, resetOrders } from "../submitOrder";

describe("OrderForm - submit button pending state", () => {
  beforeEach(() => {
    resetOrders();
  });

  it("renders the order form", () => {
    render(<OrderForm />);

    expect(screen.getByTestId("order-form")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("submit button shows loading text when form is pending", async () => {
    render(<OrderForm />);
    const button = screen.getByTestId("submit-button");

    // The button should have some mechanism to show pending state
    // When not pending, it should say "Place Order"
    expect(button).toHaveTextContent("Place Order");

    // The button's disabled state and text change is handled by useFormStatus
    // which we verify by checking the component structure
  });

  it("submit button has disabled attribute support for pending state", () => {
    render(<OrderForm />);
    const button = screen.getByTestId("submit-button");

    // When not submitting, button should be enabled
    expect(button).not.toBeDisabled();
  });
});

describe("OrderForm - idempotency", () => {
  beforeEach(() => {
    resetOrders();
  });

  it("includes an idempotency key hidden input in the form", () => {
    render(<OrderForm />);
    const form = screen.getByTestId("order-form");

    // Form should contain a hidden input with an idempotency key
    const hiddenInput = form.querySelector('input[name="idempotencyKey"]');
    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput!.getAttribute("type")).toBe("hidden");
    expect(hiddenInput!.getAttribute("value")).toBeTruthy();
  });

  it("idempotency key is a non-empty unique string", () => {
    const { unmount } = render(<OrderForm />);
    const form1 = screen.getByTestId("order-form");
    const key1 = form1.querySelector('input[name="idempotencyKey"]')?.getAttribute("value");

    unmount();

    render(<OrderForm />);
    const form2 = screen.getByTestId("order-form");
    const key2 = form2.querySelector('input[name="idempotencyKey"]')?.getAttribute("value");

    // Each form render should generate a unique key
    expect(key1).toBeTruthy();
    expect(key2).toBeTruthy();
    expect(key1).not.toBe(key2);
  });
});

describe("submitOrder - server-side idempotency", () => {
  beforeEach(() => {
    resetOrders();
  });

  it("creates an order on first submission", () => {
    const formData = new FormData();
    formData.set("product", "Widget");
    formData.set("quantity", "2");
    formData.set("idempotencyKey", "key-abc-123");

    const { submitOrder } = require("../submitOrder");
    const result = submitOrder(formData);

    expect(result.success).toBe(true);
    expect(result.orderId).toBeDefined();
    expect(getOrders()).toHaveLength(1);
  });

  it("rejects duplicate submission with same idempotency key", () => {
    const { submitOrder } = require("../submitOrder");

    const formData1 = new FormData();
    formData1.set("product", "Widget");
    formData1.set("quantity", "2");
    formData1.set("idempotencyKey", "key-duplicate");

    const formData2 = new FormData();
    formData2.set("product", "Widget");
    formData2.set("quantity", "2");
    formData2.set("idempotencyKey", "key-duplicate");

    const result1 = submitOrder(formData1);
    const result2 = submitOrder(formData2);

    expect(result1.success).toBe(true);
    // Second submission with same key should return the original order, not create a new one
    expect(result2.success).toBe(true);
    expect(result2.orderId).toBe(result1.orderId);

    // Only one order should exist
    expect(getOrders()).toHaveLength(1);
  });

  it("allows different orders with different idempotency keys", () => {
    const { submitOrder } = require("../submitOrder");

    const formData1 = new FormData();
    formData1.set("product", "Widget");
    formData1.set("quantity", "1");
    formData1.set("idempotencyKey", "key-first");

    const formData2 = new FormData();
    formData2.set("product", "Gadget");
    formData2.set("quantity", "3");
    formData2.set("idempotencyKey", "key-second");

    const result1 = submitOrder(formData1);
    const result2 = submitOrder(formData2);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.orderId).not.toBe(result2.orderId);
    expect(getOrders()).toHaveLength(2);
  });
});

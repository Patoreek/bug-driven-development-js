import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "../ProductCard";

describe("ProductCard", () => {
  const defaultProps = {
    name: "Wireless Headphones",
    price: 79.99,
    description: "Premium noise-cancelling headphones",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    onAddToCart: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display the product name and description", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByRole("heading", { name: "Wireless Headphones" })).toBeInTheDocument();
    expect(screen.getByText("Premium noise-cancelling headphones")).toBeInTheDocument();
  });

  it("should display the formatted price", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText("$79.99")).toBeInTheDocument();
  });

  it("should display the rating and review count", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByLabelText("Rating: 4.5 out of 5")).toBeInTheDocument();
    expect(screen.getByText("(128 reviews)")).toBeInTheDocument();
  });

  it("should show 'In Stock' when product is available", () => {
    render(<ProductCard {...defaultProps} inStock={true} />);

    expect(screen.getByLabelText("In stock")).toBeInTheDocument();
  });

  it("should show 'Out of Stock' when product is unavailable", () => {
    render(<ProductCard {...defaultProps} inStock={false} />);

    expect(screen.getByLabelText("Out of stock")).toBeInTheDocument();
  });

  it("should show enabled Add to Cart button when in stock", () => {
    render(<ProductCard {...defaultProps} inStock={true} />);

    const button = screen.getByRole("button", { name: "Add to Cart" });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("should show disabled button when out of stock", () => {
    render(<ProductCard {...defaultProps} inStock={false} />);

    const button = screen.getByRole("button", { name: "Out of Stock" });
    expect(button).toBeDisabled();
  });

  it("should call onAddToCart when Add to Cart is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductCard {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(defaultProps.onAddToCart).toHaveBeenCalledTimes(1);
  });

  it("should not show any button when onAddToCart is not provided", () => {
    render(<ProductCard {...defaultProps} onAddToCart={undefined} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should display correct star rating for different values", () => {
    render(<ProductCard {...defaultProps} rating={2} />);

    expect(screen.getByLabelText("Rating: 2 out of 5")).toHaveTextContent("★★☆☆☆");
  });
});

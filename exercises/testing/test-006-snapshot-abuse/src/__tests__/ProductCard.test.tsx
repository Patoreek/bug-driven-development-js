import { render } from "@testing-library/react";
import { ProductCard } from "../ProductCard";

// BUG: These tests rely entirely on massive snapshot matching.
// Any change to markup, class names, or even whitespace breaks them.
// They don't test specific behaviors -- they just lock the entire DOM.
// When a snapshot fails, developers blindly update it without reviewing.

describe("ProductCard", () => {
  it("should render a product that is in stock", () => {
    const { container } = render(
      <ProductCard
        name="Wireless Headphones"
        price={79.99}
        description="Premium noise-cancelling headphones"
        inStock={true}
        rating={4.5}
        reviewCount={128}
        onAddToCart={() => {}}
      />
    );

    // BUG: Giant snapshot -- tests nothing specific
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should render a product that is out of stock", () => {
    const { container } = render(
      <ProductCard
        name="Vintage Camera"
        price={299.99}
        description="Classic film camera in mint condition"
        inStock={false}
        rating={4.8}
        reviewCount={42}
        onAddToCart={() => {}}
      />
    );

    // BUG: Another giant snapshot
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should render without add to cart callback", () => {
    const { container } = render(
      <ProductCard
        name="USB Cable"
        price={9.99}
        description="3ft USB-C cable"
        inStock={true}
        rating={3.2}
        reviewCount={856}
      />
    );

    // BUG: Yet another snapshot testing the whole tree
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should render with different ratings", () => {
    const { container } = render(
      <ProductCard
        name="Desk Lamp"
        price={45.0}
        description="Adjustable LED desk lamp"
        inStock={true}
        rating={2}
        reviewCount={15}
        onAddToCart={() => {}}
      />
    );

    // BUG: Snapshot doesn't tell you what rating display looks like
    expect(container.innerHTML).toMatchSnapshot();
  });
});

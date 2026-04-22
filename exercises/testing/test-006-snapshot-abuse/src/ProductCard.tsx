interface ProductCardProps {
  name: string;
  price: number;
  description: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  onAddToCart?: () => void;
}

export function ProductCard({
  name,
  price,
  description,
  inStock,
  rating,
  reviewCount,
  onAddToCart,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

  return (
    <article aria-label={name}>
      <h2>{name}</h2>
      <p>{description}</p>
      <div>
        <span aria-label={`Price: ${formattedPrice}`}>{formattedPrice}</span>
      </div>
      <div>
        <span aria-label={`Rating: ${rating} out of 5`}>{stars}</span>
        <span>({reviewCount} reviews)</span>
      </div>
      <div>
        {inStock ? (
          <span aria-label="In stock">In Stock</span>
        ) : (
          <span aria-label="Out of stock">Out of Stock</span>
        )}
      </div>
      {onAddToCart && inStock && (
        <button onClick={onAddToCart}>Add to Cart</button>
      )}
      {!inStock && onAddToCart && (
        <button disabled>Out of Stock</button>
      )}
    </article>
  );
}

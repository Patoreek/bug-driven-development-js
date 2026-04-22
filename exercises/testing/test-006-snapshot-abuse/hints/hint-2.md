# Hint 2 (Medium)

Replace each snapshot test with targeted assertions using RTL queries. The component has:
- A heading with the product name (`getByRole("heading")`)
- A price with an aria-label (`getByLabelText("Price: $79.99")` or `getByText("$79.99")`)
- A rating with an aria-label (`getByLabelText("Rating: 4.5 out of 5")`)
- Stock status with aria-labels (`getByLabelText("In stock")` or `getByLabelText("Out of stock")`)
- An "Add to Cart" button (`getByRole("button", { name: "Add to Cart" })`)

Split the one giant test into multiple focused tests, each testing one behavior.

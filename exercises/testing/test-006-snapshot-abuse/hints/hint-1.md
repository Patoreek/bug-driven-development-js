# Hint 1 (Mild)

Every test uses `toMatchSnapshot()` on the entire container HTML. Think about what each test is supposed to verify. The test name says "should render a product that is in stock" -- but what specifically should you check? The product name? The price? The "In Stock" label? The enabled button? Write a separate assertion for each.

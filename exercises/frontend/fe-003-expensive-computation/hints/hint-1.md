# Hint 1 (Mild)

Notice that `computeProductStats` is called directly in the render body. This means it executes every time the component renders, regardless of whether its inputs (`PRODUCTS` and `sortBy`) have changed.

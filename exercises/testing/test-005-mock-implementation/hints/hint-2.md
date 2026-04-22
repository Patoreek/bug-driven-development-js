# Hint 2 (Medium)

Remove the entire `vi.mock("../PricingCalculator", ...)` block. For pure functions like `getTier`, `applyDiscount`, `calculateTax`, and `calculateOrder`, you don't need mocks at all -- just call the function with known inputs and assert the outputs. Mocking is for external dependencies (network, database, file system), not for your own pure logic.

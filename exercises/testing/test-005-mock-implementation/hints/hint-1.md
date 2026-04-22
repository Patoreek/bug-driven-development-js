# Hint 1 (Mild)

Look at the top of the test file. The `vi.mock` call replaces the module's own helper functions with mocks. When `calculateOrder` calls `getTier`, it gets a fake response. Ask yourself: are the tests verifying the real pricing logic, or just the hardcoded mock values?

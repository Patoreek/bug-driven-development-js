# Hint 1 (Mild)

Look at where `globalThis.fetch` is being mocked. Is it inside a test lifecycle hook, or at the module level? What happens to that mock between tests?

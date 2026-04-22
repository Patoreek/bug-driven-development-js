# Hint 1 (Mild)

After clicking the search button, an async operation (the `onSearch` callback) starts. The test assertions run immediately after the click, but the component hasn't re-rendered with the results yet. You need a way to "wait" for the async updates to complete.

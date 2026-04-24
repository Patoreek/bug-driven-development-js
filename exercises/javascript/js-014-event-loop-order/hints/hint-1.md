# Hint 1 -- Mild

Think about the JavaScript event loop priorities. What runs first: synchronous code, `Promise.then()` callbacks, or `setTimeout` callbacks? The operations in these functions are scheduled in different task queues.

# Hint 2 (Medium)

You need a way to track that a fetch is "in flight" for a given key. When the first caller starts fetching, store a reference to the operation. When a second caller arrives for the same key and sees that a fetch is already in progress, it should wait for that existing operation instead of starting a new one. In JavaScript, what object represents an asynchronous operation that can be shared between callers?

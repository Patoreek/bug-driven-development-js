# Hint 1 (Mild)

Middleware runs in the order it's registered. Think about the dependencies: which middleware needs data that another middleware produces? For example, the logging middleware needs `requestId` to be set. What must run first?

# Hint 1 (Mild)

Look at the three incomplete functions: `handleRequest` doesn't track active connections or check for shutdown. `shutdown` doesn't set any state or wait for anything. `registerSignalHandlers` doesn't register any handlers. All three need to work together.

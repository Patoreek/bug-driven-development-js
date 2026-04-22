# Hint 2 (Medium)

`window.innerWidth` doesn't exist on the server at all. And even `Date` can produce different results between server and client. You need to defer these calculations to a lifecycle hook that only runs on the client.

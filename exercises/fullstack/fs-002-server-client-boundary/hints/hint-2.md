# Hint 2 (Medium)

There are two bugs here: a missing directive and a prop that can't cross the server-client boundary. Functions are not serializable -- you can't pass a function from a server component to a client component as a prop.

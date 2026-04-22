# Hint 1 (Mild)

Look at which components use React hooks like `useState`. In Next.js App Router, any component using hooks must be explicitly marked as a client component. Without that marker, Next.js assumes it's a server component.

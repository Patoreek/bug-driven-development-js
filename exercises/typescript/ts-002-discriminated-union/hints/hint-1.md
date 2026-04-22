# Hint 1 (Mild)

The core issue is that `type: string` is too broad. When TypeScript sees `notification.type === "info"`, it narrows the string -- but it can't narrow which other fields are present because they're all on the same interface.

Think about how you could define separate types for each notification kind, each with only the fields it actually needs, and then combine them with `|`.

# Hint 1 (Mild)

TypeScript uses **structural typing** -- two types are compatible if they have the same shape. That means `Brand<string, "id">` is the same type regardless of whether you call it `UserId` or `OrderId`.

Look at what makes each branded type unique. Is the brand string actually different between `UserId`, `OrderId`, and `ProductId`?

Also check what the constructor functions (`createUserId`, etc.) return. Does the return type annotation match the branded type?

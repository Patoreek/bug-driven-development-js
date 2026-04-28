# Hint 3 -- Strong

Here's the core pattern for the `withdraw` function:

```typescript
async function dbConditionalWrite(account: Account, expectedVersion: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1));
  const current = accounts.get(account.id);
  if (!current || current.version !== expectedVersion) {
    return false; // Another write happened -- optimistic lock failed
  }
  accounts.set(account.id, { ...account });
  return true;
}

export async function withdraw(accountId: string, amount: number) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const account = await dbRead(accountId);
    if (!account) return { success: false, error: "Account not found" };
    if (account.balance < amount) return { success: false, error: "Insufficient funds" };

    const expectedVersion = account.version;
    account.balance -= amount;
    account.version += 1;

    const written = await dbConditionalWrite(account, expectedVersion);
    if (written) return { success: true, newBalance: account.balance };
    // Version mismatch -- retry from the top
  }
  return { success: false, error: "Transaction conflict, please retry" };
}
```

Apply the same pattern to `transfer`, but you need to do conditional writes on **both** accounts and roll back the first if the second fails.

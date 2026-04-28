# Solution: Race Condition -- Double-Spend Read-Then-Write

## The Problem

The `withdraw` and `transfer` functions use a classic **read-then-write** pattern without any concurrency protection:

```typescript
// STEP 1: Read
const account = await dbRead(accountId);

// STEP 2: Check
if (account.balance < amount) { ... }

// STEP 3: Write (based on stale data!)
account.balance -= amount;
await dbWrite(account);
```

When two requests arrive concurrently:

1. Request A reads balance = 100
2. Request B reads balance = 100 (same stale value)
3. Request A checks 100 >= 80 -- passes
4. Request B checks 100 >= 80 -- passes
5. Request A writes balance = 20
6. Request B writes balance = 20 (overwrites A's result!)

The account started at 100, two $80 withdrawals should result in one success and one failure. Instead, both succeed and the account loses only $80 instead of the correct $160 (or rejection of the second). In the worst case, the balance goes negative.

## The Fix

Use **optimistic locking** with a version column:

```typescript
// NEW: Conditional write checks version before writing
async function dbConditionalWrite(
  account: Account,
  expectedVersion: number
): Promise<boolean> {
  const current = accounts.get(account.id);
  if (!current || current.version !== expectedVersion) {
    return false; // Someone else wrote first
  }
  accounts.set(account.id, { ...account });
  return true;
}

export async function withdraw(accountId: string, amount: number) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const account = await dbRead(accountId);
    // ... validation ...

    const expectedVersion = account.version;
    account.balance -= amount;
    account.version += 1;

    const written = await dbConditionalWrite(account, expectedVersion);
    if (written) return { success: true, newBalance: account.balance };
    // Version mismatch -- retry from read
  }
  return { success: false, error: "Transaction conflict, please retry" };
}
```

The key changes:

1. **`dbConditionalWrite`** replaces `dbWrite` -- it only writes if `version` matches what we read. This is equivalent to `UPDATE ... WHERE version = ?` in SQL.
2. **Retry loop** -- when the version check fails, re-read fresh data and try again (up to `MAX_RETRIES`).
3. **Transfer rollback** -- if the first account writes but the second fails, roll back the first before retrying.

## Why This Works

Optimistic locking detects conflicts at write time. If two requests read version 1, both try to write with `expectedVersion = 1`. The first succeeds (version becomes 2). The second sees version 2 != 1 and fails, triggering a retry with fresh data.

## Common Variations

- **Pessimistic locking**: Use `SELECT ... FOR UPDATE` to lock the row during the read, preventing concurrent reads entirely. Heavier but simpler.
- **Atomic increment**: Use `UPDATE accounts SET balance = balance - ? WHERE balance >= ?` to combine read-check-write into a single atomic SQL statement.
- **Serializable isolation**: Set the database transaction isolation level to `SERIALIZABLE` to detect all conflicts automatically.

## Documentation

- [PostgreSQL: Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)
- [Optimistic Concurrency Control (Wikipedia)](https://en.wikipedia.org/wiki/Optimistic_concurrency_control)
- [Designing Data-Intensive Applications, Ch. 7](https://dataintensive.net/) -- covers read-then-write races in depth

## Interview Context

Race conditions are a staple of backend and system design interviews. Interviewers often ask: "What happens if two users withdraw at the same time?" The expected answer covers optimistic locking (version columns), pessimistic locking (`SELECT FOR UPDATE`), or atomic operations. Understanding the read-then-write race is essential for any engineer working with shared mutable state -- whether in databases, caches, or in-memory stores.

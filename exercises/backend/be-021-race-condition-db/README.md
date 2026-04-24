# Race Condition: Double-Spend Read-Then-Write

**ID:** `be-021-race-condition-db`  
**Difficulty:** ★★★★☆  
**Estimated Time:** 30 minutes  
**Tags:** `database`, `race-condition`, `concurrency`, `optimistic-locking`, `transactions`  
**Prerequisites:** None

---

## The Scenario

Your fintech app has a digital wallet. Users can withdraw funds and transfer between accounts. Production logs show that when two withdrawal requests arrive simultaneously for the same account, the balance can go negative. An account with $100 somehow processes two $80 withdrawals, ending up at -$60. This is a classic **double-spend** bug caused by a read-then-write race condition.

## The Bug

The `withdraw` function reads the account balance, checks if it's sufficient, then writes the new balance. Two concurrent requests both read `balance = 100`, both see `100 >= 80`, and both proceed to write `balance = 20`. The second write overwrites the first, so only one deduction is applied. Worse, if timing differs, the balance can go negative.

The same race condition exists in the `transfer` function.

## Your Task

1. Implement **optimistic locking** using the `version` field already on each account
2. Add a conditional write that only succeeds if the version hasn't changed since the read
3. Add retry logic for when a version conflict is detected
4. Ensure concurrent operations never overdraw an account
5. All tests must pass

## Files to Modify

| File | Description |
|------|-------------|
| `src/wallet.ts` | Wallet operations with read-then-write race conditions |

## Running Tests

```bash
npm run test:exercise
```

## Hints

<details><summary>Hint 1 (Mild)</summary>See hints/hint-1.md</details>
<details><summary>Hint 2 (Medium)</summary>See hints/hint-2.md</details>
<details><summary>Hint 3 (Strong)</summary>See hints/hint-3.md</details>

## Concepts to Review

- [Optimistic locking](https://en.wikipedia.org/wiki/Optimistic_concurrency_control) -- version-based conflict detection
- [Race conditions in databases](https://vladmihalcea.com/a-beginners-guide-to-database-locking-and-the-lost-update-phenomena/) -- lost update problem
- [SELECT FOR UPDATE](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE) -- pessimistic locking alternative

# Hint 2 -- Medium

The `version` field on each account is your **optimistic lock**. The pattern works like SQL's:

```sql
UPDATE accounts
SET balance = balance - :amount, version = version + 1
WHERE id = :id AND version = :expected_version
```

If the `WHERE version = :expected_version` clause matches zero rows, it means another transaction already modified the row. In your in-memory simulation, replace `dbWrite` with a `dbConditionalWrite` that checks the version before writing.

When the conditional write fails, you need to **retry the entire operation from the read step** (not just the write) -- because the balance may have changed and the deduction might no longer be valid.

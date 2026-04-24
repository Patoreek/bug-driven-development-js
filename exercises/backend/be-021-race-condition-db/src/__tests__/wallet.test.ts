import {
  withdraw,
  transfer,
  createAccount,
  getAccount,
  resetDB,
} from "../wallet";

describe("wallet — Race Condition Prevention", () => {
  beforeEach(() => {
    resetDB();
  });

  describe("basic operations", () => {
    it("creates an account with initial balance", () => {
      const account = createAccount("acc-1", 100);
      expect(account.balance).toBe(100);
      expect(account.id).toBe("acc-1");
    });

    it("withdraws from account successfully", async () => {
      createAccount("acc-1", 100);
      const result = await withdraw("acc-1", 50);
      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(50);
    });

    it("rejects withdrawal exceeding balance", async () => {
      createAccount("acc-1", 100);
      const result = await withdraw("acc-1", 150);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Insufficient funds");
    });

    it("rejects zero or negative amount", async () => {
      createAccount("acc-1", 100);
      const result = await withdraw("acc-1", 0);
      expect(result.success).toBe(false);
    });

    it("rejects withdrawal from nonexistent account", async () => {
      const result = await withdraw("nonexistent", 50);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Account not found");
    });
  });

  describe("concurrent withdrawals (race condition)", () => {
    it("prevents double-spend on concurrent withdrawals", async () => {
      // Account has 100, two concurrent withdrawals of 60 each.
      // Only ONE should succeed — total withdrawn cannot exceed balance.
      createAccount("acc-1", 100);

      // Run both withdrawals concurrently
      const results = await Promise.all([
        withdraw("acc-1", 60),
        withdraw("acc-1", 60),
      ]);

      const successes = results.filter((r) => r.success);
      const failures = results.filter((r) => !r.success);

      // At most ONE should succeed
      expect(successes.length).toBeLessThanOrEqual(1);

      // Balance should never go below 0
      const finalAccount = getAccount("acc-1");
      expect(finalAccount!.balance).toBeGreaterThanOrEqual(0);
    });

    it("prevents balance going negative with many concurrent withdrawals", async () => {
      // Account has 100, five concurrent withdrawals of 30.
      // At most 3 should succeed (3 * 30 = 90 <= 100).
      // The 4th and 5th would overdraw.
      createAccount("acc-1", 100);

      const results = await Promise.all([
        withdraw("acc-1", 30),
        withdraw("acc-1", 30),
        withdraw("acc-1", 30),
        withdraw("acc-1", 30),
        withdraw("acc-1", 30),
      ]);

      const successes = results.filter((r) => r.success);

      // Sum of successful withdrawals must not exceed 100
      const totalWithdrawn = successes.length * 30;
      expect(totalWithdrawn).toBeLessThanOrEqual(100);

      // Balance must be non-negative
      const finalAccount = getAccount("acc-1");
      expect(finalAccount!.balance).toBeGreaterThanOrEqual(0);
    });

    it("total withdrawn + remaining balance = initial balance", async () => {
      createAccount("acc-1", 200);

      const results = await Promise.all([
        withdraw("acc-1", 80),
        withdraw("acc-1", 80),
        withdraw("acc-1", 80),
      ]);

      const successes = results.filter((r) => r.success);
      const totalWithdrawn = successes.length * 80;
      const finalAccount = getAccount("acc-1");

      // Conservation of money: withdrawn + remaining = initial
      expect(totalWithdrawn + finalAccount!.balance).toBe(200);
    });
  });

  describe("transfer", () => {
    it("transfers between two accounts", async () => {
      createAccount("from", 100);
      createAccount("to", 50);

      const result = await transfer("from", "to", 30);
      expect(result.success).toBe(true);

      expect(getAccount("from")!.balance).toBe(70);
      expect(getAccount("to")!.balance).toBe(80);
    });

    it("rejects transfer exceeding source balance", async () => {
      createAccount("from", 100);
      createAccount("to", 50);

      const result = await transfer("from", "to", 150);
      expect(result.success).toBe(false);
    });

    it("prevents double-spend on concurrent transfers", async () => {
      createAccount("from", 100);
      createAccount("to-1", 0);
      createAccount("to-2", 0);

      // Two concurrent transfers of 80 from the same account
      const results = await Promise.all([
        transfer("from", "to-1", 80),
        transfer("from", "to-2", 80),
      ]);

      const successes = results.filter((r) => r.success);

      // At most one should succeed
      expect(successes.length).toBeLessThanOrEqual(1);

      // Money conservation: sum of all balances should equal initial total
      const fromBalance = getAccount("from")!.balance;
      const to1Balance = getAccount("to-1")!.balance;
      const to2Balance = getAccount("to-2")!.balance;
      expect(fromBalance + to1Balance + to2Balance).toBe(100);
    });
  });
});

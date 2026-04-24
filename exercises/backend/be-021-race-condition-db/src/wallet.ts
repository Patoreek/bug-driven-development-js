// In-memory database simulation for a digital wallet
// Mimics the pattern of read-then-write with a real database

interface Account {
  id: string;
  balance: number;
  version: number;
}

// Simulated database
const accounts = new Map<string, Account>();

export function resetDB() {
  accounts.clear();
}

export function createAccount(id: string, initialBalance: number): Account {
  const account: Account = { id, balance: initialBalance, version: 1 };
  accounts.set(id, account);
  return { ...account };
}

export function getAccount(id: string): Account | null {
  const account = accounts.get(id);
  return account ? { ...account } : null;
}

// Simulates async database read (like SELECT * FROM accounts WHERE id = ?)
async function dbRead(id: string): Promise<Account | null> {
  // Simulate network/IO delay
  await new Promise((resolve) => setTimeout(resolve, 1));
  return getAccount(id);
}

// Simulates async database write (like UPDATE accounts SET ...)
async function dbWrite(account: Account): Promise<void> {
  // Simulate network/IO delay
  await new Promise((resolve) => setTimeout(resolve, 1));
  accounts.set(account.id, { ...account });
}

// BUG: Classic read-then-write race condition.
// Two concurrent calls both read balance=100, both check 100 >= 50,
// both proceed to deduct, resulting in balance = 50 instead of 0.
// With enough concurrency, the balance can go NEGATIVE.
export async function withdraw(
  accountId: string,
  amount: number
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  if (amount <= 0) {
    return { success: false, error: "Amount must be positive" };
  }

  // STEP 1: Read current state
  const account = await dbRead(accountId);

  if (!account) {
    return { success: false, error: "Account not found" };
  }

  // STEP 2: Check condition
  if (account.balance < amount) {
    return { success: false, error: "Insufficient funds" };
  }

  // BUG: Between the read (step 1) and the write (step 3),
  // another concurrent request could have already deducted from
  // the same account. We're now writing based on STALE data.

  // STEP 3: Write updated state
  account.balance -= amount;
  account.version += 1;
  await dbWrite(account);

  return { success: true, newBalance: account.balance };
}

// Transfer between two accounts — has the same race condition
export async function transfer(
  fromId: string,
  toId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  if (amount <= 0) {
    return { success: false, error: "Amount must be positive" };
  }

  const fromAccount = await dbRead(fromId);
  const toAccount = await dbRead(toId);

  if (!fromAccount) return { success: false, error: "Source account not found" };
  if (!toAccount) return { success: false, error: "Destination account not found" };

  if (fromAccount.balance < amount) {
    return { success: false, error: "Insufficient funds" };
  }

  // BUG: Same read-then-write race — both accounts could have
  // been modified between reads above and writes below
  fromAccount.balance -= amount;
  fromAccount.version += 1;
  toAccount.balance += amount;
  toAccount.version += 1;

  await dbWrite(fromAccount);
  await dbWrite(toAccount);

  return { success: true };
}

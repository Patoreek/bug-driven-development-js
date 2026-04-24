// In-memory database simulation for a digital wallet
// Uses optimistic locking to prevent race conditions

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

// Simulates async database read
async function dbRead(id: string): Promise<Account | null> {
  await new Promise((resolve) => setTimeout(resolve, 1));
  return getAccount(id);
}

// FIX: Simulates conditional write (like UPDATE ... WHERE version = ?)
// Returns false if the version doesn't match (someone else wrote first)
async function dbConditionalWrite(account: Account, expectedVersion: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1));

  const current = accounts.get(account.id);
  if (!current || current.version !== expectedVersion) {
    return false; // Optimistic lock failed — someone else updated
  }

  accounts.set(account.id, { ...account });
  return true;
}

// FIX: Uses optimistic locking with retry.
// Reads the version, does the update, writes with version check.
// If the version changed (another write happened), retries from the beginning.
const MAX_RETRIES = 3;

export async function withdraw(
  accountId: string,
  amount: number
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  if (amount <= 0) {
    return { success: false, error: "Amount must be positive" };
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    // STEP 1: Read current state (including version)
    const account = await dbRead(accountId);

    if (!account) {
      return { success: false, error: "Account not found" };
    }

    // STEP 2: Check condition
    if (account.balance < amount) {
      return { success: false, error: "Insufficient funds" };
    }

    // STEP 3: Attempt conditional write with version check
    const expectedVersion = account.version;
    account.balance -= amount;
    account.version += 1;

    const written = await dbConditionalWrite(account, expectedVersion);

    if (written) {
      return { success: true, newBalance: account.balance };
    }

    // Version mismatch — another concurrent write happened. Retry.
  }

  return { success: false, error: "Transaction conflict, please retry" };
}

// FIX: Transfer with optimistic locking on both accounts
export async function transfer(
  fromId: string,
  toId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  if (amount <= 0) {
    return { success: false, error: "Amount must be positive" };
  }

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const fromAccount = await dbRead(fromId);
    const toAccount = await dbRead(toId);

    if (!fromAccount) return { success: false, error: "Source account not found" };
    if (!toAccount) return { success: false, error: "Destination account not found" };

    if (fromAccount.balance < amount) {
      return { success: false, error: "Insufficient funds" };
    }

    const fromVersion = fromAccount.version;
    const toVersion = toAccount.version;

    fromAccount.balance -= amount;
    fromAccount.version += 1;
    toAccount.balance += amount;
    toAccount.version += 1;

    // Both writes must succeed atomically
    const fromWritten = await dbConditionalWrite(fromAccount, fromVersion);
    if (!fromWritten) continue; // Retry

    const toWritten = await dbConditionalWrite(toAccount, toVersion);
    if (!toWritten) {
      // Rollback the from account
      fromAccount.balance += amount;
      fromAccount.version -= 1;
      accounts.set(fromId, { ...fromAccount });
      continue; // Retry
    }

    return { success: true };
  }

  return { success: false, error: "Transaction conflict, please retry" };
}

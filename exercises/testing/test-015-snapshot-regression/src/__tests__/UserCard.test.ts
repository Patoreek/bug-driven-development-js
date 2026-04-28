import { renderUserCard, renderUserList, serializeUser, summarizeUsers, User } from "../UserCard";

// BUG: These snapshot tests are brittle and hide regressions.
// Problems:
// 1. Snapshots capture volatile data (dates, generated URLs) that change on every run
// 2. Tests snapshot entire HTML output instead of testing specific behaviors
// 3. When a snapshot fails, the fix is always "update snapshot" without checking
//    whether the change was intentional or a regression
// 4. No targeted assertions -- if the role badge disappears, the snapshot just changes
// 5. Date-dependent output makes snapshots non-deterministic

// BUG: This date will produce different snapshot output on different machines/timezones
const testUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin",
  joinedAt: new Date(), // BUG: Current date -- snapshot changes daily
  isActive: true,
};

const testUser2: User = {
  id: "user-2",
  name: "Bob Smith",
  email: "bob@example.com",
  role: "viewer",
  avatarUrl: "https://example.com/bob.jpg",
  joinedAt: new Date(Date.now() - 86400000), // BUG: Relative date -- changes daily
  isActive: false,
};

describe("UserCard — Snapshot Tests", () => {
  // BUG: Snapshot tests that capture everything, test nothing specific

  it("renders a user card", () => {
    // BUG: This snapshot contains the current date and a generated avatar URL
    // It will fail tomorrow because the date changes
    expect(renderUserCard(testUser)).toMatchSnapshot();
  });

  it("renders a compact user card", () => {
    expect(renderUserCard(testUser, { compact: true })).toMatchSnapshot();
  });

  it("renders without email", () => {
    expect(renderUserCard(testUser, { showEmail: false })).toMatchSnapshot();
  });

  it("renders an inactive user", () => {
    expect(renderUserCard(testUser2)).toMatchSnapshot();
  });

  it("renders a user list", () => {
    // BUG: Huge snapshot with multiple user cards -- any change triggers an update
    expect(renderUserList([testUser, testUser2])).toMatchSnapshot();
  });

  it("renders an empty user list", () => {
    expect(renderUserList([])).toMatchSnapshot();
  });

  it("serializes a user", () => {
    // BUG: Snapshot includes ISO date string that changes every day
    expect(serializeUser(testUser)).toMatchSnapshot();
  });

  it("summarizes users", () => {
    // BUG: This one is actually okay for a snapshot, but it's still better
    // to use targeted assertions since the structure is simple
    expect(summarizeUsers([testUser, testUser2])).toMatchSnapshot();
  });
});

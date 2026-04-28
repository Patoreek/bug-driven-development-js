import { renderUserCard, renderUserList, serializeUser, summarizeUsers, User } from "../UserCard";

// FIXED: Tests use deterministic dates, targeted assertions, and inline snapshots
// only where the full structure matters. Each test verifies specific behavior
// so regressions are caught with meaningful failure messages.

// FIX: Use fixed dates so output is deterministic across runs and timezones
const FIXED_DATE = new Date("2024-06-15T12:00:00.000Z");
const EARLIER_DATE = new Date("2024-01-10T08:00:00.000Z");

const testUser: User = {
  id: "user-1",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "admin",
  joinedAt: FIXED_DATE,
  isActive: true,
};

const inactiveUser: User = {
  id: "user-2",
  name: "Bob Smith",
  email: "bob@example.com",
  role: "viewer",
  avatarUrl: "https://example.com/bob.jpg",
  joinedAt: EARLIER_DATE,
  isActive: false,
};

describe("renderUserCard", () => {
  it("includes the user name and correct CSS classes", () => {
    const html = renderUserCard(testUser);

    expect(html).toContain('class="user-card role-admin"');
    expect(html).toContain('data-user-id="user-1"');
    expect(html).toContain("<h3 class=\"name\">Jane Doe</h3>");
  });

  it("shows email by default", () => {
    const html = renderUserCard(testUser);
    expect(html).toContain('<p class="email">jane@example.com</p>');
  });

  it("hides email when showEmail is false", () => {
    const html = renderUserCard(testUser, { showEmail: false });
    expect(html).not.toContain("jane@example.com");
    expect(html).not.toContain('class="email"');
  });

  it("shows role badge by default", () => {
    const html = renderUserCard(testUser);
    expect(html).toContain('<span class="badge role-badge">admin</span>');
  });

  it("hides role badge when showRole is false", () => {
    const html = renderUserCard(testUser, { showRole: false });
    expect(html).not.toContain("role-badge");
  });

  it("generates a default avatar URL when none provided", () => {
    const html = renderUserCard(testUser);
    expect(html).toContain("ui-avatars.com/api/");
    expect(html).toContain(encodeURIComponent("Jane Doe"));
  });

  it("uses the provided avatar URL when given", () => {
    const html = renderUserCard(inactiveUser);
    expect(html).toContain('src="https://example.com/bob.jpg"');
    expect(html).not.toContain("ui-avatars.com");
  });

  it("hides avatar when showAvatar is false", () => {
    const html = renderUserCard(testUser, { showAvatar: false });
    expect(html).not.toContain("<img");
    expect(html).not.toContain("avatar");
  });

  it("adds compact class when compact option is set", () => {
    const html = renderUserCard(testUser, { compact: true });
    expect(html).toContain("compact");
  });

  it("adds inactive class and badge for inactive users", () => {
    const html = renderUserCard(inactiveUser);
    expect(html).toContain("inactive");
    expect(html).toContain('<span class="badge inactive-badge">Inactive</span>');
  });

  it("does not show inactive badge for active users", () => {
    const html = renderUserCard(testUser);
    expect(html).not.toContain("inactive-badge");
    expect(html).not.toContain("Inactive</span>");
  });

  it("renders the join date in a time element with ISO datetime", () => {
    const html = renderUserCard(testUser);
    expect(html).toContain('datetime="2024-06-15T12:00:00.000Z"');
    expect(html).toContain("Joined");
  });
});

describe("renderUserList", () => {
  it("renders multiple user cards inside a user-list container", () => {
    const html = renderUserList([testUser, inactiveUser]);
    expect(html).toContain('class="user-list"');
    expect(html).toContain('data-user-id="user-1"');
    expect(html).toContain('data-user-id="user-2"');
  });

  it("renders an empty state when no users provided", () => {
    const html = renderUserList([]);
    expect(html).toContain("empty");
    expect(html).toContain("No users found.");
  });

  it("applies options to all cards in the list", () => {
    const html = renderUserList([testUser, inactiveUser], { showEmail: false });
    expect(html).not.toContain("jane@example.com");
    expect(html).not.toContain("bob@example.com");
  });
});

describe("serializeUser", () => {
  it("returns all user fields in the correct format", () => {
    const serialized = serializeUser(testUser);

    expect(serialized).toEqual({
      id: "user-1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "admin",
      avatarUrl: null,
      joinedAt: "2024-06-15T12:00:00.000Z",
      isActive: true,
    });
  });

  it("includes avatarUrl when present", () => {
    const serialized = serializeUser(inactiveUser);
    expect(serialized.avatarUrl).toBe("https://example.com/bob.jpg");
  });

  it("sets avatarUrl to null when not provided", () => {
    const serialized = serializeUser(testUser);
    expect(serialized.avatarUrl).toBeNull();
  });
});

describe("summarizeUsers", () => {
  it("counts total, active, and inactive users", () => {
    const summary = summarizeUsers([testUser, inactiveUser]);

    expect(summary).toEqual({
      total: 2,
      active: 1,
      inactive: 1,
      byRole: {
        admin: 1,
        viewer: 1,
      },
    });
  });

  it("handles an empty user list", () => {
    const summary = summarizeUsers([]);

    expect(summary).toEqual({
      total: 0,
      active: 0,
      inactive: 0,
      byRole: {},
    });
  });
});

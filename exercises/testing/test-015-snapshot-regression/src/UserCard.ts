// A component-like module that generates HTML strings for user cards.
// Used in an email template system and SSR rendering pipeline.

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  joinedAt: Date;
  isActive: boolean;
}

export interface UserCardOptions {
  showEmail: boolean;
  showRole: boolean;
  showAvatar: boolean;
  compact: boolean;
}

const DEFAULT_OPTIONS: UserCardOptions = {
  showEmail: true,
  showRole: true,
  showAvatar: true,
  compact: false,
};

/**
 * Renders a user card as an HTML string.
 */
export function renderUserCard(user: User, options?: Partial<UserCardOptions>): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const classes = ["user-card", `role-${user.role}`];
  if (opts.compact) classes.push("compact");
  if (!user.isActive) classes.push("inactive");

  let html = `<div class="${classes.join(" ")}" data-user-id="${user.id}">`;

  if (opts.showAvatar) {
    const src = user.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
    html += `<img class="avatar" src="${src}" alt="${user.name}" />`;
  }

  html += `<div class="info">`;
  html += `<h3 class="name">${user.name}</h3>`;

  if (opts.showEmail) {
    html += `<p class="email">${user.email}</p>`;
  }

  if (opts.showRole) {
    html += `<span class="badge role-badge">${user.role}</span>`;
  }

  if (!user.isActive) {
    html += `<span class="badge inactive-badge">Inactive</span>`;
  }

  html += `<time class="joined" datetime="${user.joinedAt.toISOString()}">`
    + `Joined ${user.joinedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    + `</time>`;

  html += `</div></div>`;

  return html;
}

/**
 * Renders a list of user cards.
 */
export function renderUserList(users: User[], options?: Partial<UserCardOptions>): string {
  if (users.length === 0) {
    return `<div class="user-list empty"><p>No users found.</p></div>`;
  }

  const cards = users.map((u) => renderUserCard(u, options)).join("\n");
  return `<div class="user-list">\n${cards}\n</div>`;
}

/**
 * Serializes user data to a JSON-friendly format (for API responses).
 */
export function serializeUser(user: User): Record<string, unknown> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl ?? null,
    joinedAt: user.joinedAt.toISOString(),
    isActive: user.isActive,
  };
}

/**
 * Generates a summary object for a list of users.
 */
export function summarizeUsers(users: User[]): Record<string, unknown> {
  const byRole = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    byRole,
  };
}

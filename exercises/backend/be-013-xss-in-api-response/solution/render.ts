export interface User {
  name: string;
  bio: string;
  website: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  query: string;
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Renders a user profile card as an HTML string.
 */
export function renderUserCard(user: User): string {
  return `<div class="user-card">
  <h2>${escapeHtml(user.name)}</h2>
  <p class="bio">${escapeHtml(user.bio)}</p>
  <a href="${escapeHtml(user.website)}">Website</a>
</div>`;
}

/**
 * Renders search results as HTML, including the search query in the heading.
 */
export function renderSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return '<p>No results found.</p>';
  }

  const query = results[0].query;
  const items = results
    .map(
      (r) => `<li>
    <h3>${escapeHtml(r.title)}</h3>
    <p>${escapeHtml(r.snippet)}</p>
  </li>`
    )
    .join("\n");

  return `<div class="search-results">
  <h2>Results for: ${escapeHtml(query)}</h2>
  <ul>${items}</ul>
</div>`;
}

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
 * BUG: This function doesn't actually escape anything!
 */
export function escapeHtml(str: string): string {
  // BUG: Returns the input unchanged — no escaping performed
  return str;
}

/**
 * Renders a user profile card as an HTML string.
 */
export function renderUserCard(user: User): string {
  // BUG: User input is interpolated directly without escaping
  return `<div class="user-card">
  <h2>${user.name}</h2>
  <p class="bio">${user.bio}</p>
  <a href="${user.website}">Website</a>
</div>`;
}

/**
 * Renders search results as HTML, including the search query in the heading.
 */
export function renderSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return '<p>No results found.</p>';
  }

  // BUG: query and other fields are not escaped
  const query = results[0].query;
  const items = results
    .map(
      (r) => `<li>
    <h3>${r.title}</h3>
    <p>${r.snippet}</p>
  </li>`
    )
    .join("\n");

  return `<div class="search-results">
  <h2>Results for: ${query}</h2>
  <ul>${items}</ul>
</div>`;
}

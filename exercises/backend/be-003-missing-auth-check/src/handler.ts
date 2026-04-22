// BUG: This handler checks authentication (is the user logged in?) but not
// authorization (does the user have permission to do this?).

export interface User {
  id: string;
  name: string;
  role: "admin" | "editor" | "viewer";
}

export interface Article {
  id: string;
  title: string;
  authorId: string;
}

export interface RequestContext {
  token: string | null;
  articleId: string;
}

export interface HandlerResponse {
  status: number;
  body: {
    message: string;
  };
}

// Simulated token-to-user lookup
const tokenStore: Record<string, User> = {
  "token-admin-1": { id: "user-1", name: "Alice", role: "admin" },
  "token-editor-2": { id: "user-2", name: "Bob", role: "editor" },
  "token-editor-3": { id: "user-3", name: "Charlie", role: "editor" },
  "token-viewer-4": { id: "user-4", name: "Diana", role: "viewer" },
};

// Simulated article database
const articleStore: Record<string, Article> = {
  "article-1": { id: "article-1", title: "First Post", authorId: "user-2" },
  "article-2": { id: "article-2", title: "Second Post", authorId: "user-3" },
};

export function getUserFromToken(token: string): User | null {
  return tokenStore[token] ?? null;
}

export function getArticle(articleId: string): Article | null {
  return articleStore[articleId] ?? null;
}

export async function handleDeleteArticle(
  ctx: RequestContext
): Promise<HandlerResponse> {
  // BUG: Only checks if user is authenticated, not if they're authorized
  if (!ctx.token) {
    return {
      status: 401,
      body: { message: "Authentication required" },
    };
  }

  const user = getUserFromToken(ctx.token);
  if (!user) {
    return {
      status: 401,
      body: { message: "Invalid token" },
    };
  }

  // BUG: No role check — any authenticated user can delete any article!

  const article = getArticle(ctx.articleId);
  if (!article) {
    return {
      status: 404,
      body: { message: "Article not found" },
    };
  }

  // BUG: No ownership check — editors should only delete their own articles

  // Simulate deletion
  return {
    status: 200,
    body: { message: `Article ${ctx.articleId} deleted` },
  };
}

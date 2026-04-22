import { useState, useEffect } from "react";

export interface SearchResult {
  id: string;
  title: string;
}

export type SearchFn = (query: string, signal?: AbortSignal) => Promise<SearchResult[]>;

interface UseSearchOptions {
  searchFn: SearchFn;
}

export function useSearch({ searchFn }: UseSearchOptions) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // BUG: No AbortController — stale requests can overwrite fresh results
    searchFn(query)
      .then((data) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });

    // BUG: No cleanup function to cancel the request
  }, [query, searchFn]);

  return { query, setQuery, results, isLoading, error };
}

interface SearchResultsProps {
  searchFn: SearchFn;
}

export function SearchResults({ searchFn }: SearchResultsProps) {
  const { query, setQuery, results, isLoading, error } = useSearch({ searchFn });

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search"
      />
      {isLoading && <p data-testid="loading">Searching...</p>}
      {error && <p data-testid="error">{error}</p>}
      <ul data-testid="results">
        {results.map((result) => (
          <li key={result.id} data-testid={`result-${result.id}`}>
            {result.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

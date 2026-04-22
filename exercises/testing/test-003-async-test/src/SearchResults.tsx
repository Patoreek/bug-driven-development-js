import { useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
}

interface SearchResultsProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
}

export function SearchResults({ onSearch }: SearchResultsProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await onSearch(query);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div role="search">
        <label htmlFor="search-input">Search</label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p role="status">Loading results...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && hasSearched && results.length === 0 && (
        <p>No results found for "{query}"</p>
      )}

      {results.length > 0 && (
        <ul role="list" aria-label="Search results">
          {results.map((result) => (
            <li key={result.id}>
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

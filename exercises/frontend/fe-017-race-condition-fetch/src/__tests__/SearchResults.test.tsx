import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchResults, type SearchFn, type SearchResult } from "../SearchResults";

function createDelayedSearchFn(delayMap: Record<string, number>) {
  const abortedQueries: string[] = [];

  const searchFn: SearchFn = (query: string, signal?: AbortSignal) => {
    const delay = delayMap[query] ?? 50;
    return new Promise<SearchResult[]>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (signal?.aborted) {
          abortedQueries.push(query);
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        resolve([{ id: query, title: `Result for "${query}"` }]);
      }, delay);

      signal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        abortedQueries.push(query);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });
  };

  return { searchFn, abortedQueries };
}

describe("SearchResults", () => {
  it("renders search input", () => {
    const searchFn = vi.fn().mockResolvedValue([]);
    render(<SearchResults searchFn={searchFn} />);
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("shows results for a search query", async () => {
    const searchFn: SearchFn = async (query) => [
      { id: "1", title: `Result for "${query}"` },
    ];
    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    await user.type(screen.getByLabelText("Search"), "test");

    await waitFor(() => {
      expect(screen.getByText('Result for "test"')).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching", async () => {
    const { searchFn } = createDelayedSearchFn({ test: 200 });
    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    await user.type(screen.getByLabelText("Search"), "test");

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("clears results when search is emptied", async () => {
    const searchFn: SearchFn = async (query) => [
      { id: "1", title: `Result for "${query}"` },
    ];
    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    await user.type(screen.getByLabelText("Search"), "test");
    await waitFor(() => {
      expect(screen.getByText('Result for "test"')).toBeInTheDocument();
    });

    await user.clear(screen.getByLabelText("Search"));
    await waitFor(() => {
      expect(screen.queryByText('Result for "test"')).not.toBeInTheDocument();
    });
  });

  it("cancels stale requests — only shows results from the latest query", async () => {
    // "re" takes 300ms, "react" takes 50ms
    // Without cancellation, "re" results would overwrite "react" results
    const { searchFn } = createDelayedSearchFn({
      r: 300,
      re: 300,
      rea: 300,
      reac: 300,
      react: 50,
    });

    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    await user.type(screen.getByLabelText("Search"), "react");

    // Wait for the fast "react" query to resolve
    await waitFor(
      () => {
        expect(screen.getByText('Result for "react"')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // The stale results should NOT appear
    expect(screen.queryByText('Result for "r"')).not.toBeInTheDocument();
    expect(screen.queryByText('Result for "re"')).not.toBeInTheDocument();
    expect(screen.queryByText('Result for "rea"')).not.toBeInTheDocument();

    // Wait a bit more to make sure late-resolving requests don't overwrite
    await act(async () => {
      await new Promise((r) => setTimeout(r, 500));
    });

    expect(screen.getByText('Result for "react"')).toBeInTheDocument();
    expect(screen.queryByText('Result for "r"')).not.toBeInTheDocument();
  });

  it("aborts previous requests when new input arrives", async () => {
    const { searchFn, abortedQueries } = createDelayedSearchFn({
      slow: 500,
      fast: 10,
    });

    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    // Type "slow", then quickly clear and type "fast"
    await user.type(screen.getByLabelText("Search"), "slow");

    await user.clear(screen.getByLabelText("Search"));
    await user.type(screen.getByLabelText("Search"), "fast");

    await waitFor(() => {
      expect(screen.getByText('Result for "fast"')).toBeInTheDocument();
    });

    // At least some of the "slow" partial queries should have been aborted
    expect(abortedQueries.length).toBeGreaterThan(0);
  });

  it("passes an AbortSignal to the search function", async () => {
    const receivedSignals: (AbortSignal | undefined)[] = [];
    const searchFn: SearchFn = async (query, signal) => {
      receivedSignals.push(signal);
      return [{ id: "1", title: `Result for "${query}"` }];
    };

    const user = userEvent.setup();
    render(<SearchResults searchFn={searchFn} />);

    await user.type(screen.getByLabelText("Search"), "a");

    await waitFor(() => {
      expect(receivedSignals.length).toBeGreaterThan(0);
    });

    // The search function should receive an AbortSignal
    expect(receivedSignals.some((s) => s instanceof AbortSignal)).toBe(true);
  });
});

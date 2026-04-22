import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchResults } from "../SearchResults";

// BUG: These tests trigger async operations but check the DOM immediately
// without waiting for the async operations to complete.
// Assertions run before the component has re-rendered with the results.

const mockResults = [
  { id: "1", title: "React Testing", description: "Guide to testing React components" },
  { id: "2", title: "Vitest Setup", description: "How to configure Vitest" },
];

describe("SearchResults", () => {
  it("should display search results after clicking search", async () => {
    const mockSearch = vi.fn().mockResolvedValue(mockResults);
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "react");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // BUG: Checking immediately -- results haven't loaded yet!
    expect(screen.getByText("React Testing")).toBeInTheDocument();
    expect(screen.getByText("Vitest Setup")).toBeInTheDocument();
  });

  it("should show loading state while searching", async () => {
    // Mock that never resolves to keep loading state
    const mockSearch = vi.fn().mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "react");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // BUG: Loading state may not be rendered yet
    expect(screen.getByText("Loading results...")).toBeInTheDocument();
  });

  it("should show error message when search fails", async () => {
    const mockSearch = vi.fn().mockRejectedValue(new Error("API is down"));
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "react");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // BUG: Error hasn't been caught and rendered yet
    expect(screen.getByRole("alert")).toHaveTextContent("API is down");
  });

  it("should show no results message when search returns empty", async () => {
    const mockSearch = vi.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "xyznonexistent");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // BUG: Component hasn't re-rendered with empty results yet
    expect(screen.getByText(/No results found/)).toBeInTheDocument();
  });

  it("should call onSearch with the query text", async () => {
    const mockSearch = vi.fn().mockResolvedValue(mockResults);
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "testing");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(mockSearch).toHaveBeenCalledWith("testing");
  });
});

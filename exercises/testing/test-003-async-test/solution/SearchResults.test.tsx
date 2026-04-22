import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchResults } from "../SearchResults";

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

    // Use findByText to wait for async results to appear
    expect(await screen.findByText("React Testing")).toBeInTheDocument();
    expect(screen.getByText("Vitest Setup")).toBeInTheDocument();
  });

  it("should show loading state while searching", async () => {
    const mockSearch = vi.fn().mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "react");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // Use findByText to wait for the loading state to appear
    expect(await screen.findByText("Loading results...")).toBeInTheDocument();
  });

  it("should show error message when search fails", async () => {
    const mockSearch = vi.fn().mockRejectedValue(new Error("API is down"));
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "react");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // Use waitFor to wait for the error to be caught and rendered
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("API is down");
    });
  });

  it("should show no results message when search returns empty", async () => {
    const mockSearch = vi.fn().mockResolvedValue([]);
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "xyznonexistent");
    await user.click(screen.getByRole("button", { name: "Search" }));

    // Use findByText to wait for the "no results" message
    expect(await screen.findByText(/No results found/)).toBeInTheDocument();
  });

  it("should call onSearch with the query text", async () => {
    const mockSearch = vi.fn().mockResolvedValue(mockResults);
    const user = userEvent.setup();

    render(<SearchResults onSearch={mockSearch} />);

    await user.type(screen.getByLabelText("Search"), "testing");
    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(mockSearch).toHaveBeenCalledWith("testing");

    // Also wait for the results to ensure no act() warnings
    await screen.findByText("React Testing");
  });
});

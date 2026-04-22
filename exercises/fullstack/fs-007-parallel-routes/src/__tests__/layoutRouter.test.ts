import { renderLayout, resolveSlot, getSlotContent, type RouteSlot, type LayoutConfig } from "../layoutRouter";

describe("Parallel route layout", () => {
  const teamSlot: RouteSlot = { name: "team", content: "<p>Team Members</p>" };
  const analyticsSlot: RouteSlot = { name: "analytics", content: "<p>Analytics Dashboard</p>" };

  it("renders layout with children and slots", () => {
    const config: LayoutConfig = {
      children: "<h1>Dashboard</h1>",
      slots: { team: teamSlot, analytics: analyticsSlot },
    };

    const html = renderLayout(config);
    expect(html).toContain("<main><h1>Dashboard</h1></main>");
    expect(html).toContain('data-slot="team"');
    expect(html).toContain('data-slot="analytics"');
    expect(html).toContain("<p>Team Members</p>");
    expect(html).toContain("<p>Analytics Dashboard</p>");
  });

  it("resolveSlot returns content when no loading or error", () => {
    expect(resolveSlot(teamSlot)).toBe("<p>Team Members</p>");
  });

  it("resolveSlot returns loading state when present", () => {
    const slot: RouteSlot = { name: "team", content: "<p>Team Members</p>", loading: "<p>Loading team...</p>" };
    expect(resolveSlot(slot)).toBe("<p>Loading team...</p>");
  });

  it("resolveSlot returns error state over loading", () => {
    const slot: RouteSlot = {
      name: "team",
      content: "<p>Team Members</p>",
      loading: "<p>Loading...</p>",
      error: "<p>Failed to load team</p>",
    };
    expect(resolveSlot(slot)).toBe("<p>Failed to load team</p>");
  });

  it("getSlotContent returns empty string for missing slot", () => {
    const slots = { team: teamSlot };
    expect(getSlotContent(slots, "nonexistent")).toBe("");
  });

  it("getSlotContent returns resolved content for existing slot", () => {
    const slots = { team: teamSlot };
    expect(getSlotContent(slots, "team")).toBe("<p>Team Members</p>");
  });

  it("getSlotContent handles slot with loading state", () => {
    const loadingSlot: RouteSlot = { name: "analytics", content: "", loading: "<p>Loading analytics...</p>" };
    const slots = { analytics: loadingSlot };
    expect(getSlotContent(slots, "analytics")).toBe("<p>Loading analytics...</p>");
  });

  it("renderLayout uses resolveSlot for each slot (loading/error aware)", () => {
    const config: LayoutConfig = {
      children: "<h1>Page</h1>",
      slots: {
        team: { name: "team", content: "<p>Team</p>", loading: "<p>Loading team...</p>" },
        analytics: { name: "analytics", content: "<p>Analytics</p>", error: "<p>Analytics failed</p>" },
      },
    };

    const html = renderLayout(config);
    expect(html).toContain("<p>Loading team...</p>");
    expect(html).toContain("<p>Analytics failed</p>");
    expect(html).not.toContain("<p>Team</p>");
    expect(html).not.toContain("<p>Analytics</p>");
  });
});

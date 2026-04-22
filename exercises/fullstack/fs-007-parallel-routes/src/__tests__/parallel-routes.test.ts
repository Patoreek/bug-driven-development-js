import * as fs from "fs";
import * as path from "path";

const srcDir = path.resolve(__dirname, "..");

describe("Parallel routes configuration", () => {
  it("layout.tsx exists and exports DashboardLayout", async () => {
    const mod = await import("../layout");
    expect(mod.DashboardLayout).toBeDefined();
    expect(typeof mod.DashboardLayout).toBe("function");
  });

  it("page.tsx exists and exports DashboardPage", async () => {
    const mod = await import("../page");
    expect(mod.DashboardPage).toBeDefined();
    expect(typeof mod.DashboardPage).toBe("function");
  });

  it("default.tsx exists for the sidebar fallback", () => {
    const defaultPath = path.resolve(srcDir, "default.tsx");
    expect(fs.existsSync(defaultPath)).toBe(true);
  });

  it("default.tsx exports a SidebarDefault component", async () => {
    const mod = await import("../default");
    expect(mod.SidebarDefault).toBeDefined();
    expect(typeof mod.SidebarDefault).toBe("function");
  });

  it("SidebarDefault renders a placeholder message", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { SidebarDefault } = await import("../default");
    render(<SidebarDefault />);
    expect(screen.getByTestId("sidebar-default")).toBeInTheDocument();
  });

  it("DashboardLayout renders both children and sidebar slots", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { DashboardLayout } = await import("../layout");

    render(
      <DashboardLayout sidebar={<div data-testid="test-sidebar">Sidebar</div>}>
        <div data-testid="test-children">Main</div>
      </DashboardLayout>
    );

    expect(screen.getByTestId("main-content")).toContainElement(
      screen.getByTestId("test-children")
    );
    expect(screen.getByTestId("sidebar-slot")).toContainElement(
      screen.getByTestId("test-sidebar")
    );
  });

  it("DashboardPage renders the project list", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { DashboardPage } = await import("../page");

    render(<DashboardPage />);

    expect(screen.getByTestId("project-list")).toBeInTheDocument();
    expect(screen.getByTestId("project-p1")).toBeInTheDocument();
  });
});

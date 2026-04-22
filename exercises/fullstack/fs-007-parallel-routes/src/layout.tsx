// Dashboard layout with parallel routes
// The @sidebar slot should show project details alongside the main content

type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div data-testid="dashboard-layout" style={{ display: "flex" }}>
      <main data-testid="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <aside data-testid="sidebar-slot" style={{ width: 300 }}>
        {sidebar}
      </aside>
    </div>
  );
}

// BUG: This layout accepts a `sidebar` slot prop, but the @sidebar
// parallel route directory doesn't have a default.tsx file.
// On soft navigation to a route without a matching @sidebar/page.tsx,
// Next.js doesn't know what to render and returns a 404.

// Dashboard layout with parallel routes
// The @sidebar slot shows project details alongside the main content

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

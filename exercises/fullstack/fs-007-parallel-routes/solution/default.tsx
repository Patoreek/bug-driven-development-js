// FIX: default.tsx provides a fallback for the @sidebar parallel route slot
// When Next.js performs a soft navigation to a route that doesn't have a
// matching page for this slot, it renders this default instead of a 404.

export function SidebarDefault() {
  return (
    <div data-testid="sidebar-default">
      <p>Select a project to view details</p>
    </div>
  );
}

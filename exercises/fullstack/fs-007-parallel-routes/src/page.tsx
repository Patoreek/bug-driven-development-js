// Main dashboard page -- the children slot of the layout

type Project = {
  id: string;
  name: string;
  status: "active" | "archived";
};

const projects: Project[] = [
  { id: "p1", name: "Website Redesign", status: "active" },
  { id: "p2", name: "Mobile App", status: "active" },
  { id: "p3", name: "Legacy Migration", status: "archived" },
];

export function DashboardPage() {
  return (
    <div data-testid="dashboard-page">
      <h1>Projects</h1>
      <ul data-testid="project-list">
        {projects.map((project) => (
          <li key={project.id} data-testid={`project-${project.id}`}>
            <span>{project.name}</span>
            <span data-testid={`status-${project.id}`}> ({project.status})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

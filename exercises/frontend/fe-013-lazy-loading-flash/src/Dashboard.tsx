export default function Dashboard() {
  return (
    <div data-testid="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Revenue</h3>
          <p>$12,450</p>
        </div>
        <div className="card">
          <h3>Users</h3>
          <p>1,234</p>
        </div>
        <div className="card">
          <h3>Orders</h3>
          <p>567</p>
        </div>
      </div>
    </div>
  );
}

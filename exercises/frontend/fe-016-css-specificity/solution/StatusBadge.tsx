export type Status = "success" | "warning" | "error" | "default";

interface StatusBadgeProps {
  status: Status;
  label: string;
}

const statusClasses: Record<Status, string> = {
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  default: "badge-default",
};

const statusColors: Record<Status, string> = {
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  default: "#6b7280",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const statusClass = statusClasses[status];

  return (
    <span
      className={`badge ${statusClass}`}
      style={{ backgroundColor: statusColors[status], color: "white", padding: "4px 8px", borderRadius: "4px" }}
      data-testid="status-badge"
      role="status"
    >
      {label}
    </span>
  );
}

// Utility for getting the expected color (used by tests)
export function getStatusColor(status: Status): string {
  return statusColors[status];
}

const LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed',
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-status-${status}`}>{LABELS[status] || status}</span>;
}

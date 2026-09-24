const LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function PriorityBadge({ priority }) {
  return <span className={`badge badge-priority-${priority}`}>{LABELS[priority] || priority}</span>;
}

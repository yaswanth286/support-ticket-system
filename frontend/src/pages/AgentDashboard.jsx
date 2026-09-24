import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTickets } from '../services/ticketService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const loadTickets = useCallback(() => {
    setLoading(true);
    setError('');
    const filters = {};
    if (statusFilter) filters.status = statusFilter;
    if (priorityFilter) filters.priority = priorityFilter;

    getTickets(filters)
      .then(setTickets)
      .catch(() => setError('Unable to load tickets. Please try again.'))
      .finally(() => setLoading(false));
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    high: tickets.filter((t) => t.priority === 'high').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Agent Dashboard</h1>
          <p className="page-subtitle">All customer support tickets.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{counts.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-value">{counts.open}</div><div className="stat-label">Open</div></div>
        <div className="stat-card"><div className="stat-value">{counts.in_progress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card"><div className="stat-value">{counts.closed}</div><div className="stat-label">Closed</div></div>
        <div className="stat-card"><div className="stat-value">{counts.high}</div><div className="stat-label">High Priority</div></div>
      </div>

      <div className="filter-bar">
        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
        <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <ErrorMessage message={error} />
      {loading && <Loading label="Loading tickets..." />}

      {!loading && !error && tickets.length === 0 && (
        <EmptyState message="No tickets match these filters." />
      )}

      {!loading && tickets.length > 0 && (
        <div className="table-wrapper">
          <table className="ticket-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Customer</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned Agent</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.subject}</td>
                  <td>{t.customer_name}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>{t.assigned_agent_name || <em style={{ color: 'var(--color-ink-muted)' }}>Unassigned</em>}</td>
                  <td>{new Date(t.created_at).toLocaleDateString()}</td>
                  <td><Link to={`/tickets/${t.id}`} className="btn btn-secondary btn-sm">Manage</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

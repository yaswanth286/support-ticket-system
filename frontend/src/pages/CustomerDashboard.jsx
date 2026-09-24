import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTickets } from '../services/ticketService';
import TicketCard from '../components/TicketCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    getTickets()
      .then((data) => {
        if (active) setTickets(data);
      })
      .catch(() => {
        if (active) setError('Unable to load tickets. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p className="page-subtitle">Here's an overview of your support tickets.</p>
        </div>
        <Link to="/tickets/new" className="btn btn-primary">+ Create Ticket</Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{counts.total}</div><div className="stat-label">Total Tickets</div></div>
        <div className="stat-card"><div className="stat-value">{counts.open}</div><div className="stat-label">Open</div></div>
        <div className="stat-card"><div className="stat-value">{counts.in_progress}</div><div className="stat-label">In Progress</div></div>
        <div className="stat-card"><div className="stat-value">{counts.closed}</div><div className="stat-label">Closed</div></div>
      </div>

      <h2 style={{ fontSize: '1.1rem' }}>Recent Tickets</h2>

      <ErrorMessage message={error} />
      {loading && <Loading label="Loading your tickets..." />}

      {!loading && !error && tickets.length === 0 && (
        <EmptyState
          message="You haven't created any tickets yet."
          action={<Link to="/tickets/new" className="btn btn-primary btn-sm">Create your first ticket</Link>}
        />
      )}

      {!loading && tickets.slice(0, 10).map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card-main">
        <h3>
          <Link to={`/tickets/${ticket.id}`}>{ticket.subject}</Link>
        </h3>
        <div className="ticket-card-meta">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
          <span>Opened {new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary btn-sm">
        View
      </Link>
    </div>
  );
}

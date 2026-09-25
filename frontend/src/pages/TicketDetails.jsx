import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTicketById, updateTicket, deleteTicket } from '../services/ticketService';
import { getComments, addComment } from '../services/commentService';
import { getAgents } from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAgent = user.role === 'agent';
  const isAdminAgent =
    user.role === 'agent' && user.email === 'agent@example.com';

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [ticketData, commentData] = await Promise.all([
        getTicketById(id),
        getComments(id),
      ]);

      setTicket(ticketData);
      setComments(commentData);

      if (isAdminAgent) {
        const agentList = await getAgents();
        setAgents(agentList);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('This ticket does not exist.');
      } else if (err.response?.status === 403) {
        setError('You do not have access to this ticket.');
      } else {
        setError('Unable to load this ticket. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [id, isAdminAgent]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handlePostComment(comment) {
    setCommentSubmitting(true);

    try {
      const newComment = await addComment(id, comment);
      setComments((prev) => [...prev, newComment]);
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleFieldUpdate(field, value) {
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const updated = await updateTicket(id, { [field]: value });
      setTicket(updated);
      setUpdateSuccess('Ticket updated.');
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || 'Unable to update ticket.'
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        'Are you sure you want to delete this ticket? This cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deleteTicket(id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setUpdateError(
        err.response?.data?.message || 'Unable to delete ticket.'
      );
    }
  }

  if (loading) return <Loading label="Loading ticket..." />;

  if (error) {
    return (
      <div>
        <ErrorMessage message={error} />
        <Link to="/dashboard" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{ticket.subject}</h1>
          <p className="page-subtitle">Ticket #{ticket.id}</p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="ticket-detail-grid">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem' }}>Description</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: '1rem' }}>Comments</h2>

            <CommentList comments={comments} />

            <CommentForm
              onSubmit={handlePostComment}
              submitting={commentSubmitting}
            />
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem' }}>Details</h2>

            <div className="detail-row">
              <span>Customer</span>
              <span>{ticket.customer_name}</span>
            </div>

            <div className="detail-row">
              <span>Email</span>
              <span>{ticket.customer_email}</span>
            </div>

            <div className="detail-row">
              <span>Assigned Agent</span>
              <span>
                {ticket.assigned_agent_name || 'Unassigned'}
              </span>
            </div>

            <div className="detail-row">
              <span>Created</span>
              <span>
                {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>

            <div className="detail-row">
              <span>Updated</span>
              <span>
                {new Date(ticket.updated_at).toLocaleString()}
              </span>
            </div>
          </div>

          {isAgent && (
            <div className="card">
              <h2 style={{ fontSize: '1rem' }}>Manage Ticket</h2>

              <ErrorMessage message={updateError} />

              {updateSuccess && (
                <div className="alert alert-success">
                  {updateSuccess}
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  className="form-select"
                  value={ticket.status}
                  disabled={updating}
                  onChange={(e) =>
                    handleFieldUpdate('status', e.target.value)
                  }
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  className="form-select"
                  value={ticket.priority}
                  disabled={updating}
                  onChange={(e) =>
                    handleFieldUpdate('priority', e.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {isAdminAgent && (
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor="assigned_to"
                  >
                    Assign to agent
                  </label>

                  <select
                    id="assigned_to"
                    className="form-select"
                    value={ticket.assigned_to || ''}
                    disabled={updating}
                    onChange={(e) =>
                      handleFieldUpdate(
                        'assigned_to',
                        e.target.value
                          ? Number(e.target.value)
                          : null
                      )
                    }
                  >
                    <option value="">Unassigned</option>

                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Ticket
              </button>
            </div>
          )}

          {!isAgent && (
            <div className="card">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


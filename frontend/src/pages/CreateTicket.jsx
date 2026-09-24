import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../services/ticketService';
import TicketForm from '../components/TicketForm';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleSubmit(values) {
    setSubmitting(true);
    setServerError('');
    try {
      const ticket = await createTicket(values);
      navigate(`/tickets/${ticket.id}`, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to create ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card wide">
      <h1>Create a Ticket</h1>
      <p className="page-subtitle">Describe your issue and we'll get back to you.</p>
      <TicketForm onSubmit={handleSubmit} submitting={submitting} serverError={serverError} />
    </div>
  );
}

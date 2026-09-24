import { useState } from 'react';

const initialErrors = { subject: '', description: '', priority: '' };

export default function TicketForm({ onSubmit, submitting, serverError }) {
  const [values, setValues] = useState({ subject: '', description: '', priority: 'medium' });
  const [errors, setErrors] = useState(initialErrors);

  function validate() {
    const next = { ...initialErrors };
    if (!values.subject.trim()) next.subject = 'Subject is required';
    if (!values.description.trim()) next.description = 'Description is required';
    if (!['low', 'medium', 'high'].includes(values.priority)) next.priority = 'Choose a priority';
    setErrors(next);
    return !next.subject && !next.description && !next.priority;
  }

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <ErrorFromServer message={serverError} />

      <div className="form-group">
        <label className="form-label" htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          className="form-input"
          value={values.subject}
          onChange={handleChange}
          placeholder="Briefly describe the issue"
        />
        {errors.subject && <div className="form-error">{errors.subject}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-textarea"
          rows={5}
          value={values.description}
          onChange={handleChange}
          placeholder="Give as much detail as possible"
        />
        {errors.description && <div className="form-error">{errors.description}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          className="form-select"
          value={values.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && <div className="form-error">{errors.priority}</div>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Create Ticket'}
      </button>
    </form>
  );
}

function ErrorFromServer({ message }) {
  if (!message) return null;
  return <div className="alert alert-error">{message}</div>;
}

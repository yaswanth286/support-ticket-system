import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!values.email.trim()) next.email = 'Email is required';
    if (!values.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(values);
      navigate('/dashboard', { replace: true });
      // role-based landing is handled by dashboard rendering per role
      void user;
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <h1>Welcome back</h1>
      <p className="page-subtitle">Log in to manage your support tickets.</p>

      <ErrorMessage message={serverError} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            placeholder="you@example.com"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
            placeholder="••••••••"
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: '0.88rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>

      <p style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
        Demo — Customer: customer@example.com / Customer@123 · Agent: agent@example.com / Agent@123
      </p>
    </div>
  );
}

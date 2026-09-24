import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'A valid email is required';
    if (values.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (values.confirmPassword !== values.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Unable to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <h1>Create your account</h1>
      <p className="page-subtitle">New accounts are created as customers.</p>

      <ErrorMessage message={serverError} />

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full name</label>
          <input id="name" name="name" className="form-input" value={values.name} onChange={handleChange} />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-input" value={values.email} onChange={handleChange} />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="form-input" value={values.password} onChange={handleChange} />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" value={values.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: 16, fontSize: '0.88rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

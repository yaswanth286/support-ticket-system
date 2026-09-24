import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="card" style={{ maxWidth: 480, margin: '60px auto', textAlign: 'center' }}>
      <h1>404</h1>
      <p className="page-subtitle">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
    </div>
  );
}

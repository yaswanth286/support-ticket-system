import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const dashboardPath = user?.role === 'agent' ? '/dashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? dashboardPath : '/login'} className="navbar-brand">
          <span className="navbar-brand-mark">ST</span>
          Support Tickets
        </Link>

        {isAuthenticated && (
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'customer' && <Link to="/tickets/new">New Ticket</Link>}
            <span className="navbar-user">
              {user.name} · {user.role === 'agent' ? 'Agent' : 'Customer'}
            </span>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

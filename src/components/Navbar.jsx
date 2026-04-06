import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="grid-navbar navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to={user ? '/challenges' : '/login'}>
          {'{ THE_GRID }'}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ borderColor: 'var(--accent)' }}
        >
          <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>☰</span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {user && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/challenges') ? 'active' : ''}`} to="/challenges">
                    ▸ Challenges
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/scoreboard') ? 'active' : ''}`} to="/scoreboard">
                    ▸ Scoreboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/teams') ? 'active' : ''}`} to="/teams">
                    ▸ Teams
                  </Link>
                </li>
                {user.role === 'gm' && (
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/gm') ? 'active' : ''}`} to="/gm">
                      ▸ GM Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <span style={{ color: 'var(--border)', padding: '0 0.5rem', fontSize: '1.2rem' }}>|</span>
                </li>
                <li className="nav-item">
                  <span style={{
                    color: 'var(--accent)',
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '0.85rem',
                    padding: '0.5rem 0.75rem',
                    letterSpacing: '1px'
                  }}>
                    @{user.username}{user.team?.name ? ` [${user.team.name}]` : ''}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn-grid-outline btn"
                    onClick={handleLogout}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 1rem' }}
                  >
                    LOGOUT
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
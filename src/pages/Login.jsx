import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../lib/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    setLoading(true)

    try {
      const data = await authApi.login(username, password)
      login(data)

      if (data.user.role === 'gm') {
        navigate('/gm')
      } else {
        navigate('/challenges')
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">

            <div className="login-logo">
              &gt;_ THE GRID<span className="blink">_</span>
            </div>
            <p className="login-subtitle">Capture The Flag Platform</p>

            <div className="grid-card p-4">
              {error && (
                <div className="grid-alert grid-alert-danger p-3 mb-3 rounded">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="grid-label">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="form-control grid-input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="username"
                    autoComplete="username"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="grid-label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control grid-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-grid w-100"
                  disabled={loading}
                >
                  {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                </button>
              </form>

              <div className="mt-3 text-center" style={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                fontFamily: 'Share Tech Mono, monospace'
              }}>
                <div>player: player1 / pass123</div>
                <div>gm: gmaster / admin123</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
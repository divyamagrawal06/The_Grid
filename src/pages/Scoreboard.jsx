import { useState, useEffect } from 'react'
import { mockStandings } from '../data/mockData'

export default function Scoreboard() {
  const [standings, setStandings] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const sorted = [...mockStandings].sort((a, b) => b.score - a.score)
      setStandings(sorted)
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  const getRankClass = (index) => {
    if (index === 0) return 'rank-1'
    if (index === 1) return 'rank-2'
    if (index === 2) return 'rank-3'
    return ''
  }

  const getRankSymbol = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return index + 1
  }

  return (
    <div>
      <div className="grid-jumbotron">
        <div className="container">
          <h1>SCOREBOARD</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            {standings.length} TEAMS COMPETING
          </p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">

            {loading && (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  style={{ color: 'var(--accent)', width: '3rem', height: '3rem' }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'Share Tech Mono, monospace',
                  marginTop: '1rem',
                  letterSpacing: '2px'
                }}>
                  LOADING STANDINGS...
                </p>
              </div>
            )}

            {!loading && standings.length > 0 && (
              <div className="grid-card" style={{ overflow: 'hidden' }}>
                <table className="table mb-0" style={{
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-nav)', borderBottom: '2px solid var(--accent)' }}>
                      <th style={{
                        width: '80px',
                        fontFamily: 'Share Tech Mono, monospace',
                        color: 'var(--accent)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        border: 'none',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-nav)'
                      }}>Place</th>
                      <th className="text-start ps-3" style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        color: 'var(--accent)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        border: 'none',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-nav)'
                      }}>Team</th>
                      <th style={{
                        width: '120px',
                        textAlign: 'right',
                        paddingRight: '1.5rem',
                        fontFamily: 'Share Tech Mono, monospace',
                        color: 'var(--accent)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        border: 'none',
                        padding: '1rem',
                        backgroundColor: 'var(--bg-nav)'
                      }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr key={team.id} style={{
                        backgroundColor: index % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,255,136,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)'}
                      >
                        <td style={{ border: 'none', padding: '1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                          <span className={getRankClass(index)} style={{
                            fontFamily: 'Share Tech Mono, monospace',
                            fontWeight: '700',
                            fontSize: index < 3 ? '1.2rem' : '1rem',
                            color: index >= 3 ? 'var(--text-muted)' : undefined
                          }}>
                            {getRankSymbol(index)}
                          </span>
                        </td>
                        <td className="text-start ps-3" style={{ border: 'none', padding: '1rem', verticalAlign: 'middle' }}>
                          <span style={{
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            color: index === 0 ? 'var(--accent)' : 'var(--text-primary)'
                          }}>
                            {team.name}
                          </span>
                        </td>
                        <td style={{
                          textAlign: 'right',
                          paddingRight: '1.5rem',
                          fontFamily: 'Share Tech Mono, monospace',
                          color: 'var(--accent)',
                          fontWeight: '700',
                          border: 'none',
                          padding: '1rem',
                          verticalAlign: 'middle'
                        }}>
                          {team.score.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && standings.length === 0 && (
              <div className="text-center py-5">
                <p style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'Share Tech Mono, monospace',
                  letterSpacing: '2px'
                }}>
                  SCOREBOARD IS EMPTY
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
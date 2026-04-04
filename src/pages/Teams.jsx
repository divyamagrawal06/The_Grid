import { useEffect, useState } from 'react'
import { teamsApi } from '../lib/api'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [selectedSlug, setSelectedSlug] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadTeams() {
      setLoading(true)
      try {
        const data = await teamsApi.list()
        if (mounted) {
          const sorted = [...(data.teams || [])].sort((a, b) => b.score - a.score)
          setTeams(sorted)
          setError('')
          if (sorted[0]) {
            setSelectedSlug(sorted[0].slug)
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load teams.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadTeams()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    if (!selectedSlug) return

    async function loadTeamDetails() {
      setDetailsLoading(true)
      try {
        const data = await teamsApi.bySlug(selectedSlug)
        if (mounted) {
          setSelectedTeam(data.team)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load team profile.')
        }
      } finally {
        if (mounted) {
          setDetailsLoading(false)
        }
      }
    }

    loadTeamDetails()
    return () => {
      mounted = false
    }
  }, [selectedSlug])

  return (
    <div>
      <div className="grid-jumbotron">
        <div className="container">
          <h1>TEAM PROFILES</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            {teams.length} REGISTERED TEAMS
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {!!error && <div className="grid-alert grid-alert-danger p-3 mb-3 rounded">⚠ {error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-lg-5">
              <div className="grid-card p-3">
                <h6 style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  color: 'var(--accent)',
                  letterSpacing: '2px',
                  marginBottom: '1rem'
                }}>
                  RANKED TEAMS
                </h6>

                <div className="d-flex flex-column gap-2">
                  {teams.map((team, index) => (
                    <button
                      key={team.id}
                      onClick={() => setSelectedSlug(team.slug)}
                      className="btn text-start"
                      style={{
                        border: selectedSlug === team.slug ? '1px solid var(--accent)' : '1px solid var(--border)',
                        backgroundColor: selectedSlug === team.slug ? 'rgba(0,255,136,0.08)' : 'var(--bg-card)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div style={{ fontWeight: 700 }}>{index + 1}. {team.name}</div>
                          <small style={{ color: 'var(--text-muted)' }}>{team.members} members • {team.country || 'N/A'}</small>
                        </div>
                        <span className="mono" style={{ color: 'var(--accent)' }}>{team.score}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="grid-card p-4 h-100">
                {detailsLoading && (
                  <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status" />
                  </div>
                )}

                {!detailsLoading && selectedTeam && (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        src={selectedTeam.avatarUrl || 'https://api.dicebear.com/9.x/shapes/svg?seed=team'}
                        alt={selectedTeam.name}
                        width="72"
                        height="72"
                        style={{ borderRadius: '50%', border: '1px solid var(--border)' }}
                      />
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--accent)' }}>{selectedTeam.name}</h4>
                        <small style={{ color: 'var(--text-muted)' }}>
                          {selectedTeam.country || 'Unknown region'}
                        </small>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-primary)' }}>{selectedTeam.bio || 'No bio provided.'}</p>

                    <h6 style={{ color: 'var(--accent-blue)' }}>Members</h6>
                    <ul>
                      {selectedTeam.members.map((member) => (
                        <li key={member._id}>{member.displayName} <span style={{ color: 'var(--text-muted)' }}>@{member.username}</span></li>
                      ))}
                    </ul>

                    <h6 style={{ color: 'var(--accent-blue)' }}>Recent Solves</h6>
                    {selectedTeam.recentSolves.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)' }}>No recent solves yet.</p>
                    ) : (
                      <ul>
                        {selectedTeam.recentSolves.map((solve) => (
                          <li key={solve._id}>
                            {solve.name} <span className="mono" style={{ color: 'var(--accent)' }}>+{solve.value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

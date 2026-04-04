import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../lib/api'

export default function GMPanel() {
  const [challenges, setChallenges] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm]             = useState(false)
  const [editingChallenge, setEditingChallenge] = useState(null)
  const [feedback, setFeedback]             = useState(null)
  const [formData, setFormData]             = useState({
    name: '', category: '', value: '', description: '', flag: '',
  })

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const refreshData = async () => {
    const [challengeRes, statsRes] = await Promise.all([
      adminApi.listChallenges(),
      adminApi.stats(),
    ])
    setChallenges(challengeRes.challenges || [])
    setStats(statsRes.stats || null)
  }

  useEffect(() => {
    let mounted = true

    async function load() {
      setLoading(true)
      try {
        await refreshData()
      } catch (err) {
        if (mounted) {
          setFeedback({ type: 'error', msg: err.message || 'Failed to load admin data.' })
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleAddNew = () => {
    setEditingChallenge(null)
    setFormData({ name: '', category: '', value: '', description: '', flag: '' })
    setShowForm(true)
    setFeedback(null)
  }

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge)
    setFormData({
      name:        challenge.name,
      category:    challenge.category,
      value:       String(challenge.value),
      description: challenge.description,
      flag:        '',
    })
    setShowForm(true)
    setFeedback(null)
  }

  const handleDelete = (challengeId) => {
    if (!window.confirm('Delete this challenge?')) return
    adminApi
      .deleteChallenge(challengeId)
      .then(async () => {
        await refreshData()
        setFeedback({ type: 'success', msg: 'Challenge deleted.' })
      })
      .catch((err) => {
        setFeedback({ type: 'error', msg: err.message || 'Failed to delete challenge.' })
      })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.value) {
      setFeedback({ type: 'error', msg: 'Name, category, and points are required.' })
      return
    }

    try {
      if (editingChallenge) {
        await adminApi.updateChallenge(editingChallenge.id, {
          name: formData.name,
          category: formData.category,
          value: Number(formData.value),
          description: formData.description,
          ...(formData.flag ? { flag: formData.flag } : {}),
        })
        setFeedback({ type: 'success', msg: `"${formData.name}" updated successfully.` })
      } else {
        await adminApi.createChallenge({
          name: formData.name,
          category: formData.category,
          value: Number(formData.value),
          description: formData.description,
          flag: formData.flag,
        })
        setFeedback({ type: 'success', msg: `"${formData.name}" added successfully.` })
      }
      await refreshData()
      setShowForm(false)
      setEditingChallenge(null)
      setFormData({ name: '', category: '', value: '', description: '', flag: '' })
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to save challenge.' })
    }
  }

  const categoryCount = useMemo(() => challenges.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1
    return acc
  }, {}), [challenges])

  return (
    <div>
      <div className="grid-jumbotron">
        <div className="container">
          <h1>GM PANEL</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            GAME MASTER COMMAND CENTER
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--accent)' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {feedback && (
          <div className={`grid-alert p-3 mb-4 rounded ${
            feedback.type === 'success' ? 'grid-alert-success' : 'grid-alert-danger'
          }`}>
            {feedback.msg}
          </div>
        )}

        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: 'var(--accent)' }}>
                {challenges.length}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Total Challenges
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: 'var(--accent-blue)' }}>
                {stats?.teamCount ?? Object.keys(categoryCount).length}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Teams
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: '#ffd700' }}>
                {stats?.userCount ?? 0}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Players
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: 'var(--accent)' }}>
                {stats?.submissionCount ?? 0}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Submissions
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--accent)', letterSpacing: '2px', margin: 0 }}>
            CHALLENGE MANAGEMENT
          </h5>
          <button className="btn btn-grid" onClick={showForm ? () => setShowForm(false) : handleAddNew}>
            {showForm ? 'CANCEL' : '+ ADD CHALLENGE'}
          </button>
        </div>

        {showForm && (
          <div className="grid-card p-4 mb-4">
            <h6 style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--accent-blue)', letterSpacing: '2px', marginBottom: '1.25rem' }}>
              {editingChallenge ? `EDITING: ${editingChallenge.name}` : 'NEW CHALLENGE'}
            </h6>
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="grid-label">Challenge Name</label>
                  <input type="text" name="name" className="form-control grid-input" value={formData.name} onChange={handleFormChange} placeholder="SQL Injection 101" />
                </div>
                <div className="col-md-4">
                  <label className="grid-label">Category</label>
                  <input type="text" name="category" className="form-control grid-input" value={formData.category} onChange={handleFormChange} placeholder="Web, Crypto, Forensics..." />
                </div>
                <div className="col-md-2">
                  <label className="grid-label">Points</label>
                  <input type="number" name="value" className="form-control grid-input" value={formData.value} onChange={handleFormChange} placeholder="100" min="1" />
                </div>
                <div className="col-12">
                  <label className="grid-label">Description</label>
                  <textarea name="description" className="form-control grid-input" value={formData.description} onChange={handleFormChange} placeholder="Challenge description and hints..." rows={3} />
                </div>
                <div className="col-12">
                  <label className="grid-label">Flag</label>
                  <input type="text" name="flag" className="form-control grid-input" value={formData.flag} onChange={handleFormChange} placeholder="FLAG{...}" style={{ fontFamily: 'Share Tech Mono, monospace' }} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-grid">
                    {editingChallenge ? 'SAVE CHANGES' : 'CREATE CHALLENGE'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid-card">
          <table className="table grid-table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th className="text-start ps-3">Name</th>
                <th>Category</th>
                <th>Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(challenge => (
                <tr key={challenge.id}>
                  <td style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    #{challenge.id}
                  </td>
                  <td className="text-start ps-3" style={{ fontWeight: '600' }}>{challenge.name}</td>
                  <td><span className="grid-badge">{challenge.category}</span></td>
                  <td style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--accent)' }}>{challenge.value}</td>
                  <td>
                    {challenge.isActive
                      ? <span style={{ color: 'var(--accent)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem' }}>ACTIVE</span>
                      : <span style={{ color: 'var(--text-muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem' }}>DISABLED</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-sm-grid btn-grid-outline" onClick={() => handleEdit(challenge)}>EDIT</button>
                      <button
                        className="btn btn-sm btn-sm-grid"
                        onClick={() => handleDelete(challenge.id)}
                        style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem', letterSpacing: '1px', borderRadius: '3px' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

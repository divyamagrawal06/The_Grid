import { useState } from 'react'
import { mockChallenges } from '../data/mockData'

export default function GMPanel() {
  const [challenges, setChallenges]         = useState(mockChallenges)
  const [showForm, setShowForm]             = useState(false)
  const [editingChallenge, setEditingChallenge] = useState(null)
  const [feedback, setFeedback]             = useState(null)
  const [formData, setFormData]             = useState({
    name: '', category: '', value: '', description: '', flag: '',
  })

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
    setChallenges(prev => prev.filter(c => c.id !== challengeId))
    setFeedback({ type: 'success', msg: 'Challenge deleted.' })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.category || !formData.value) {
      setFeedback({ type: 'error', msg: 'Name, category, and points are required.' })
      return
    }
    if (editingChallenge) {
      setChallenges(prev => prev.map(c =>
        c.id === editingChallenge.id
          ? { ...c, name: formData.name, category: formData.category, value: parseInt(formData.value), description: formData.description }
          : c
      ))
      setFeedback({ type: 'success', msg: `"${formData.name}" updated successfully.` })
    } else {
      const newChallenge = {
        id:           Math.max(...challenges.map(c => c.id)) + 1,
        name:         formData.name,
        category:     formData.category,
        value:        parseInt(formData.value),
        description:  formData.description,
        solved_by_me: false,
        tags:         [],
      }
      setChallenges(prev => [...prev, newChallenge])
      setFeedback({ type: 'success', msg: `"${formData.name}" added successfully.` })
    }
    setShowForm(false)
    setEditingChallenge(null)
  }

  const categoryCount = challenges.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1
    return acc
  }, {})

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
                {Object.keys(categoryCount).length}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Categories
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: '#ffd700' }}>
                {challenges.reduce((sum, c) => sum + c.value, 0).toLocaleString()}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Total Points
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="grid-card p-3 text-center">
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '2rem', color: 'var(--accent)' }}>
                {challenges.filter(c => c.solved_by_me).length}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Solved
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
                    {challenge.solved_by_me
                      ? <span style={{ color: 'var(--accent)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem' }}>✓ SOLVED</span>
                      : <span style={{ color: 'var(--text-muted)', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem' }}>OPEN</span>
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

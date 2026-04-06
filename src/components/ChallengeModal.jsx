import { useState } from 'react'

export default function ChallengeModal({ challenge, onClose, onSolve, onSubmitFlag }) {
  const [flag, setFlag]           = useState('')
  const [feedback, setFeedback]   = useState(null)
  const [feedbackType, setFeedbackType] = useState('')
  const [loading, setLoading]     = useState(false)

  if (!challenge) return null

  const handleFlagSubmit = async (e) => {
    e.preventDefault()
    if (!flag.trim()) {
      setFeedback('Please enter a flag.')
      setFeedbackType('error')
      return
    }
    setLoading(true)
    setFeedback(null)
    try {
      const result = await onSubmitFlag(challenge.id, flag)

      if (result.correct) {
        if (result.alreadySolved) {
          setFeedback('✓ Already solved by your account.')
        } else {
          setFeedback(`🎉 Correct! +${result.pointsAwarded} points awarded.`)
        }
        setFeedbackType('success')
        setFlag('')
        onSolve(challenge.id)
      } else {
        setFeedback('Incorrect flag. Try again.')
        setFeedbackType('error')
      }
    } catch (err) {
      setFeedback(err.message || 'Submission failed.')
      setFeedbackType('error')
    }

    setLoading(false)
  }

  const handleClose = () => {
    setFlag('')
    setFeedback(null)
    setFeedbackType('')
    onClose()
  }

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg grid-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title">{challenge.name}</h5>
              <div className="mt-1 d-flex gap-2 align-items-center">
                <span className="grid-badge">{challenge.category}</span>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  color: 'var(--accent)',
                  fontSize: '0.9rem'
                }}>
                  {challenge.value} pts
                </span>
                {challenge.solvedByMe && (
                  <span style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    border: '1px solid var(--accent)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  }}>✓ SOLVED</span>
                )}
              </div>
            </div>
            <button className="btn-close btn-close-white" onClick={handleClose} />
          </div>

          <div className="modal-body">
            <p style={{
              color: 'var(--text-primary)',
              lineHeight: '1.7',
              whiteSpace: 'pre-line'
            }}>
              {challenge.description}
            </p>

            <hr style={{ borderColor: 'var(--border)' }} />

            {feedback && (
              <div className={`grid-alert p-3 mb-3 rounded ${
                feedbackType === 'success' ? 'grid-alert-success' : 'grid-alert-danger'
              }`}>
                {feedback}
              </div>
            )}

            {!challenge.solvedByMe && (
              <form onSubmit={handleFlagSubmit}>
                <label className="grid-label">Submit Flag</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control grid-input"
                    placeholder="FLAG{...}"
                    value={flag}
                    onChange={e => setFlag(e.target.value)}
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-grid"
                    disabled={loading}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {loading ? '...' : 'SUBMIT'}
                  </button>
                </div>
              </form>
            )}

            {challenge.solvedByMe && !feedback && (
              <div className="grid-alert grid-alert-success p-3 rounded">
                ✓ You have already solved this challenge.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useMemo, useState } from 'react'
import { challengeApi } from '../lib/api'
import ChallengeModal from '../components/ChallengeModal'

export default function Challenges() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadChallenges() {
      setLoading(true)
      setError('')
      try {
        const data = await challengeApi.list()
        if (mounted) {
          setChallenges(data.challenges)
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load challenges.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadChallenges()
    return () => {
      mounted = false
    }
  }, [])

  const categories = useMemo(
    () => [...new Set(challenges.map((c) => c.category))],
    [challenges]
  )

  const getChallengesByCategory = (category) => {
    return challenges.filter(c => c.category === category)
  }

  const handleChallengeClick = (challenge) => {
    setSelectedChallenge(challenge)
  }

  const handleModalClose = () => {
    setSelectedChallenge(null)
  }

  const handleSolve = (challengeId) => {
    setChallenges(prev => prev.map(c =>
      c.id === challengeId ? { ...c, solvedByMe: true } : c
    ))
    setSelectedChallenge(prev =>
      prev && prev.id === challengeId ? { ...prev, solvedByMe: true } : prev
    )
  }

  const solvedCount = challenges.filter(c => c.solvedByMe).length
  const totalCount  = challenges.length

  return (
    <div>
      <div className="grid-jumbotron">
        <div className="container">
          <h1>CHALLENGES</h1>
          <p style={{
            color: 'var(--text-muted)',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '0.85rem',
            letterSpacing: '2px',
            marginTop: '0.5rem',
            marginBottom: 0
          }}>
            {solvedCount} / {totalCount} SOLVED
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

        {!!error && (
          <div className="grid-alert grid-alert-danger p-3 mb-4 rounded">⚠ {error}</div>
        )}

        {categories.map(category => (
          <div key={category} className="pt-4">
            <div className="category-header mb-3">
              <h3>{category}</h3>
            </div>
            <div className="row g-3">
              {getChallengesByCategory(category).map(challenge => (
                <div key={challenge.id} className="col-sm-6 col-md-4 col-lg-3">
                  <button
                    className={`challenge-button w-100 ${
                      challenge.solvedByMe ? 'challenge-solved' : ''
                    }`}
                    onClick={() => handleChallengeClick(challenge)}
                  >
                    <div className="challenge-inner my-3 px-2">
                      <p>{challenge.name}</p>
                      <span>{challenge.value}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ChallengeModal
        challenge={selectedChallenge}
        onClose={handleModalClose}
        onSubmitFlag={challengeApi.submitFlag}
        onSolve={handleSolve}
      />
    </div>
  )
}
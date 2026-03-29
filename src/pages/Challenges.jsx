import { useState } from 'react'
import { mockChallenges } from '../data/mockData'
import ChallengeModal from '../components/ChallengeModal'

export default function Challenges() {
  const [challenges, setChallenges]           = useState(mockChallenges)
  const [selectedChallenge, setSelectedChallenge] = useState(null)

  const categories = [...new Set(challenges.map(c => c.category))]

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
      c.id === challengeId ? { ...c, solved_by_me: true } : c
    ))
    setSelectedChallenge(prev =>
      prev && prev.id === challengeId ? { ...prev, solved_by_me: true } : prev
    )
  }

  const solvedCount = challenges.filter(c => c.solved_by_me).length
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
                      challenge.solved_by_me ? 'challenge-solved' : ''
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
        onSolve={handleSolve}
      />
    </div>
  )
}
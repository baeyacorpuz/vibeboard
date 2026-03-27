import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: '#6366f1',
  color: 'white',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
}

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#6366f1',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: '2px solid #6366f1',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid #d1d5db',
  fontSize: '1rem',
  width: '200px',
}

export default function Home() {
  const navigate = useNavigate()
  const [roomIdInput, setRoomIdInput] = useState('')

  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID()
    navigate(`/room/${roomId}`)
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomIdInput.trim()) {
      navigate(`/room/${roomIdInput.trim()}`)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1>How's your team feeling today?</h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Quick, anonymous mood sharing for team check-ins
        </p>
      </section>

      {/* Actions */}
      <section
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        <button onClick={handleCreateRoom} style={primaryButtonStyle}>
          Create Room
        </button>
        <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={secondaryButtonStyle}>
            Join
          </button>
        </form>
      </section>

      {/* Preview */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>See it in action</h2>
        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            maxWidth: '400px',
            margin: '0 auto',
            backgroundColor: '#f9fafb',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
            Team Mood (5 participants)
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <span style={{ marginRight: '0.5rem' }}>😊</span> Happy <span style={{ color: '#6b7280' }}>x 2</span>
            </div>
            <div>
              <span style={{ marginRight: '0.5rem' }}>🔥</span> Productive <span style={{ color: '#6b7280' }}>x 2</span>
            </div>
            <div>
              <span style={{ marginRight: '0.5rem' }}>😐</span> Neutral <span style={{ color: '#6b7280' }}>x 1</span>
            </div>
            <div>
              <span style={{ marginRight: '0.5rem' }}>😓</span> Stressed <span style={{ color: '#9ca3af' }}>x 0</span>
            </div>
            <div>
              <span style={{ marginRight: '0.5rem' }}>💤</span> Tired <span style={{ color: '#9ca3af' }}>x 0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Perfect for</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span>🎯 Sprint Retrospectives</span>
          <span>☀️ Daily Standups</span>
          <span>💬 Async Check-ins</span>
        </div>
      </section>
    </div>
  )
}

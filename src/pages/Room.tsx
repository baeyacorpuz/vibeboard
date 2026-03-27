import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { joinRoom, submitMood, subscribeToMoods, type Mood, type MoodData } from '../lib/room'
import MoodSelector from '../components/MoodSelector'
import MoodBoard from '../components/MoodBoard'

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>()
  const [status, setStatus] = useState<'joining' | 'joined' | 'error'>('joining')
  const [error, setError] = useState<string | null>(null)
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moods, setMoods] = useState<MoodData[]>([])
  const [copied, setCopied] = useState(false)

  const roomUrl = `${window.location.origin}/room/${roomId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    if (!roomId) return
    
    joinRoom(roomId)
      .then(() => setStatus('joined'))
      .catch((err) => {
        setStatus('error')
        setError(err.message)
      })
  }, [roomId])

  useEffect(() => {
    if (!roomId || status !== 'joined') return
    
    const unsubscribe = subscribeToMoods(roomId, (moodData) => {
      setMoods(moodData)
    })
    
    return () => unsubscribe()
  }, [roomId, status])

  const handleMoodSelect = async (mood: Mood) => {
    if (!roomId) return

    setIsSubmitting(true)
    try {
      await submitMood(roomId, mood)
      setSelectedMood(mood)
    } catch (err) {
      console.error('Failed to submit mood:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!roomId) {
    return <div>Invalid room ID</div>
  }

  if (status === 'joining') {
    return <div>Joining room...</div>
  }

  if (status === 'error') {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
          Room
        </p>
        <code style={{ 
          fontSize: '12px', 
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          {roomId}
        </code>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
          Share this link with your team:
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <code style={{ 
            padding: '8px 12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '6px',
            fontSize: '13px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '300px'
          }}>
            {roomUrl}
          </code>
          <button 
            onClick={handleCopyLink}
            style={{
              padding: '8px 16px',
              backgroundColor: copied ? '#10b981' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
      <h2 style={{ marginBottom: '1rem' }}>How are you feeling?</h2>
      <MoodSelector
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelect}
        disabled={isSubmitting}
      />
      <div style={{ marginTop: '2rem' }}>
        <MoodBoard moods={moods} yourMood={selectedMood} />
      </div>
    </div>
  )
}

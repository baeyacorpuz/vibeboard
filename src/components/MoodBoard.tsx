import { type MoodData } from '../lib/room'

interface MoodBoardProps {
  moods: MoodData[]
  yourMood?: string | null
}

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😓', label: 'Stressed', value: 'stressed' },
  { emoji: '🔥', label: 'Productive', value: 'productive' },
  { emoji: '💤', label: 'Tired', value: 'tired' },
]

export default function MoodBoard({ moods, yourMood }: MoodBoardProps) {
  const moodCounts = MOODS.map((mood) => ({
    ...mood,
    count: moods.filter((m) => m.mood === mood.value).length,
  }))

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    minWidth: '200px',
  }

  const headerStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1f2937',
    marginBottom: '12px',
  }

  const getRowStyle = (moodValue: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: moodValue === yourMood ? '#f5f3ff' : 'transparent',
    borderRadius: '6px',
    borderLeft: moodValue === yourMood ? '3px solid #6366f1' : '3px solid transparent',
  })

  const emojiStyle: React.CSSProperties = {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center' as const,
  }

  const countStyle: React.CSSProperties = {
    fontWeight: 600,
    color: '#6366f1',
    marginLeft: 'auto',
  }

  // Empty state
  if (moods.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>Team Mood</div>
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '16px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '8px' }}>No moods submitted yet</p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Be the first to share how you're feeling!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        Team Mood ({moods.length} participant{moods.length !== 1 ? 's' : ''})
      </div>
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
        {moodCounts.map((mood) => (
          <div key={mood.value} style={getRowStyle(mood.value)}>
            <span style={emojiStyle}>{mood.emoji}</span>
            <span>{mood.label}</span>
            {mood.value === yourMood && (
              <span style={{ fontSize: '12px', color: '#6366f1', marginLeft: '4px' }}>
                (You)
              </span>
            )}
            <span style={countStyle}>x {mood.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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

  // Calculate max count for bar width calculation
  const maxCount = Math.max(...moodCounts.map((m) => m.count), 1)

  // Empty state
  if (moods.length === 0) {
    return (
      <div className="mb-8">
        <p className="text-sm text-gray-500">No moods submitted yet</p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      {/* Header */}
      <p className="text-sm text-gray-500 mb-6">
        Team · {moods.length} {moods.length === 1 ? 'person' : 'people'}
      </p>

      {/* Mood Bars */}
      <div className="space-y-4">
        {moodCounts.map((mood) => {
          const barWidth = maxCount > 0 ? (mood.count / maxCount) * 100 : 0
          const isYou = mood.value === yourMood

          return (
            <div key={mood.value}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-lg font-medium">{mood.count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isYou ? 'bg-indigo-600' : 'bg-indigo-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

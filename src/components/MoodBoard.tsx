import { type MoodData } from '../lib/room'
import { MOODS } from '../lib/moods'

interface MoodBoardProps {
  moods: MoodData[]
  yourMood?: string | null
  roomId?: string
}

export default function MoodBoard({ moods, yourMood, roomId }: MoodBoardProps) {
  const moodCounts = MOODS.map((mood) => ({
    ...mood,
    count: moods.filter((m) => m.mood === mood.value).length,
  }))

  const exportToCSV = () => {
    const csv = [
      'Mood,Count',
      ...moodCounts.map((m) => `${m.label},${m.count}`),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mood-results-${roomId || 'unknown'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate max count for bar width calculation
  const maxCount = Math.max(...moodCounts.map((m) => m.count), 1)

  // Empty state
  if (moods.length === 0) {
    return (
      <div className="mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">No moods submitted yet</p>
      </div>
    )
  }

  return (
    <div className='mb-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Team · {moods.length} {moods.length === 1 ? 'person' : 'people'}
        </p>
        {moods.length > 0 && (
          <button
            onClick={exportToCSV}
            className='text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
          >
            Export CSV
          </button>
        )}
      </div>

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
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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

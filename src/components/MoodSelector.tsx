import { useState } from 'react'
import { type Mood } from '../lib/room'
import { MOODS } from '../lib/moods'

interface MoodSelectorProps {
  selectedMood: Mood | null
  onMoodSelect: (mood: Mood) => void
  disabled?: boolean
}

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
  disabled,
}: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)

  if (disabled) {
    return (
      <div className="flex gap-4" aria-busy="true" aria-label="Loading moods">
        {MOODS.map((mood) => (
          <div
            key={mood.value}
            className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-lg border border-gray-200 dark:border-gray-700 opacity-60"
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{mood.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-4" role="group" aria-label="Select your mood">
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.value
        const isHovered = hoveredMood === mood.value

        return (
          <button
            key={mood.value}
            type="button"
            className={`flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-lg border transition-all ${
              isSelected
                ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900'
                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            style={{
              transform: isHovered && !isSelected ? 'scale(1.05)' : 'scale(1)',
            }}
            onClick={() => onMoodSelect(mood.value)}
            onMouseEnter={() => setHoveredMood(mood.value)}
            onMouseLeave={() => setHoveredMood(null)}
            aria-pressed={isSelected}
            aria-label={mood.label}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className={`text-xs ${isSelected ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

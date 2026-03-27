import { useState } from 'react'
import { type Mood } from '../lib/room'

interface MoodOption {
  emoji: string
  label: string
  value: Mood
}

interface MoodSelectorProps {
  selectedMood: Mood | null
  onMoodSelect: (mood: Mood) => void
  disabled?: boolean
}

const MOODS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😓', label: 'Stressed', value: 'stressed' },
  { emoji: '🔥', label: 'Productive', value: 'productive' },
  { emoji: '💤', label: 'Tired', value: 'tired' },
]

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
            className="flex flex-col items-center justify-center gap-1 w-20 h-20 rounded-lg border border-gray-200 opacity-60"
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs text-gray-500">{mood.label}</span>
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
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
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
            <span className={`text-xs ${isSelected ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
              {mood.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

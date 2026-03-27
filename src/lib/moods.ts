import { type Mood } from './room'

export interface MoodOption {
  emoji: string
  label: string
  value: Mood
}

export const MOODS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😓', label: 'Stressed', value: 'stressed' },
  { emoji: '🔥', label: 'Productive', value: 'productive' },
  { emoji: '💤', label: 'Tired', value: 'tired' },
] as const

export const isValidMood = (value: string): value is Mood =>
  MOODS.some((m) => m.value === value)

export const getMoodByValue = (value: Mood): MoodOption | undefined =>
  MOODS.find((m) => m.value === value)
import { useState } from 'react';
import { type Mood } from '../lib/room';

interface MoodOption {
  emoji: string;
  label: string;
  value: Mood;
}

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood) => void;
  disabled?: boolean;
}

const MOODS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😓', label: 'Stressed', value: 'stressed' },
  { emoji: '🔥', label: 'Productive', value: 'productive' },
  { emoji: '💤', label: 'Tired', value: 'tired' },
];

export default function MoodSelector({
  selectedMood,
  onMoodSelect,
  disabled,
}: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    padding: '8px 0',
  };

  const buttonStyle = (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '16px',
    border: isSelected ? '3px solid #6366f1' : '2px solid transparent',
    backgroundColor: isSelected ? '#eef2ff' : '#f9fafb',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    minWidth: '88px',
    boxShadow: isSelected ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
  });

  const emojiStyle = (
    isSelected: boolean,
    isHovered: boolean,
  ): React.CSSProperties => ({
    fontSize: '48px',
    lineHeight: 1,
    transition: 'transform 0.2s ease',
    transform:
      isHovered && !disabled
        ? 'scale(1.15)'
        : isSelected
          ? 'scale(1.05)'
          : 'scale(1)',
  });

  const labelStyle = (isSelected: boolean): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 500,
    color: isSelected ? '#4f46e5' : '#6b7280',
    transition: 'color 0.2s ease',
  });

  if (disabled) {
    return (
      <div style={containerStyle} aria-busy='true' aria-label='Loading moods'>
        {MOODS.map((mood) => (
          <div key={mood.value} style={buttonStyle(false)} aria-hidden='true'>
            <span style={emojiStyle(false, false)}>{mood.emoji}</span>
            <span style={labelStyle(false)}>{mood.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle} role='group' aria-label='Select your mood'>
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.value;
        const isHovered = hoveredMood === mood.value;
        return (
          <button
            key={mood.value}
            type='button'
            style={buttonStyle(isSelected)}
            onClick={() => onMoodSelect(mood.value)}
            onMouseEnter={() => setHoveredMood(mood.value)}
            onMouseLeave={() => setHoveredMood(null)}
            aria-pressed={isSelected}
            aria-label={mood.label}
          >
            <span style={emojiStyle(isSelected, isHovered)}>{mood.emoji}</span>
            <span style={labelStyle(isSelected)}>{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

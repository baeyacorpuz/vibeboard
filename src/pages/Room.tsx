import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  joinRoom,
  submitMood,
  subscribeToMoods,
  type Mood,
  type MoodData,
} from '../lib/room';
import MoodSelector from '../components/MoodSelector';
import MoodBoard from '../components/MoodBoard';
import Timer from '../components/Timer';
import ThemeToggle from '../components/ThemeToggle';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😓', label: 'Stressed', value: 'stressed' },
  { emoji: '🔥', label: 'Productive', value: 'productive' },
  { emoji: '💤', label: 'Tired', value: 'tired' },
];

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [status, setStatus] = useState<'joining' | 'joined' | 'error'>(
    'joining',
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moods, setMoods] = useState<MoodData[]>([]);
  const [copied, setCopied] = useState(false);

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    joinRoom(roomId)
      .then(() => setStatus('joined'))
      .catch((err) => {
        setStatus('error');
        setError(err.message);
      });
  }, [roomId]);

  useEffect(() => {
    if (!roomId || status !== 'joined') return;

    const unsubscribe = subscribeToMoods(roomId, (moodData) => {
      setMoods(moodData);
    });

    return () => unsubscribe();
  }, [roomId, status]);

  const handleMoodSelect = async (mood: Mood) => {
    if (!roomId) return;

    setIsSubmitting(true);
    try {
      await submitMood(roomId, mood);
      setSelectedMood(mood);
    } catch (err) {
      console.error('Failed to submit mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodDisplay = (mood: Mood | null) => {
    if (!mood) return null;
    return MOODS.find((m) => m.value === mood);
  };

  const moodDisplay = getMoodDisplay(selectedMood);

  if (!roomId) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-600 dark:text-gray-400'>Invalid room ID</p>
      </div>
    );
  }

  if (status === 'joining') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400'>
          <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
              fill='none'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
            />
          </svg>
          Joining room...
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
        <p className='text-red-600 dark:text-red-400'>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <header className='flex justify-end p-4'>
        <ThemeToggle />
      </header>
      <main className='max-w-3xl mx-auto px-6 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <code className='text-sm text-gray-600 dark:text-gray-400 font-mono'>
            {roomId}
          </code>
          <button
            onClick={handleCopyLink}
            className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <Timer initialMinutes={5} />

        <div className='mb-12'>
          <h2 className='text-lg text-gray-900 dark:text-gray-100 mb-6'>
            How are you feeling?
          </h2>
          <MoodSelector
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
            disabled={isSubmitting}
          />
        </div>

        {moodDisplay && (
          <p className='text-sm text-gray-600 dark:text-gray-400 my-8'>
            Your mood: {moodDisplay.emoji} {moodDisplay.label}
          </p>
        )}

        <div className='border-t border-gray-200 dark:border-gray-700 my-8' />

        <MoodBoard moods={moods} yourMood={selectedMood} roomId={roomId} />
      </main>
    </div>
  );
}

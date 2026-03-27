import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSnapshot, type SnapshotData, type MoodSnapshot } from '../lib/room';
import { getMoodByValue } from '../lib/moods';
import ThemeToggle from '../components/ThemeToggle';

export default function SnapshotView() {
  const { roomId, snapshotId } = useParams<{ roomId: string; snapshotId: string }>();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomName] = useState<string | null>(() => {
    if (!roomId) return null;
    const recentRooms = JSON.parse(localStorage.getItem('vibeboard_recent_rooms') || '[]');
    const currentRoom = recentRooms.find((r: { id: string }) => r.id === roomId);
    return currentRoom?.name || null;
  });

  useEffect(() => {
    if (!roomId || !snapshotId) return;

    getSnapshot(roomId, snapshotId)
      .then((data) => {
        setSnapshot(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [roomId, snapshotId]);

  const handleCreateNewRoom = () => {
    const newRoomId = crypto.randomUUID();
    navigate(`/room/${newRoomId}`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const truncateId = (id: string, maxLength = 20) => {
    if (id.length <= maxLength) return id;
    return id.slice(0, maxLength) + '...';
  };

  const getMoodDisplay = (moodValue: string) => {
    return getMoodByValue(moodValue as 'happy' | 'neutral' | 'stressed' | 'productive' | 'tired');
  };

  // Calculate max count for bar width
  const maxCount = snapshot?.moods 
    ? Math.max(...snapshot.moods.map((m: MoodSnapshot) => m.count), 1)
    : 1;

  if (loading) {
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
          Loading snapshot...
        </div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className='min-h-screen'>
        <header className='flex justify-end p-4'>
          <ThemeToggle />
        </header>
        <main className='max-w-3xl mx-auto px-6 py-8'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <p className='text-red-600 dark:text-red-400'>Snapshot not found</p>
            <Link
              to={`/room/${roomId}/snapshots`}
              className='px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
            >
              Back to History
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <header className='flex justify-end p-4'>
        <ThemeToggle />
      </header>
      <main className='max-w-3xl mx-auto px-6 py-8'>
        {/* Back Link */}
        <Link
          to={`/room/${roomId}/snapshots`}
          className='mb-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors inline-flex items-center gap-1'
          aria-label='Back to history'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Back to History
        </Link>

        {/* Snapshot Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-2xl'>📸</span>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {roomName || truncateId(roomId || '')}
            </h1>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Snapshot from {formatDate(snapshot.createdAt)}
          </p>
        </div>

        {/* Mood Snapshot */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                Mood Results
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {snapshot.totalParticipants} {snapshot.totalParticipants === 1 ? 'person' : 'people'} submitted their mood
              </p>
            </div>
            <span className='text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide'>
              Read-only
            </span>
          </div>

          {snapshot.moods && snapshot.moods.length > 0 ? (
            <div className='space-y-4'>
              {snapshot.moods.map((moodData: MoodSnapshot) => {
                const moodInfo = getMoodDisplay(moodData.mood);
                const barWidth = maxCount > 0 ? (moodData.count / maxCount) * 100 : 0;

                return (
                  <div key={moodData.mood}>
                    <div className='flex items-center gap-3 mb-2'>
                      <span className='text-2xl'>{moodInfo?.emoji || '❓'}</span>
                      <span className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                        {moodInfo?.label || moodData.mood}
                      </span>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {moodData.count}
                      </span>
                    </div>
                    <div className='h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-indigo-500 rounded-full transition-all'
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className='text-sm text-gray-500 dark:text-gray-400 text-center py-4'>
              No mood data recorded
            </p>
          )}
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <button
            onClick={handleCreateNewRoom}
            className='px-6 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'
          >
            Create New Room
          </button>
          <Link
            to={`/room/${roomId}`}
            className='px-6 py-2.5 text-base font-medium text-center text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors'
          >
            Back to Room
          </Link>
        </div>
      </main>
    </div>
  );
}
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSnapshots, type SnapshotData } from '../lib/room';
import { getMoodByValue } from '../lib/moods';
import ThemeToggle from '../components/ThemeToggle';

export default function RoomSnapshots() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState<SnapshotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomName] = useState<string | null>(() => {
    if (!roomId) return null;
    const recentRooms = JSON.parse(localStorage.getItem('vibeboard_recent_rooms') || '[]');
    const currentRoom = recentRooms.find((r: { id: string }) => r.id === roomId);
    return currentRoom?.name || null;
  });

  useEffect(() => {
    if (!roomId) return;

    getSnapshots(roomId)
      .then((data) => {
        setSnapshots(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [roomId]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown date';
    
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Today at ${new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)}`;
    }
    
    if (isYesterday) {
      return `Yesterday at ${new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }).format(date)}`;
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
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
          Loading snapshots...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen'>
        <header className='flex justify-end p-4'>
          <ThemeToggle />
        </header>
        <main className='max-w-3xl mx-auto px-6 py-8'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <p className='text-red-600 dark:text-red-400'>Error: {error}</p>
            <button
              onClick={() => navigate(`/room/${roomId}`)}
              className='px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors'
            >
              Back to Room
            </button>
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
          to={`/room/${roomId}`}
          className='mb-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors inline-flex items-center gap-1'
          aria-label='Back to room'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Back to Room
        </Link>

        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-2xl'>📸</span>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {roomName || truncateId(roomId || '')}
            </h1>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Session History
          </p>
        </div>

        {/* Snapshots List */}
        {snapshots.length > 0 ? (
          <div className='space-y-4'>
            {snapshots.map((snapshot) => (
              <Link
                key={snapshot.id}
                to={`/room/${roomId}/snapshots/${snapshot.id}`}
                className='block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group'
                aria-label={`View snapshot from ${formatDate(snapshot.createdAt)}`}
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {formatDate(snapshot.createdAt)}
                    </span>
                  </div>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    {snapshot.totalParticipants} {snapshot.totalParticipants === 1 ? 'person' : 'people'}
                  </span>
                </div>

                {/* Mini Mood Breakdown */}
                <div className='flex items-center gap-3'>
                  {snapshot.moods.slice(0, 5).map((moodData) => {
                    const moodInfo = getMoodDisplay(moodData.mood);
                    return (
                      <div key={moodData.mood} className='flex items-center gap-1'>
                        <span className='text-lg'>{moodInfo?.emoji || '❓'}</span>
                        <span className='text-sm text-gray-600 dark:text-gray-400'>
                          {moodData.count}
                        </span>
                      </div>
                    );
                  })}
                  {snapshot.moods.length > 5 && (
                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                      +{snapshot.moods.length - 5} more
                    </span>
                  )}
                </div>

                {/* Arrow indicator */}
                <div className='flex justify-end mt-2'>
                  <svg className='w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center'>
            <span className='text-4xl mb-4 block'>📷</span>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              No snapshots yet
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              Click "New Session" in the room to save your first snapshot
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
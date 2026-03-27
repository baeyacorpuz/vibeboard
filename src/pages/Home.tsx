import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

interface RecentRoom {
  id: string;
  name: string | null;
  visitedAt: number;
}

// Room ID validation: alphanumeric, hyphens, underscores, max 50 chars
const ROOM_ID_REGEX = /^[a-zA-Z0-9_-]{1,50}$/;

export default function Home() {
  const navigate = useNavigate();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recentRooms] = useState<RecentRoom[]>(() => {
    const stored = JSON.parse(localStorage.getItem('vibeboard_recent_rooms') || '[]');
    return stored.slice(0, 5);
  });

  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID();
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const trimmedId = roomIdInput.trim();
    
    if (!trimmedId) {
      setError('Please enter a room ID');
      return;
    }
    
    if (!ROOM_ID_REGEX.test(trimmedId)) {
      setError('Room ID can only contain letters, numbers, hyphens, and underscores (max 50 characters)');
      return;
    }
    
    navigate(`/room/${trimmedId}`);
  };

  const truncateId = (id: string, maxLength = 20) => {
    if (id.length <= maxLength) return id;
    return id.slice(0, maxLength) + '...';
  };

  const formatVisitedDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return 'Today';
    }
    
    if (isYesterday) {
      return 'Yesterday';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className='min-h-screen'>
      <header className='flex justify-end p-4'>
        <ThemeToggle />
      </header>
      <main className='max-w-3xl mx-auto px-6 py-8'>
        {/* Hero Section */}
        <section className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight'>
            How's your team feeling today?
          </h1>
          <p className='text-base text-gray-600 dark:text-gray-400 mb-6'>
            Fast, anonymous mood check-ins for retros & teams
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
            <button
              onClick={handleCreateRoom}
              className='px-6 py-2.5 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Create Room
            </button>
            <form onSubmit={handleJoinRoom} className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Enter room ID'
                  value={roomIdInput}
                  onChange={(e) => {
                    setRoomIdInput(e.target.value);
                    setError(null);
                  }}
                  className='w-40 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                />
                <button
                  type='submit'
                  className='px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors'
                >
                  Join
                </button>
              </div>
              {error && (
                <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
              )}
            </form>
          </div>
        </section>

        {/* Divider */}
        <div className='border-t border-gray-200 dark:border-gray-700 my-6' />

        {/* Preview */}
        <section className='mb-6'>
          <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center'>
            Live Team Mood
          </h2>

          {/* Mood Emojis */}
          <div className='flex justify-center gap-3 mb-4'>
            <span className='text-2xl'>😊</span>
            <span className='text-2xl'>😐</span>
            <span className='text-2xl'>😓</span>
            <span className='text-2xl'>🔥</span>
            <span className='text-2xl'>💤</span>
          </div>

          {/* Sample Results */}
          <div className='space-y-3'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-lg'>😊</span>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Happy</span>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>2</span>
              </div>
              <div className='h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-indigo-500 rounded-full'
                  style={{ width: '40%' }}
                />
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-lg'>🔥</span>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Productive</span>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>2</span>
              </div>
              <div className='h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-indigo-500 rounded-full'
                  style={{ width: '40%' }}
                />
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <span className='text-lg'>😐</span>
                <span className='text-sm text-gray-600 dark:text-gray-400'>Neutral</span>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>1</span>
              </div>
              <div className='h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-indigo-500 rounded-full'
                  style={{ width: '20%' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className='border-t border-gray-200 dark:border-gray-700 my-6' />

        {/* Use Cases */}
        <section>
          <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center'>
            Perfect for
          </h2>
          <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
            <div className='flex items-center gap-2'>
              <span>🎯</span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Sprint Retros</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>☀️</span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Daily Check-ins</span>
            </div>
            <div className='flex items-center gap-2'>
              <span>💬</span>
              <span className='text-sm text-gray-600 dark:text-gray-400'>Async Teams</span>
            </div>
          </div>
        </section>

        {/* Recent Rooms Section */}
        {recentRooms.length > 0 && (
          <section className='mt-8'>
            <div className='border-t border-gray-200 dark:border-gray-700 my-6' />
            <h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center'>
              Recent Rooms
            </h2>
            <div className='space-y-2'>
              {recentRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => navigate(`/room/${room.id}`)}
                  className='w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-lg'>🚪</span>
                    <div className='text-left'>
                      <p className='text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'>
                        {room.name || truncateId(room.id)}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
                        {truncateId(room.id, 15)}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs text-gray-400 dark:text-gray-500'>
                      {formatVisitedDate(room.visitedAt)}
                    </span>
                    <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
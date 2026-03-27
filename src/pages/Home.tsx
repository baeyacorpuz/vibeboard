import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const navigate = useNavigate();
  const [roomIdInput, setRoomIdInput] = useState('');

  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID();
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      navigate(`/room/${roomIdInput.trim()}`);
    }
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
            <form onSubmit={handleJoinRoom} className='flex gap-2'>
              <input
                type='text'
                placeholder='Enter room ID'
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className='w-40 px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
              <button
                type='submit'
                className='px-4 py-2.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors'
              >
                Join
              </button>
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
      </main>
    </div>
  );
}

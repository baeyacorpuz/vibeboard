import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  joinRoom,
  submitMood,
  subscribeToMoods,
  updateRoomName,
  createSnapshot,
  getUserMood,
  type Mood,
  type MoodData,
  type RoomData,
} from '../lib/room';
import { getMoodByValue } from '../lib/moods';
import MoodSelector from '../components/MoodSelector';
import MoodBoard from '../components/MoodBoard';
import Timer from '../components/Timer';
import ThemeToggle from '../components/ThemeToggle';

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
  const [room, setRoom] = useState<RoomData | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [showSnapshotConfirm, setShowSnapshotConfirm] = useState(false);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      .then(async (roomData) => {
        setStatus('joined');
        setRoom(roomData);
        setEditedName(roomData.name || '');
        
        // Restore user's mood from previous session
        const savedMood = await getUserMood(roomId);
        if (savedMood) {
          setSelectedMood(savedMood);
        }

        // Track room in localStorage for recent rooms
        const recentRooms = JSON.parse(localStorage.getItem('vibeboard_recent_rooms') || '[]');
        const roomEntry = { id: roomId, name: roomData.name, visitedAt: Date.now() };
        const filtered = recentRooms.filter((r: { id: string }) => r.id !== roomId);
        filtered.unshift(roomEntry);
        localStorage.setItem('vibeboard_recent_rooms', JSON.stringify(filtered.slice(0, 10)));
      })
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
    return getMoodByValue(mood);
  };

  const moodDisplay = getMoodDisplay(selectedMood);

  const handleStartEditName = () => {
    setEditedName(room?.name || '');
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setEditedName(room?.name || '');
  };

  const handleSaveName = async () => {
    if (!roomId || !editedName.trim()) return;
    
    setIsSavingName(true);
    try {
      await updateRoomName(roomId, editedName.trim());
      setRoom((prev) => prev ? { ...prev, name: editedName.trim().slice(0, 50) } : null);
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update room name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCreateSnapshot = async () => {
    if (!roomId) return;
    
    setIsCreatingSnapshot(true);
    try {
      await createSnapshot(roomId);
      setShowSnapshotConfirm(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (err) {
      console.error('Failed to create snapshot:', err);
      setIsCreatingSnapshot(false);
    }
  };

  const truncateId = (id: string, maxLength = 20) => {
    if (id.length <= maxLength) return id;
    return id.slice(0, maxLength) + '...';
  };

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
          <div className='flex items-center gap-2'>
            {isEditingName ? (
              <div className='flex items-center gap-2'>
                <input
                  type='text'
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value.slice(0, 50))}
                  maxLength={50}
                  className='px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  aria-label='Room name'
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName || !editedName.trim()}
                  className='px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors'
                  aria-label='Save room name'
                >
                  {isSavingName ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEditName}
                  className='px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'
                  aria-label='Cancel editing'
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <h1 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                  {room?.name || truncateId(roomId || '')}
                </h1>
                <button
                  onClick={handleStartEditName}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                  aria-label='Edit room name'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className='flex items-center gap-3'>
            <Link
              to={`/room/${roomId}/snapshots`}
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
              aria-label='View snapshot history'
            >
              View History
            </Link>
            <button
              onClick={handleCopyLink}
              className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
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

        {/* Success Message */}
        {showSuccessMessage && (
          <div className='mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
            <p className='text-sm text-green-700 dark:text-green-400 text-center'>
              Snapshot saved! The room is now fresh for a new session.
            </p>
          </div>
        )}

        {/* New Session Button - only show if there are moods */}
        {moods.length > 0 && (
          <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <button
              onClick={() => setShowSnapshotConfirm(true)}
              className='px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors'
              aria-label='Start new session'
            >
              New Session
            </button>
          </div>
        )}

        {/* New Session Confirmation Dialog */}
        {showSnapshotConfirm && (
          <div 
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
            onClick={() => !isCreatingSnapshot && setShowSnapshotConfirm(false)}
            role='dialog'
            aria-modal='true'
            aria-labelledby='snapshot-dialog-title'
          >
            <div 
              className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 shadow-xl'
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id='snapshot-dialog-title' className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
                Start a new session?
              </h2>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
                This will save a snapshot of all current moods and clear them. You can view past snapshots in the History.
              </p>
              <div className='flex gap-3 justify-end'>
                <button
                  onClick={() => setShowSnapshotConfirm(false)}
                  disabled={isCreatingSnapshot}
                  className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSnapshot}
                  disabled={isCreatingSnapshot}
                  className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors'
                >
                  {isCreatingSnapshot ? 'Saving...' : 'Save & Clear'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
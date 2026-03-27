import { useState, useEffect, useCallback, useRef } from 'react'

interface TimerProps {
  initialMinutes?: number
  onExpire?: () => void
}

export default function Timer({
  initialMinutes = 5,
  onExpire,
}: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [inputMinutes, setInputMinutes] = useState(initialMinutes)
  const intervalRef = useRef<number | null>(null)

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const isLowTime = totalSeconds <= 60 && totalSeconds > 0

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleExpire = useCallback(() => {
    setIsExpired(true)
    setIsRunning(false)
    clearTimerInterval()
    onExpire?.()
  }, [clearTimerInterval, onExpire])

  useEffect(() => {
    if (isRunning && !isExpired) {
      intervalRef.current = window.setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            handleExpire()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return clearTimerInterval
  }, [isRunning, isExpired, handleExpire, clearTimerInterval])

  const handleStart = () => {
    if (isExpired) {
      setTotalSeconds(inputMinutes * 60)
      setIsExpired(false)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
    clearTimerInterval()
  }

  const handleReset = () => {
    setIsRunning(false)
    clearTimerInterval()
    setTotalSeconds(inputMinutes * 60)
    setIsExpired(false)
  }

  const handleInputChange = (value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setInputMinutes(num)
      if (!isRunning && !isExpired) {
        setTotalSeconds(num * 60)
      }
    } else if (value === '') {
      setInputMinutes(0)
      if (!isRunning && !isExpired) {
        setTotalSeconds(0)
      }
    }
  }

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className='mb-8'>
      <div className='flex items-center gap-4 flex-wrap'>
        <div className='flex items-center gap-2'>
          <span className='text-lg'>⏱</span>
          <span className='text-sm text-gray-600 dark:text-gray-400'>Timer:</span>
        </div>

        <input
          type='number'
          min='0'
          value={inputMinutes}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={isRunning}
          className='w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700'
        />
        <span className='text-sm text-gray-600 dark:text-gray-400'>minutes</span>

        <div className='flex items-center gap-2'>
          <button
            onClick={handleStart}
            disabled={isRunning}
            className='px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Start
          </button>
          <button
            onClick={handlePause}
            disabled={!isRunning}
            className='px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Pause
          </button>
          <button
            onClick={handleReset}
            className='px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
          >
            Reset
          </button>
        </div>
      </div>

      {/* Timer Display */}
      <div className='mt-4'>
        <div
          className={`text-4xl font-mono font-bold ${
            isExpired
              ? 'text-red-600 dark:text-red-400'
              : isLowTime
                ? 'text-red-500 animate-pulse'
                : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {isExpired ? "Time's up!" : formatTime(minutes, seconds)}
        </div>
      </div>
    </div>
  )
}
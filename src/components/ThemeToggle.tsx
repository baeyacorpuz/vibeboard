import { useTheme } from '../lib/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

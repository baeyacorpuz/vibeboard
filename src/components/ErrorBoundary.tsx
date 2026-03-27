import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className='min-h-screen flex flex-col items-center justify-center p-8'>
          <div className='text-center max-w-md'>
            <h2 className='text-xl font-bold text-red-600 dark:text-red-400 mb-4'>
              Something went wrong
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleReset}
              className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && this.state.error && (
              <pre className='mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left text-sm overflow-auto max-h-48'>
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

// Last line of defence: any uncaught render error shows a friendly page
// instead of React unmounting everything into a blank screen.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center font-sans text-ink antialiased">
        <img
          src="/workwithpigeon_logo.png"
          alt=""
          className="h-14 w-14 [image-rendering:pixelated]"
        />
        <h1 className="font-display text-xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-charcoal/60">
          The pigeon flew into a window. Reload the page and it'll shake it off.
        </p>
        <a
          href="/"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-85"
        >
          Reload
        </a>
      </div>
    )
  }
}

export default ErrorBoundary

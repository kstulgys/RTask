import * as React from 'react'

declare global {
  interface Window {
    Bugsnag: any
    render: any
  }
}

type State = {
  hasError: boolean
  error: any
  errorInfo: any
}
export class ErrorBoundary extends React.Component<{ render: any }, State> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true, error, errorInfo })

    // if we have Bugsnag in this environment, we can notify our error tracker
    if (window.Bugsnag) {
      window.Bugsnag.notify(error)
    }
  }

  render() {
    if (this.state.hasError) return this.props.render(this.state.error, this.state.errorInfo)
    return this.props.children
  }
}

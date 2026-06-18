import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-10 text-center text-text-2">
          <h2 className="text-text">Something went wrong</h2>
          <p className="mt-2">{this.state.error.message}</p>
          <button
            className="mt-4 py-2 px-4 rounded-md border border-border-strong bg-surface"
            onClick={() => this.setState({ error: null })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

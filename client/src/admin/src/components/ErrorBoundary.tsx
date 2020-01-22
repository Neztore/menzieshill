import React from "react";
import Notification from '../../bulma/notification'
interface ErrorBoundaryState {
    hasError: boolean,
    errorText?: string
}

export default class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // You can also log the error to an error reporting service
        console.error(error);
        console.error(errorInfo)
        this.setState({errorText: error.message})
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <Notification>
                <h2 className="is-size-2">Oops! Something went wrong.</h2>
                <code>{this.state.errorText}</code>
            </Notification>
        }

        return this.props.children;
    }
}
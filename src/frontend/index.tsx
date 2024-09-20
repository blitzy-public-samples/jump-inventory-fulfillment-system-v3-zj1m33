import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import App from 'src/frontend/App';
import { store } from 'src/frontend/store/store';
import { theme } from 'src/frontend/styles/theme';

// Create a root element in the DOM if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) {
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

// Use ReactDOM.createRoot to create a root
const root = ReactDOM.createRoot(rootElement || document.getElementById('root')!);

// Render the App component wrapped with necessary providers
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// TODO: Implement error boundary at the root level for global error handling
// TODO: Add performance monitoring and logging for the application initialization
// TODO: Implement service worker registration for offline capabilities if required
// TODO: Set up environment-specific configurations (development, production, etc.)
// TODO: Implement code splitting and lazy loading for optimal performance
// TODO: Ensure proper handling of browser compatibility issues
// TODO: Add necessary polyfills for older browser support if required
// TODO: Implement proper cleanup on application unmount if necessary
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Root element found, mounting React app');
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
});

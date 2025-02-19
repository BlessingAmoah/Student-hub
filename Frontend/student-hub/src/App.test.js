import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeContext';
import  { SSEProvider } from '../components/SSEContext';
import { ErrorProvider } from '../components/ErrorContext';
import '@testing-library/jest-dom/extend-expect';


// Mock sessionStorage
beforeEach(() => {
  sessionStorage.setItem ('userId', 'testUserId');
});

// Mock EventSource
beforeEach(() => {
  global.EventSource = jest.fn().mockImplementation(() => ({
    onmessage: jest.fn(),
    onerror: jest.fn(),
    close: jest.fn(),
  }));
});

test('renders the app without crashing', () => {
  render(
    <MemoryRouter>
      <ThemeProvider>
        <ErrorProvider>
          <SSEProvider>
            <App />
          </SSEProvider>
        </ErrorProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
  // Check if a common element is present in the document 
  expect(screen.getByText(/Welcome to Student Hub/i)).toBeInTheDocument();
});

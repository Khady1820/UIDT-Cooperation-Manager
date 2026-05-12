import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </MemoryRouter>
    );
    // Basic check to see if something is rendered
    expect(document.body).toBeDefined();
  });
});

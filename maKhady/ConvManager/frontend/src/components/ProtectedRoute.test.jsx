import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

// Mock du context Auth
const mockUseAuth = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe('ProtectedRoute Component', () => {
  it('affiche le spinner pendant le chargement', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenu Protégé</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(screen.getByText(/Chargement de CoopManager/i)).toBeDefined();
  });

  it('redirige vers /login si l\'utilisateur n\'est pas connecté', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Page Login</div>} />
          <Route path="/protected" element={
            <ProtectedRoute>
              <div>Contenu Protégé</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Page Login')).toBeDefined();
    expect(screen.queryByText('Contenu Protégé')).toBeNull();
  });

  it('affiche le contenu si l\'utilisateur est connecté', () => {
    mockUseAuth.mockReturnValue({ user: { name: 'Test User' }, loading: false });
    
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenu Protégé</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Contenu Protégé')).toBeDefined();
  });
});

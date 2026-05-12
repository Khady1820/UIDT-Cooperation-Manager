import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StatusBadge from './StatusBadge';
import { LanguageProvider } from '../context/LanguageContext';

// Mock du context de langue car StatusBadge l'utilise
vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key) => key, // Mock simple de la fonction de traduction
  }),
  LanguageProvider: ({ children }) => <div>{children}</div>,
}));

describe('StatusBadge Component', () => {
  it('affiche le label correct pour le statut "termine"', () => {
    render(<StatusBadge status="termine" />);
    expect(screen.getByText('Signé & Archivé')).toBeDefined();
  });

  it('affiche le label correct pour le statut "brouillon"', () => {
    render(<StatusBadge status="brouillon" />);
    expect(screen.getByText('Brouillon')).toBeDefined();
  });

  it('affiche le label correct pour le statut "rejete"', () => {
    render(<StatusBadge status="rejete" />);
    expect(screen.getByText('Rejeté / Action Requise')).toBeDefined();
  });

  it('utilise le style par défaut si le statut est inconnu', () => {
    render(<StatusBadge status="inconnu" />);
    expect(screen.getByText('Brouillon')).toBeDefined();
  });
});

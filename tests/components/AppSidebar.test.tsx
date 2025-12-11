import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppSidebar } from '../../client/src/components/AppSidebar';

// Mock wouter
vi.mock('wouter', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useLocation: () => ['/', vi.fn()],
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('AppSidebar', () => {
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup localStorage mock with user data
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') {
        return JSON.stringify(mockUser);
      }
      return null;
    });
  });

  it('renders sidebar with main navigation items', () => {
    render(<AppSidebar />);
    
    expect(screen.getByText('Panel Principal')).toBeInTheDocument();
    expect(screen.getByText('Agregar Registro')).toBeInTheDocument();
    expect(screen.getByText('Gamificación')).toBeInTheDocument();
    expect(screen.getByText('Alertas')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Modo Flota')).toBeInTheDocument();
  });

  it('renders secondary navigation items', () => {
    render(<AppSidebar />);
    
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Ayuda')).toBeInTheDocument();
  });

  it('displays user information when logged in', () => {
    render(<AppSidebar />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('displays user avatar with initials', () => {
    render(<AppSidebar />);
    
    // Should show user initials in avatar
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders logout button when user is logged in', () => {
    render(<AppSidebar />);
    
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('handles logout functionality', () => {
    render(<AppSidebar />);
    
    const logoutButton = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    // Should clear localStorage
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('renders register button when no user is logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<AppSidebar />);
    
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('does not show user info when not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    render(<AppSidebar />);
    
    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
  });

  it('renders correct navigation links', () => {
    render(<AppSidebar />);
    
    const dashboardLink = screen.getByText('Panel Principal').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/');
    
    const registerLink = screen.getByText('Agregar Registro').closest('a');
    expect(registerLink).toHaveAttribute('href', '/register');
    
    const gamificationLink = screen.getByText('Gamificación').closest('a');
    expect(gamificationLink).toHaveAttribute('href', '/gamification');
    
    const alertsLink = screen.getByText('Alertas').closest('a');
    expect(alertsLink).toHaveAttribute('href', '/alerts');
    
    const marketplaceLink = screen.getByText('Marketplace').closest('a');
    expect(marketplaceLink).toHaveAttribute('href', '/marketplace');
    
    const fleetLink = screen.getByText('Modo Flota').closest('a');
    expect(fleetLink).toHaveAttribute('href', '/fleet');
    
    const settingsLink = screen.getByText('Configuración').closest('a');
    expect(settingsLink).toHaveAttribute('href', '/settings');
    
    const helpLink = screen.getByText('Ayuda').closest('a');
    expect(helpLink).toHaveAttribute('href', '/help');
  });

  it('handles navigation item clicks', () => {
    render(<AppSidebar />);
    
    const dashboardLink = screen.getByText('Panel Principal');
    fireEvent.click(dashboardLink);
    
    // Navigation should work (handled by wouter)
    expect(dashboardLink).toBeInTheDocument();
  });

  it('displays correct icons for navigation items', () => {
    render(<AppSidebar />);
    
    // Check that navigation items have icons
    // This is implementation-dependent based on how Lucide icons are rendered
    const menuItems = screen.getAllByRole('link');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('handles user data updates', () => {
    const { rerender } = render(<AppSidebar />);
    
    // Initially shows user
    expect(screen.getByText('testuser')).toBeInTheDocument();
    
    // Update localStorage to remove user
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Rerender component
    rerender(<AppSidebar />);
    
    // Should now show register button instead
    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
  });

  it('handles malformed user data in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    
    render(<AppSidebar />);
    
    // Should handle gracefully and show register button
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });

  it('displays sidebar groups correctly', () => {
    render(<AppSidebar />);
    
    // Check that sidebar groups are rendered
    expect(screen.getByText('Navegación')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
  });

  it('maintains proper sidebar structure', () => {
    render(<AppSidebar />);
    
    // Check that sidebar has proper structure
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
  });

  it('handles user with different username formats', () => {
    const userWithLongName = {
      id: 'user456',
      username: 'very-long-username-test',
      email: 'long@example.com',
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userWithLongName));
    
    render(<AppSidebar />);
    
    expect(screen.getByText('very-long-username-test')).toBeInTheDocument();
    // Avatar should show first letter
    expect(screen.getByText('V')).toBeInTheDocument();
  });

  it('handles empty username gracefully', () => {
    const userWithEmptyName = {
      id: 'user789',
      username: '',
      email: 'empty@example.com',
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userWithEmptyName));
    
    render(<AppSidebar />);
    
    // Should handle empty username gracefully
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });
});
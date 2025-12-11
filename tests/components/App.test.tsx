import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../../client/src/App';

// Mock wouter
vi.mock('wouter', () => ({
  Switch: ({ children }: { children: React.ReactNode }) => <div data-testid="switch">{children}</div>,
  Route: ({ component: Component }: { component: React.ComponentType }) => <Component />,
}));

// Mock all page components
vi.mock('@/pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>
}));

vi.mock('@/pages/not-found', () => ({
  default: () => <div data-testid="not-found-page">Not Found</div>
}));

vi.mock('@/pages/Register', () => ({
  default: () => <div data-testid="register-page">Register</div>
}));

vi.mock('@/pages/Login', () => ({
  default: () => <div data-testid="login-page">Login</div>
}));

vi.mock('@/pages/UserRegistration', () => ({
  default: () => <div data-testid="user-registration-page">User Registration</div>
}));

vi.mock('@/pages/Settings', () => ({
  default: () => <div data-testid="settings-page">Settings</div>
}));

vi.mock('@/pages/Gamification', () => ({
  default: () => <div data-testid="gamification-page">Gamification</div>
}));

vi.mock('@/pages/Alerts', () => ({
  default: () => <div data-testid="alerts-page">Alerts</div>
}));

vi.mock('@/pages/Marketplace', () => ({
  default: () => <div data-testid="marketplace-page">Marketplace</div>
}));

vi.mock('@/pages/FleetMode', () => ({
  default: () => <div data-testid="fleet-mode-page">Fleet Mode</div>
}));

// Mock components
vi.mock('@/components/AppSidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">Sidebar</div>
}));

vi.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme Toggle</button>
}));

vi.mock('@/components/Chatbot', () => ({
  Chatbot: () => <div data-testid="chatbot">Chatbot</div>
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('switch')).toBeInTheDocument();
  });

  it('renders sidebar trigger button', () => {
    render(<App />);
    expect(screen.getByTestId('button-sidebar-toggle')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    render(<App />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders sidebar', () => {
    render(<App />);
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
  });

  it('renders chatbot', () => {
    render(<App />);
    expect(screen.getByTestId('chatbot')).toBeInTheDocument();
  });

  it('has proper CSS custom properties for sidebar', () => {
    render(<App />);
    const sidebarProvider = document.querySelector('[style*="--sidebar-width"]');
    expect(sidebarProvider).toBeInTheDocument();
  });
});
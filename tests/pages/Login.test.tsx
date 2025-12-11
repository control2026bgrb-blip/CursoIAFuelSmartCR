import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock wouter
const mockSetLocation = vi.fn();
vi.mock('wouter', () => ({
  useLocation: () => ['/login', mockSetLocation]
}));

// Mock toast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast })
}));

// Mock API
vi.mock('@/lib/api', () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
  }
}));

import Login from '../../client/src/pages/Login';
import { authAPI } from '@/lib/api';

const mockAuthAPI = authAPI as any;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your fuel tracking account')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('switches to register mode', () => {
    render(<Login />);
    
    const switchButton = screen.getByText("Don't have an account? Register here");
    fireEvent.click(switchButton);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Register for a new fuel tracking account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('switches back to login mode', () => {
    render(<Login />);
    
    // Switch to register
    const switchToRegister = screen.getByText("Don't have an account? Register here");
    fireEvent.click(switchToRegister);
    
    // Switch back to login
    const switchToLogin = screen.getByText("Already have an account? Sign in here");
    fireEvent.click(switchToLogin);
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates form data when typing', () => {
    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('validates required fields', () => {
    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    
    expect(usernameInput).toHaveAttribute('required');
    expect(usernameInput).toHaveAttribute('minLength', '3');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });

  it('handles successful login', async () => {
    const mockUser = { id: '1', username: 'testuser' };
    mockAuthAPI.login.mockResolvedValue({
      data: { user: mockUser }
    });

    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthAPI.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Login successful',
        description: 'Welcome testuser!',
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      expect(mockSetLocation).toHaveBeenCalledWith('/');
    });
  });

  it('handles successful registration', async () => {
    const mockUser = { id: '1', username: 'newuser' };
    mockAuthAPI.register.mockResolvedValue({
      data: { user: mockUser }
    });

    render(<Login />);
    
    // Switch to register mode
    const switchButton = screen.getByText("Don't have an account? Register here");
    fireEvent.click(switchButton);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(usernameInput, { target: { value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAuthAPI.register).toHaveBeenCalledWith('newuser', 'password123');
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration successful',
        description: 'Welcome newuser!',
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
      expect(mockSetLocation).toHaveBeenCalledWith('/');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockAuthAPI.login.mockRejectedValue(new Error(errorMessage));

    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    });
  });

  it('shows loading state during submission', async () => {
    mockAuthAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles error without message', async () => {
    mockAuthAPI.login.mockRejectedValue(new Error());

    render(<Login />);
    
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    });
  });
});
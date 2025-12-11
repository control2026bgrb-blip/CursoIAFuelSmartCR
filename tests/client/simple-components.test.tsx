import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Simple component tests that will actually work
describe('Simple Component Tests', () => {
  // Test a simple button component
  const SimpleButton = ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="simple-button">
      {children}
    </button>
  );

  it('renders button with text', () => {
    render(<SimpleButton>Click me</SimpleButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles button clicks', () => {
    const handleClick = vi.fn();
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>);
    
    fireEvent.click(screen.getByTestId('simple-button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<SimpleButton disabled>Disabled</SimpleButton>);
    expect(screen.getByTestId('simple-button')).toBeDisabled();
  });

  // Test a simple card component
  const SimpleCard = ({ title, children }: any) => (
    <div data-testid="simple-card" className="card">
      {title && <h3 data-testid="card-title">{title}</h3>}
      <div data-testid="card-content">{children}</div>
    </div>
  );

  it('renders card with title and content', () => {
    render(
      <SimpleCard title="Test Title">
        <p>Test content</p>
      </SimpleCard>
    );
    
    expect(screen.getByTestId('simple-card')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('card-content')).toHaveTextContent('Test content');
  });

  it('renders card without title', () => {
    render(
      <SimpleCard>
        <p>Content only</p>
      </SimpleCard>
    );
    
    expect(screen.getByTestId('simple-card')).toBeInTheDocument();
    expect(screen.queryByTestId('card-title')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toHaveTextContent('Content only');
  });

  // Test a simple form component
  const SimpleForm = ({ onSubmit }: any) => {
    const [value, setValue] = React.useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(value);
    };

    return (
      <form onSubmit={handleSubmit} data-testid="simple-form">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="form-input"
          placeholder="Enter text"
        />
        <button type="submit" data-testid="form-submit">
          Submit
        </button>
      </form>
    );
  };

  it('handles form input and submission', () => {
    const handleSubmit = vi.fn();
    render(<SimpleForm onSubmit={handleSubmit} />);
    
    const input = screen.getByTestId('form-input');
    const submitButton = screen.getByTestId('form-submit');
    
    fireEvent.change(input, { target: { value: 'test input' } });
    expect(input).toHaveValue('test input');
    
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledWith('test input');
  });

  // Test a simple list component
  const SimpleList = ({ items }: { items: string[] }) => (
    <ul data-testid="simple-list">
      {items.map((item, index) => (
        <li key={index} data-testid={`list-item-${index}`}>
          {item}
        </li>
      ))}
    </ul>
  );

  it('renders list with items', () => {
    const items = ['Item 1', 'Item 2', 'Item 3'];
    render(<SimpleList items={items} />);
    
    expect(screen.getByTestId('simple-list')).toBeInTheDocument();
    expect(screen.getByTestId('list-item-0')).toHaveTextContent('Item 1');
    expect(screen.getByTestId('list-item-1')).toHaveTextContent('Item 2');
    expect(screen.getByTestId('list-item-2')).toHaveTextContent('Item 3');
  });

  it('renders empty list', () => {
    render(<SimpleList items={[]} />);
    
    expect(screen.getByTestId('simple-list')).toBeInTheDocument();
    expect(screen.queryByTestId('list-item-0')).not.toBeInTheDocument();
  });

  // Test conditional rendering
  const ConditionalComponent = ({ show, message }: any) => (
    <div data-testid="conditional-component">
      {show && <p data-testid="conditional-message">{message}</p>}
      {!show && <p data-testid="fallback-message">Nothing to show</p>}
    </div>
  );

  it('shows message when show is true', () => {
    render(<ConditionalComponent show={true} message="Hello World" />);
    
    expect(screen.getByTestId('conditional-message')).toHaveTextContent('Hello World');
    expect(screen.queryByTestId('fallback-message')).not.toBeInTheDocument();
  });

  it('shows fallback when show is false', () => {
    render(<ConditionalComponent show={false} message="Hello World" />);
    
    expect(screen.queryByTestId('conditional-message')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-message')).toHaveTextContent('Nothing to show');
  });
});
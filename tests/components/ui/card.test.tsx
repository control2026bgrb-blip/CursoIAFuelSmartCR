import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<Card className="custom-card">Content</Card>);
      
      const card = screen.getByText('Content');
      expect(card).toHaveClass('shadcn-card');
      expect(card).toHaveClass('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('renders header with children', () => {
      render(<CardHeader>Header content</CardHeader>);
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies header class', () => {
      render(<CardHeader>Header</CardHeader>);
      
      const header = screen.getByText('Header');
      expect(header).toHaveClass('flex', 'flex-col');
    });
  });

  describe('CardTitle', () => {
    it('renders title as div', () => {
      render(<CardTitle>Card Title</CardTitle>);
      
      const title = screen.getByText('Card Title');
      expect(title.tagName).toBe('DIV');
    });
  });

  describe('CardDescription', () => {
    it('renders description as div', () => {
      render(<CardDescription>Card description</CardDescription>);
      
      const description = screen.getByText('Card description');
      expect(description.tagName).toBe('DIV');
    });
  });

  describe('CardContent', () => {
    it('renders content with children', () => {
      render(<CardContent>Main content</CardContent>);
      
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('applies content class', () => {
      render(<CardContent>Content</CardContent>);
      
      const content = screen.getByText('Content');
      expect(content).toHaveClass('p-6');
    });
  });

  describe('CardFooter', () => {
    it('renders footer with children', () => {
      render(<CardFooter>Footer content</CardFooter>);
      
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('applies footer class', () => {
      render(<CardFooter>Footer</CardFooter>);
      
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('flex', 'items-center');
    });
  });

  describe('Complete Card', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content here</p>
          </CardContent>
          <CardFooter>
            <button>Action</button>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
  });
});
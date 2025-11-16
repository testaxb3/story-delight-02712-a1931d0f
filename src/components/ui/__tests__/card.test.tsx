import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with children', () => {
      const { container } = render(<Card>Card content</Card>);
      expect(container.textContent).toContain('Card content');
    });

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Content</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('custom-card');
    });
  });

  describe('CardHeader', () => {
    it('should render header content', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.textContent).toContain('Header');
    });
  });

  describe('CardTitle', () => {
    it('should render as h3 by default', () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      const h3 = container.querySelector('h3');
      expect(h3).toBeTruthy();
      expect(h3?.textContent).toBe('Title');
    });
  });

  describe('CardDescription', () => {
    it('should render description', () => {
      const { container } = render(<CardDescription>Description text</CardDescription>);
      const p = container.querySelector('p');
      expect(p).toBeTruthy();
      expect(p?.textContent).toBe('Description text');
    });
  });

  describe('CardContent', () => {
    it('should render content', () => {
      const { container } = render(<CardContent>Main content</CardContent>);
      expect(container.textContent).toContain('Main content');
    });
  });

  describe('CardFooter', () => {
    it('should render footer', () => {
      const { container } = render(<CardFooter>Footer content</CardFooter>);
      expect(container.textContent).toContain('Footer content');
    });
  });

  describe('Full Card Structure', () => {
    it('should render complete card with all sections', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
          <CardContent>Card body</CardContent>
          <CardFooter>Card footer</CardFooter>
        </Card>
      );

      expect(container.textContent).toContain('Test Card');
      expect(container.textContent).toContain('Test description');
      expect(container.textContent).toContain('Card body');
      expect(container.textContent).toContain('Card footer');
    });
  });
});

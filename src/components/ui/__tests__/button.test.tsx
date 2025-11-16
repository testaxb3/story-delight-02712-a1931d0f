import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render with default variant', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('Click me');
  });

  it('should render with destructive variant', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('destructive');
  });

  it('should render with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('outline');
  });

  it('should render with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('ghost');
  });

  it('should render different sizes', () => {
    const { container: small } = render(<Button size="sm">Small</Button>);
    expect(small.querySelector('button')?.className).toContain('h-9');

    const { container: large } = render(<Button size="lg">Large</Button>);
    expect(large.querySelector('button')?.className).toContain('h-11');
  });

  it('should handle disabled state', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('custom-class');
  });

  it('should render as child component', () => {
    const { container } = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.href).toContain('/test');
  });
});

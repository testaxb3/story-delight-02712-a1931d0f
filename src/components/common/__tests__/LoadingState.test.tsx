import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('should render with default props', () => {
    const { container } = render(<LoadingState />);
    
    expect(container.textContent).toContain('Loading...');
  });

  it('should render with custom message', () => {
    const { container } = render(<LoadingState message="Loading scripts..." />);
    
    expect(container.textContent).toContain('Loading scripts...');
  });

  it('should render small size', () => {
    const { container } = render(<LoadingState size="sm" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('should render medium size by default', () => {
    const { container } = render(<LoadingState />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('should render large size', () => {
    const { container } = render(<LoadingState size="lg" />);
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should not render message when not provided', () => {
    const { container } = render(<LoadingState message="" />);
    
    expect(container.textContent).not.toContain('Loading...');
  });
});

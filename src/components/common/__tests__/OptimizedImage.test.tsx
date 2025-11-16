import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { OptimizedImage } from '../OptimizedImage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver as any;

describe('OptimizedImage', () => {
  it('should render with alt text', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test Image" />);
    
    const img = container.querySelector('img[alt="Test Image"]');
    expect(img).toBeTruthy();
  });

  it('should show placeholder initially', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" />);
    
    const placeholder = container.querySelector('.animate-pulse');
    expect(placeholder).toBeTruthy();
  });

  it('should load image eagerly when eager prop is true', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" eager />);
    
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img?.loading).toBe('eager');
  });

  it('should lazy load by default', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" />);
    
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img?.loading).toBe('lazy');
  });

  it('should apply custom className', () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" className="custom-img" />);
    
    const img = container.querySelector('img');
    expect(img?.className).toContain('custom-img');
  });

  it('should handle onLoad event', async () => {
    const { container } = render(<OptimizedImage src="/test.jpg" alt="Test" />);
    
    const img = container.querySelector('img') as HTMLImageElement;
    
    // Simulate image load
    if (img.onload) {
      img.onload(new Event('load') as any);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(img).toHaveClass('opacity-100');
  });

  it('should apply placeholder className', () => {
    const { container } = render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test" 
        placeholderClassName="custom-placeholder" 
      />
    );
    
    const placeholder = container.querySelector('.custom-placeholder');
    expect(placeholder).toBeTruthy();
  });
});

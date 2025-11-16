import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Mock useAuth
const mockUseAuth = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  };
});

describe('ProtectedRoute', () => {
  it('should show loading state while checking auth', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(container.textContent).toContain('🧠');
  });

  it('should redirect to auth when no user', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    const { getByTestId } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByTestId('navigate')).toHaveTextContent('/auth');
  });

  it('should redirect to quiz when quiz not completed', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', quiz_completed: false },
      loading: false,
    });

    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByTestId('navigate')).toHaveTextContent('/quiz');
  });

  it('should allow access when authenticated and quiz completed', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', quiz_completed: true },
      loading: false,
    });

    const { getByText } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should allow access to quiz route without quiz completed', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', quiz_completed: false },
      loading: false,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/quiz']}>
        <ProtectedRoute>
          <div>Quiz Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByText('Quiz Content')).toBeInTheDocument();
  });

  it('should allow access to refund routes without quiz completed', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', quiz_completed: false },
      loading: false,
    });

    const { getByText } = render(
      <MemoryRouter initialEntries={['/refund']}>
        <ProtectedRoute>
          <div>Refund Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    
    expect(getByText('Refund Content')).toBeInTheDocument();
  });
});

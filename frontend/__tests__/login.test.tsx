import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/login',
}));

// Mock the API
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    post: jest.fn(() => Promise.resolve({
      data: {
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      }
    })),
  },
}));

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);

    expect(screen.getByText('Portal Access')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('allows user to type email and password', () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/email or username/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows remember me checkbox', () => {
    render(<LoginPage />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
  });

  it('has a forgot password link', () => {
    render(<LoginPage />);

    const forgotPasswordLink = screen.getByText('Forgot password?');
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '#');
  });
});

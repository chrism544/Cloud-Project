import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPage from '@/app/(entra)/entra-admin/users/page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/entra-admin/users',
}));

describe('Users Page', () => {
  it('renders the users page with title', async () => {
    render(<UsersPage />);

    expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument();
  });

  it('displays new user button', () => {
    render(<UsersPage />);

    const newButton = screen.getByRole('button', { name: /new user/i });
    expect(newButton).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<UsersPage />);

    const searchInput = screen.getByPlaceholderText(/search users/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('opens create user modal when new user button is clicked', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    const newButton = screen.getByRole('button', { name: /new user/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create New User')).toBeInTheDocument();
    });
  });

  it('closes create modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    // Open modal
    const newButton = screen.getByRole('button', { name: /new user/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays form fields in create modal', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    const newButton = screen.getByRole('button', { name: /new user/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/office location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobile phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/account enabled/i)).toBeInTheDocument();
    });
  });

  it('allows searching for users', async () => {
    const user = userEvent.setup();
    render(<UsersPage />);

    const searchInput = screen.getByPlaceholderText(/search users/i);
    await user.type(searchInput, 'john');

    expect(searchInput).toHaveValue('john');
  });
});

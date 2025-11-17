import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupsPage from '@/app/(entra)/entra-admin/groups/page';

jest.mock('next/navigation', () => ({
  usePathname: () => '/entra-admin/groups',
}));

describe('Groups Page', () => {
  it('renders the groups page with title', () => {
    render(<GroupsPage />);

    expect(screen.getByRole('heading', { name: /^groups$/i })).toBeInTheDocument();
  });

  it('displays new group button', () => {
    render(<GroupsPage />);

    const newButton = screen.getByRole('button', { name: /new group/i });
    expect(newButton).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<GroupsPage />);

    const searchInput = screen.getByPlaceholderText(/search groups/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('opens create group modal when new group button is clicked', async () => {
    const user = userEvent.setup();
    render(<GroupsPage />);

    const newButton = screen.getByRole('button', { name: /new group/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create New Group')).toBeInTheDocument();
    });
  });

  it('displays group type selector in create modal', async () => {
    const user = userEvent.setup();
    render(<GroupsPage />);

    const newButton = screen.getByRole('button', { name: /new group/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/group type/i)).toBeInTheDocument();
    });
  });

  it('closes create modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<GroupsPage />);

    const newButton = screen.getByRole('button', { name: /new group/i });
    await user.click(newButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

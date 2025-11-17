import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DevicesPage from '@/app/(entra)/entra-admin/devices/page';

jest.mock('next/navigation', () => ({
  usePathname: () => '/entra-admin/devices',
}));

describe('Devices Page', () => {
  it('renders the devices page with title', () => {
    render(<DevicesPage />);

    expect(screen.getByRole('heading', { name: /devices/i })).toBeInTheDocument();
  });

  it('displays register device button', () => {
    render(<DevicesPage />);

    const registerButton = screen.getByRole('button', { name: /register device/i });
    expect(registerButton).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<DevicesPage />);

    const searchInput = screen.getByPlaceholderText(/search devices/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('opens register device modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<DevicesPage />);

    const registerButton = screen.getByRole('button', { name: /register device/i });
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Register New Device')).toBeInTheDocument();
    });
  });

  it('displays device form fields in register modal', async () => {
    const user = userEvent.setup();
    render(<DevicesPage />);

    const registerButton = screen.getByRole('button', { name: /register device/i });
    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/operating system/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/manufacturer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compliant/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/managed/i)).toBeInTheDocument();
    });
  });

  it('closes register modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<DevicesPage />);

    const registerButton = screen.getByRole('button', { name: /register device/i });
    await user.click(registerButton);

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

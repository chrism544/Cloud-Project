import { render, screen } from '@testing-library/react';
import EntraAdminLayout from '@/app/(entra)/entra-admin/layout';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/entra-admin',
}));

describe('EntraLayout', () => {
  it('renders the app bar with title', () => {
    render(
      <EntraAdminLayout>
        <div>Test Content</div>
      </EntraAdminLayout>
    );

    expect(screen.getByText('Microsoft Entra Admin Center')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(
      <EntraAdminLayout>
        <div>Test Content</div>
      </EntraAdminLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <EntraAdminLayout>
        <div>Test Content</div>
      </EntraAdminLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    render(
      <EntraAdminLayout>
        <div>Test Content</div>
      </EntraAdminLayout>
    );

    const usersLink = screen.getByRole('link', { name: /users/i });
    expect(usersLink).toHaveAttribute('href', '/entra-admin/users');

    const groupsLink = screen.getByRole('link', { name: /groups/i });
    expect(groupsLink).toHaveAttribute('href', '/entra-admin/groups');

    const devicesLink = screen.getByRole('link', { name: /devices/i });
    expect(devicesLink).toHaveAttribute('href', '/entra-admin/devices');
  });
});

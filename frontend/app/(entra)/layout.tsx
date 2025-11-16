import { ThemeRegistry } from './ThemeRegistry';
import { MSWProvider } from './MSWProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entra Admin Center',
  description: 'Microsoft Entra admin center prototype',
};

export default function EntraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MSWProvider>
      <ThemeRegistry>{children}</ThemeRegistry>
    </MSWProvider>
  );
}

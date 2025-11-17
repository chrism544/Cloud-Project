'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      import('@/mocks/browser')
        .then(({ worker }) => {
          return worker.start({
            serviceWorker: {
              url: '/mockServiceWorker.js',
            },
            onUnhandledRequest: 'bypass',
          });
        })
        .then(() => {
          console.log('[MSW] Service worker initialized');
          setIsReady(true);
        })
        .catch((error) => {
          console.error('[MSW] Failed to initialize:', error);
          // Still set ready to true so the app loads
          setIsReady(true);
        });
    } else {
      setIsReady(true);
    }
  }, []);

  // In production, skip MSW entirely
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>;
  }

  // Show loading state while MSW initializes
  if (!isReady) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Initializing mock API...</p>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { use, useEffect, useState } from 'react';

// Initialize MSW in development
const mswReadyPromise =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? import('@/mocks/browser').then(({ worker }) => {
        return worker.start({
          onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
        });
      })
    : Promise.resolve();

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    mswReadyPromise.then(() => setIsReady(true));
  }, []);

  // In production or when MSW is ready, render children
  if (process.env.NODE_ENV !== 'development' || isReady) {
    return <>{children}</>;
  }

  // Show loading state while MSW initializes
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Loading...</p>
    </div>
  );
}

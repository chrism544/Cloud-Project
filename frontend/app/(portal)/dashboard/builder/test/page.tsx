'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth';

export default function BuilderTest() {
  const [status, setStatus] = useState('Loading...');
  const portalId = useAuthStore((s) => s.portalId);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('grapesjs').then((grapesjs) => {
        try {
          const editor = grapesjs.default.init({
            container: '#gjs-test',
            height: '300px',
            width: 'auto',
          });
          setStatus('✅ GrapesJS + Portal Integration Ready');
        } catch (err) {
          setStatus('❌ Integration failed');
          console.error('GrapesJS error:', err);
        }
      }).catch(err => {
        setStatus('❌ GrapesJS import failed');
        console.error('Import error:', err);
      });
    }
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Page Builder Integration Test</h2>
      <p className="mb-2">Portal ID: {portalId}</p>
      <p className="mb-4">Status: {status}</p>
      <div id="gjs-test" style={{ border: '1px solid #ccc', minHeight: '300px' }}></div>
    </div>
  );
}
'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface PublicPage {
  id: string;
  name: string;
  slug: string;
  pageHtml: string;
  pageCss: string;
  published: boolean;
}

export default function PublicPageViewer() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<PublicPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        // Get portalId from subdomain or default
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0];
        
        const response = await api.get(`/api/v1/builder/pages/public/${slug}?portalId=${subdomain}`);
        setPage(response.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Page not found');
        } else {
          setError('Failed to load page');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading page...</div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">{error || 'The requested page could not be found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.pageCss || '' }} />
      <div dangerouslySetInnerHTML={{ __html: page.pageHtml || '' }} />
    </>
  );
}
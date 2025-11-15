'use client';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderPage } from '@/lib/hooks/useBuilderPages';
import PageBuilderEditor from '@/components/builder/PageBuilderEditor';

export default function EditBuilderPage() {
  const params = useParams();
  const pageId = params.id as string;
  const portalId = useAuthStore((s) => s.portalId);
  const { data: page, isLoading } = useBuilderPage(pageId);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-red-500">Page not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <PageBuilderEditor pageId={pageId} portalId={portalId || ''} />
    </div>
  );
}
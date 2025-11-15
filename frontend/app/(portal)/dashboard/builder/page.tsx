'use client';
import { useAuthStore } from '@/lib/stores/auth';
import { useBuilderPages } from '@/lib/hooks/useBuilderPages';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import Link from 'next/link';
import { Palette, Plus, Edit, Eye, Trash2 } from 'lucide-react';

export default function BuilderDashboard() {
  const portalId = useAuthStore((s) => s.portalId);
  const { data: pages, isLoading } = useBuilderPages(portalId || '');

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading pages...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Palette className="w-8 h-8 text-indigo-600" />
              Page Builder
            </h1>
            <p className="text-gray-600 mt-2">Create and manage visual pages with drag-and-drop editor</p>
          </div>
          <Link 
            href="/dashboard/builder/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </Link>
        </div>
        
        {!pages || pages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Palette className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first visual page</p>
            <Link 
              href="/dashboard/builder/new"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <div key={page.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{page.name}</h3>
                      <p className="text-gray-600 text-sm">/{page.slug}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      page.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {page.published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    Updated {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/dashboard/builder/${page.id}/edit`}
                      className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    {page.published && (
                      <Link 
                        href={`/${page.slug}`}
                        target="_blank"
                        className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth';
import { useCreateBuilderPage } from '@/lib/hooks/useBuilderPages';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { ArrowLeft, Palette } from 'lucide-react';
import Link from 'next/link';

export default function NewBuilderPage() {
  const router = useRouter();
  const portalId = useAuthStore((s) => s.portalId);
  const createPage = useCreateBuilderPage();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSlugChange = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug: cleanSlug }));
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Page name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Page slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !portalId) return;
    
    try {
      const page = await createPage.mutateAsync({
        portalId,
        name: formData.name.trim(),
        slug: formData.slug.trim()
      });
      
      router.push(`/dashboard/builder/${page.id}/edit`);
    } catch (error: any) {
      if (error.response?.data?.message?.includes('slug')) {
        setErrors({ slug: 'This slug is already taken' });
      } else {
        setErrors({ general: 'Failed to create page. Please try again.' });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/dashboard/builder"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Page Builder
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Palette className="w-8 h-8 text-indigo-600" />
            Create New Page
          </h1>
          <p className="text-gray-600 mt-2">Set up your new visual page and start building</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Page Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., About Us, Contact Page, Landing Page"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Page URL Slug *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-1">/{portalId && 'your-domain.com/'}</span>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.slug ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="about-us"
                />
              </div>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Only lowercase letters, numbers, and hyphens allowed
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={createPage.isPending}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createPage.isPending ? 'Creating...' : 'Create & Start Building'}
              </button>
              
              <Link
                href="/dashboard/builder"
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
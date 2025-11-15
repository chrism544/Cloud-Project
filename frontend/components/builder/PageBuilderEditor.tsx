'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import 'grapesjs/dist/css/grapes.min.css';

interface PageBuilderEditorProps {
  pageId: string;
  portalId: string;
}

export default function PageBuilderEditor({ pageId, portalId }: PageBuilderEditorProps) {
  const [editor, setEditor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      // Wait for DOM elements to be ready
      const checkElements = setInterval(() => {
        const blocksEl = document.getElementById('gjs-blocks');
        const stylesEl = document.getElementById('gjs-styles');
        const layersEl = document.getElementById('gjs-layers');
        const editorEl = document.getElementById('gjs-editor');

        if (blocksEl && stylesEl && layersEl && editorEl) {
          clearInterval(checkElements);

          // Dynamically import GrapesJS to avoid SSR issues
          Promise.all([
            import('grapesjs'),
            import('grapesjs-blocks-basic')
          ]).then(([grapesjs, blocksBasic]) => {
            const editorInstance = grapesjs.default.init({
          container: '#gjs-editor',
          height: '100vh',
          width: 'auto',
          plugins: [blocksBasic.default],
          storageManager: false, // Disable built-in storage, we'll handle it manually
          blockManager: {
            appendTo: '#gjs-blocks',
          },
          styleManager: {
            appendTo: '#gjs-styles',
          },
          layerManager: {
            appendTo: '#gjs-layers',
          },
        });

            // Load existing page data
            api.get(`/api/v1/builder/pages/${pageId}`)
              .then(response => {
                const data = response.data;
                if (data['gjs-html']) {
                  editorInstance.setComponents(data['gjs-html']);
                }
                if (data['gjs-css']) {
                  editorInstance.setStyle(data['gjs-css']);
                }
                setEditorReady(true);
              })
              .catch(error => {
                console.error('Failed to load page data:', error);
                setEditorReady(true);
              });

        // Add custom blocks
        const blockManager = editorInstance.BlockManager;

        // Hero Section Block
        blockManager.add('hero-section', {
          label: 'Hero Section',
          category: 'Sections',
          content: `
            <section style="padding: 80px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <div style="max-width: 800px; margin: 0 auto;">
                <h1 style="font-size: 48px; font-weight: bold; margin-bottom: 20px;">Welcome to Our Website</h1>
                <p style="font-size: 20px; margin-bottom: 30px;">Build amazing pages with our visual editor</p>
                <a href="#" style="display: inline-block; padding: 15px 30px; background: white; color: #667eea; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
              </div>
            </section>
          `,
        });

        // Call-to-Action Block
        blockManager.add('cta-block', {
          label: 'Call to Action',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px; text-align: center; background: #f7fafc;">
              <div style="max-width: 600px; margin: 0 auto;">
                <h2 style="font-size: 36px; font-weight: bold; margin-bottom: 15px; color: #2d3748;">Ready to Get Started?</h2>
                <p style="font-size: 18px; margin-bottom: 25px; color: #4a5568;">Join thousands of satisfied customers today</p>
                <a href="#" style="display: inline-block; padding: 12px 24px; background: #4299e1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign Up Now</a>
              </div>
            </section>
          `,
        });

        // Features Section Block
        blockManager.add('features-3col', {
          label: '3-Column Features',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px;">
              <div style="max-width: 1200px; margin: 0 auto;">
                <h2 style="text-align: center; font-size: 36px; font-weight: bold; margin-bottom: 40px; color: #2d3748;">Our Features</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">🚀</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Fast</h3>
                    <p style="color: #4a5568;">Lightning-fast performance for your users</p>
                  </div>
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Secure</h3>
                    <p style="color: #4a5568;">Enterprise-grade security built-in</p>
                  </div>
                  <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 48px; margin-bottom: 15px;">⚡</div>
                    <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #2d3748;">Easy</h3>
                    <p style="color: #4a5568;">Simple and intuitive to use</p>
                  </div>
                </div>
              </div>
            </section>
          `,
        });

        // Testimonial Block
        blockManager.add('testimonial', {
          label: 'Testimonial',
          category: 'Sections',
          content: `
            <section style="padding: 60px 20px; background: #edf2f7;">
              <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <p style="font-size: 24px; font-style: italic; margin-bottom: 20px; color: #2d3748;">"This product has completely transformed how we work. Highly recommended!"</p>
                <div style="font-weight: bold; color: #4a5568;">John Doe</div>
                <div style="color: #718096;">CEO, Company Inc.</div>
              </div>
            </section>
          `,
        });

            setEditor(editorInstance);
          });
        }
      }, 100); // Check every 100ms

      // Cleanup interval if component unmounts
      return () => clearInterval(checkElements);
    }
  }, [pageId, isLoading]);

  const handleSave = async () => {
    if (editor) {
      try {
        const html = editor.getHtml();
        const css = editor.getCss();
        const components = editor.getComponents();

        await api.put(`/api/v1/builder/pages/${pageId}`, {
          'gjs-html': html,
          'gjs-css': css,
          'gjs-components': components
        });

        alert('✅ Page saved successfully!');
      } catch (error) {
        console.error('Save error:', error);
        alert('❌ Failed to save page');
      }
    }
  };

  const handlePublish = async () => {
    if (editor) {
      try {
        // Save first
        const html = editor.getHtml();
        const css = editor.getCss();
        const components = editor.getComponents();

        await api.put(`/api/v1/builder/pages/${pageId}`, {
          'gjs-html': html,
          'gjs-css': css,
          'gjs-components': components
        });

        // Then publish
        await api.post(`/api/v1/builder/pages/${pageId}/publish`);

        alert('✅ Page saved and published!');
      } catch (error) {
        console.error('Publish error:', error);
        alert('❌ Failed to publish page');
      }
    }
  };

  const handlePreview = () => {
    if (editor) {
      const html = editor.getHtml();
      const css = editor.getCss();

      // Open preview in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Preview</title>
              <style>${css}</style>
            </head>
            <body>${html}</body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  };

  const handleBack = () => {
    if (confirm('Are you sure you want to leave? Any unsaved changes will be lost.')) {
      window.location.href = '/dashboard/builder';
    }
  };

  // Set isLoading to false immediately to render the DOM elements
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!editorReady && isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading editor...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Blocks */}
      <div className="bg-gray-800 text-white p-4 flex flex-col w-64 overflow-y-auto">
        <h3 className="font-semibold mb-4 text-lg">Blocks</h3>
        <div id="gjs-blocks" className="flex-1"></div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-gray-700 text-white p-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              👁 Preview
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              💾 Save
            </button>
            <button
              onClick={handlePublish}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors font-semibold"
            >
              🚀 Save & Publish
            </button>
          </div>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-auto">
          <div id="gjs-editor"></div>
        </div>
      </div>

      {/* Right Sidebar - Layers & Styles */}
      <div className="bg-gray-800 text-white p-4 flex flex-col w-64 overflow-y-auto">
        <h3 className="font-semibold mb-4 text-lg">Layers</h3>
        <div id="gjs-layers" className="mb-6"></div>

        <h3 className="font-semibold mb-4 text-lg">Styles</h3>
        <div id="gjs-styles" className="flex-1"></div>
      </div>
    </div>
  );
}
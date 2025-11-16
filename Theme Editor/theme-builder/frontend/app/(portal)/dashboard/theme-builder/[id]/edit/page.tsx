import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchThemes } from '@/lib/api';
import ThemeForm from '@/components/theme/ThemeForm';
import ThemePreview from '@/components/theme/ThemePreview';

export default function ThemeBuilderPage() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const { data: themes, isLoading, error } = useQuery('themes', fetchThemes);

  useEffect(() => {
    if (themes && themes.length > 0) {
      setSelectedTheme(themes[0]); // Select the first theme by default
    }
  }, [themes]);

  if (isLoading) return <div>Loading themes...</div>;
  if (error) return <div>Error loading themes: {error.message}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Theme Builder</h1>
      <div className="mt-4">
        <h2 className="text-xl">Available Themes</h2>
        <ul>
          {themes.map(theme => (
            <li key={theme.id} onClick={() => setSelectedTheme(theme)} className="cursor-pointer">
              {theme.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedTheme && (
        <div className="mt-8">
          <ThemePreview theme={selectedTheme} />
          <ThemeForm theme={selectedTheme} />
        </div>
      )}
    </div>
  );
}
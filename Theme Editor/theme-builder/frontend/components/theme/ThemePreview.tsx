import React from 'react';

interface ThemePreviewProps {
  theme: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    fonts: {
      header: string;
      body: string;
    };
  };
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const { name, colors, fonts } = theme;

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text, fontFamily: fonts.body }}>
      <h1 style={{ fontFamily: fonts.header }}>{name}</h1>
      <div>
        <h2>Color Palette</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ backgroundColor: colors.primary, width: '100px', height: '100px' }} />
          <div style={{ backgroundColor: colors.secondary, width: '100px', height: '100px' }} />
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;
import React, { useState } from 'react';

const ThemeEditor = ({ theme, onSave }) => {
  const [name, setName] = useState(theme.name || '');
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor || '#000000');
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor || '#FFFFFF');
  const [font, setFont] = useState(theme.font || 'Arial');

  const handleSave = () => {
    const updatedTheme = {
      ...theme,
      name,
      primaryColor,
      secondaryColor,
      font,
    };
    onSave(updatedTheme);
  };

  return (
    <div className="theme-editor">
      <h2>Edit Theme</h2>
      <div>
        <label>
          Theme Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Primary Color:
          <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Secondary Color:
          <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Font:
          <select value={font} onChange={(e) => setFont(e.target.value)}>
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </label>
      </div>
      <button onClick={handleSave}>Save Theme</button>
    </div>
  );
};

export default ThemeEditor;
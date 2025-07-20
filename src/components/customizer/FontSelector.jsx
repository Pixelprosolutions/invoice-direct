import React from 'react';
import styles from './FontSelector.module.css';

const FontSelector = ({ label, value, onChange }) => {
  const fonts = [
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Roboto', family: 'Roboto, sans-serif' },
    { name: 'Open Sans', family: 'Open Sans, sans-serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display, serif' },
    { name: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif' },
    { name: 'Merriweather', family: 'Merriweather, serif' },
    { name: 'Nunito', family: 'Nunito, sans-serif' }
  ];

  return (
    <div className={styles.fontSelector}>
      <label className={styles.label}>
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.select}
          style={{ fontFamily: fonts.find(f => f.name === value)?.family }}
        >
          {fonts.map((font) => (
            <option
              key={font.name}
              value={font.name}
              style={{ fontFamily: font.family }}
            >
              {font.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FontSelector;

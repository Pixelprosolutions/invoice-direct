import React from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from './ColorPicker.module.css';

const ColorPicker = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={styles.colorPicker}>
      <label className={styles.label}>
        {label}
        <div className={styles.colorPreview}>
          <button
            className={styles.swatch}
            style={{ backgroundColor: color }}
            onClick={() => setIsOpen(!isOpen)}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className={styles.colorInput}
          />
        </div>
      </label>
      
      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.cover} onClick={() => setIsOpen(false)} />
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

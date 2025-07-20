import React from 'react';
import styles from './SpacingControl.module.css';

const SpacingControl = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => {
  return (
    <div className={styles.spacingControl}>
      <label className={styles.label}>
        {label}
        <div className={styles.controls}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={styles.slider}
          />
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={styles.numberInput}
          />
        </div>
      </label>
    </div>
  );
};

export default SpacingControl;

import React from 'react';
import styles from './TemplateSelector.module.css';

const TemplateSelector = ({ value, onChange }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional and professional'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant'
    },
    {
      id: 'bold',
      name: 'Bold',
      description: 'Strong and impactful'
    }
  ];

  return (
    <div className={styles.templateSelector}>
      <div className={styles.templates}>
        {templates.map((template) => (
          <button
            key={template.id}
            className={`${styles.template} ${value === template.id ? styles.active : ''}`}
            onClick={() => onChange(template.id)}
          >
            <div className={styles.info}>
              <h4>{template.name}</h4>
              <p>{template.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;

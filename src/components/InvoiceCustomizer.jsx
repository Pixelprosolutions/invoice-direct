import React from 'react';
import { FaPalette, FaFont, FaRuler, FaLayerGroup } from 'react-icons/fa';
import { useInvoice } from '../context/InvoiceContext';
import ColorPicker from './customizer/ColorPicker';
import FontSelector from './customizer/FontSelector';
import SpacingControl from './customizer/SpacingControl';
import TemplateSelector from './customizer/TemplateSelector';
import styles from './InvoiceCustomizer.module.css';

const InvoiceCustomizer = () => {
  const { invoiceData, updateInvoiceData } = useInvoice();
  const [activeTab, setActiveTab] = React.useState('colors');

  const handleColorChange = (colorType, color) => {
    updateInvoiceData({
      design: {
        ...invoiceData.design,
        colors: {
          ...invoiceData.design?.colors,
          [colorType]: color
        }
      }
    });
  };

  const handleFontChange = (fontType, fontFamily) => {
    updateInvoiceData({
      design: {
        ...invoiceData.design,
        fonts: {
          ...invoiceData.design?.fonts,
          [fontType]: fontFamily
        }
      }
    });
  };

  const handleSpacingChange = (spacingType, value) => {
    updateInvoiceData({
      design: {
        ...invoiceData.design,
        spacing: {
          ...invoiceData.design?.spacing,
          [spacingType]: value
        }
      }
    });
  };

  const handleTemplateChange = (template) => {
    updateInvoiceData({
      design: {
        ...invoiceData.design,
        template
      }
    });
  };

  return (
    <div className={styles.customizer}>
      <div className={styles.customizerHeader}>
        <h3>Design Settings</h3>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'colors' ? styles.active : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            <FaPalette /> Colors
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'fonts' ? styles.active : ''}`}
            onClick={() => setActiveTab('fonts')}
          >
            <FaFont /> Fonts
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'spacing' ? styles.active : ''}`}
            onClick={() => setActiveTab('spacing')}
          >
            <FaRuler /> Spacing
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'templates' ? styles.active : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <FaLayerGroup /> Templates
          </button>
        </div>
      </div>

      <div className={styles.customizerContent}>
        {activeTab === 'colors' && (
          <div className={styles.section}>
            <ColorPicker
              label="Primary Color"
              color={invoiceData.design?.colors?.primary || '#4F46E5'}
              onChange={(color) => handleColorChange('primary', color)}
            />
            <ColorPicker
              label="Secondary Color"
              color={invoiceData.design?.colors?.secondary || '#6366F1'}
              onChange={(color) => handleColorChange('secondary', color)}
            />
            <ColorPicker
              label="Text Color"
              color={invoiceData.design?.colors?.text || '#1F2937'}
              onChange={(color) => handleColorChange('text', color)}
            />
            <ColorPicker
              label="Background Color"
              color={invoiceData.design?.colors?.background || '#FFFFFF'}
              onChange={(color) => handleColorChange('background', color)}
            />
            <ColorPicker
              label="Accent Color"
              color={invoiceData.design?.colors?.accent || '#10B981'}
              onChange={(color) => handleColorChange('accent', color)}
            />
          </div>
        )}

        {activeTab === 'fonts' && (
          <div className={styles.section}>
            <FontSelector
              label="Header Font"
              value={invoiceData.design?.fonts?.header || 'Inter'}
              onChange={(font) => handleFontChange('header', font)}
            />
            <FontSelector
              label="Body Font"
              value={invoiceData.design?.fonts?.body || 'Inter'}
              onChange={(font) => handleFontChange('body', font)}
            />
            <FontSelector
              label="Accent Font"
              value={invoiceData.design?.fonts?.accent || 'Inter'}
              onChange={(font) => handleFontChange('accent', font)}
            />
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className={styles.section}>
            <SpacingControl
              label="Page Margins"
              value={invoiceData.design?.spacing?.pageMargins || 40}
              onChange={(value) => handleSpacingChange('pageMargins', value)}
            />
            <SpacingControl
              label="Section Spacing"
              value={invoiceData.design?.spacing?.sectionSpacing || 24}
              onChange={(value) => handleSpacingChange('sectionSpacing', value)}
            />
            <SpacingControl
              label="Line Height"
              value={invoiceData.design?.spacing?.lineHeight || 1.5}
              onChange={(value) => handleSpacingChange('lineHeight', value)}
              step={0.1}
              min={1}
              max={2}
            />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className={styles.section}>
            <TemplateSelector
              value={invoiceData.design?.template || 'modern'}
              onChange={handleTemplateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCustomizer;

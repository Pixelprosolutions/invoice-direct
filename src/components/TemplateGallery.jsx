import React from 'react'
import { FaEye, FaEdit, FaCopy, FaTrash, FaCheck, FaStar, FaCrown } from 'react-icons/fa'
import styles from './TemplateGallery.module.css'

const TemplateGallery = ({ 
  templates, 
  onPreview, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onApply 
}) => {
  
  if (templates.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <FaStar />
        </div>
        <h3>No templates found</h3>
        <p>Try adjusting your search terms or browse a different category.</p>
      </div>
    )
  }

  const handleQuickApply = (template, e) => {
    e.stopPropagation()
    onApply(template)
  }

  return (
    <div className={styles.templateGallery}>
      <div className={styles.templatesGrid}>
        {templates.map(template => (
          <div 
            key={template.id} 
            className={`${styles.templateCard} ${template.isPremium ? styles.premium : ''}`}
            onClick={() => onPreview(template)}
          >
            {/* Template Thumbnail */}
            <div className={styles.thumbnailContainer}>
              <div 
                className={styles.thumbnail}
                style={{
                  background: `linear-gradient(135deg, ${template.branding.primaryColor}, ${template.branding.secondaryColor})`
                }}
              >
                <div className={styles.mockInvoice}>
                  <div className={styles.mockHeader}>
                    <div className={styles.mockLogo}></div>
                    <div className={styles.mockTitle}>INVOICE</div>
                  </div>
                  <div className={styles.mockContent}>
                    <div className={styles.mockLine}></div>
                    <div className={styles.mockLine + ' ' + styles.short}></div>
                    <div className={styles.mockLine + ' ' + styles.medium}></div>
                  </div>
                  <div className={styles.mockTable}>
                    <div className={styles.mockTableRow}></div>
                    <div className={styles.mockTableRow}></div>
                    <div className={styles.mockTableRow}></div>
                  </div>
                </div>
              </div>

              {/* Premium Badge */}
              {template.isPremium && (
                <div className={styles.premiumBadge}>
                  <FaCrown />
                </div>
              )}

              {/* Quick Actions Overlay */}
              <div className={styles.actionsOverlay}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(template)
                  }}
                  className={`${styles.actionButton} ${styles.previewButton}`}
                  title="Preview"
                >
                  <FaEye />
                </button>
                <button
                  onClick={handleQuickApply.bind(null, template)}
                  className={`${styles.actionButton} ${styles.applyButton}`}
                  title="Use Template"
                >
                  <FaCheck />
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className={styles.templateInfo}>
              <div className={styles.templateHeader}>
                <h3 className={styles.templateName}>{template.name}</h3>
                {template.isCustom && (
                  <span className={styles.customBadge}>Custom</span>
                )}
              </div>
              
              <p className={styles.templateDescription}>{template.description}</p>
              
              <div className={styles.templateMeta}>
                <span className={styles.industry}>{template.industry}</span>
                <div className={styles.colorPreview}>
                  <div 
                    className={styles.colorDot}
                    style={{ backgroundColor: template.branding.primaryColor }}
                  ></div>
                  <div 
                    className={styles.colorDot}
                    style={{ backgroundColor: template.branding.secondaryColor }}
                  ></div>
                  <div 
                    className={styles.colorDot}
                    style={{ backgroundColor: template.branding.accentColor }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Template Actions */}
            <div className={styles.templateActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPreview(template)
                }}
                className={`${styles.actionBtn} ${styles.previewBtn}`}
              >
                <FaEye /> Preview
              </button>
              
              {template.isCustom ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(template)
                  }}
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(template)
                  }}
                  className={`${styles.actionBtn} ${styles.duplicateBtn}`}
                >
                  <FaCopy /> Duplicate
                </button>
              )}

              {template.isCustom && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(template.id)
                  }}
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TemplateGallery

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  FaPalette, FaPlus, FaSearch, FaFilter, FaStar, FaEye, FaEdit, FaTrash, FaCopy,
  FaBriefcase, FaPaintBrush, FaHammer, FaShoppingCart, FaLaptopCode, FaHeartbeat, FaCog, FaArrowLeft
} from 'react-icons/fa'
import { templatePresets, templateCategories } from '../data/templatePresets'
import TemplateGallery from './TemplateGallery'
import TemplatePreview from './TemplatePreview'
import TemplateEditor from './TemplateEditor'
import Modal from './Modal'
import { useInvoice } from '../context/InvoiceContext'
import styles from './TemplateManager.module.css'

const TemplateManager = () => {
  const { applyTemplate } = useInvoice()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [customTemplates, setCustomTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])

  // Load custom templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('customTemplates')
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates)
        setCustomTemplates(parsedTemplates)
      } catch (error) {
        console.error('Error loading custom templates:', error)
      }
    }
  }, [])

  // Filter templates based on category and search
  useEffect(() => {
    let templates = [...templatePresets, ...customTemplates]
    
    // Filter by category
    if (activeCategory !== 'all') {
      templates = templates.filter(template => template.category === activeCategory)
    }
    
    // Filter by search term
    if (searchTerm) {
      templates = templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredTemplates(templates)
  }, [activeCategory, searchTerm, customTemplates])

  const handlePreviewTemplate = (template) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setShowEditor(true)
  }

  const handleCreateTemplate = () => {
    // Start with a blank template
    const blankTemplate = templatePresets.find(t => t.id === 'custom-blank')
    setSelectedTemplate({ ...blankTemplate, id: `custom-${Date.now()}`, name: 'New Template' })
    setShowEditor(true)
  }

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      name: `${template.name} Copy`,
      isCustom: true
    }
    setSelectedTemplate(duplicatedTemplate)
    setShowEditor(true)
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This cannot be undone.')) {
      const updatedTemplates = customTemplates.filter(t => t.id !== templateId)
      setCustomTemplates(updatedTemplates)
      localStorage.setItem('customTemplates', JSON.stringify(updatedTemplates))
      toast.success('Template deleted successfully')
    }
  }

  const handleSaveTemplate = (templateData) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateData.id)
    const newTemplates = [...updatedTemplates, { ...templateData, isCustom: true }]
    setCustomTemplates(newTemplates)
    localStorage.setItem('customTemplates', JSON.stringify(newTemplates))
    setShowEditor(false)
    toast.success('Template saved successfully!')
  }

  const handleApplyTemplate = (template) => {
    // Apply template using context
    applyTemplate(template)
    toast.success(`Template "${template.name}" applied! Check the Create tab to see the changes.`)
  }

  const getIconForCategory = (categoryId) => {
    const iconMap = {
      all: FaPalette,
      professional: FaBriefcase,
      creative: FaPaintBrush,
      construction: FaHammer,
      retail: FaShoppingCart,
      technology: FaLaptopCode,
      healthcare: FaHeartbeat,
      custom: FaCog
    }
    return iconMap[categoryId] || FaPalette
  }

  const stats = {
    total: filteredTemplates.length,
    custom: customTemplates.length,
    premium: filteredTemplates.filter(t => t.isPremium).length
  }

  return (
    <div className={styles.templateManager}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Invoice Templates</h2>
          <p>Choose from professional templates or create your own custom design</p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={handleCreateTemplate} className={styles.createButton}>
            <FaPlus /> Create Template
          </button>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>{stats.total}</h3>
          <p>Available Templates</p>
        </div>
        <div className={styles.statCard}>
          <h3>{stats.custom}</h3>
          <p>Custom Templates</p>
        </div>
        <div className={styles.statCard}>
          <h3>{stats.premium}</h3>
          <p>Premium Templates</p>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search templates by name, industry, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.categoryTabs}>
          {templateCategories.map(category => {
            const IconComponent = getIconForCategory(category.id)
            return (
              <button
                key={category.id}
                className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
                title={category.description}
              >
                <IconComponent className={styles.categoryIcon} />
                <span>{category.name}</span>
                {category.id !== 'all' && (
                  <span className={styles.categoryCount}>
                    {templatePresets.filter(t => t.category === category.id).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <TemplateGallery
        templates={filteredTemplates}
        onPreview={handlePreviewTemplate}
        onEdit={handleEditTemplate}
        onDuplicate={handleDuplicateTemplate}
        onDelete={handleDeleteTemplate}
        onApply={handleApplyTemplate}
      />

      {showPreview && selectedTemplate && (
        <Modal onClose={() => setShowPreview(false)} size="large">
          <TemplatePreview
            template={selectedTemplate}
            onClose={() => setShowPreview(false)}
            onEdit={() => {
              setShowPreview(false)
              handleEditTemplate(selectedTemplate)
            }}
            onApply={() => {
              handleApplyTemplate(selectedTemplate)
              setShowPreview(false)
            }}
          />
        </Modal>
      )}

      {showEditor && selectedTemplate && (
        <Modal onClose={() => setShowEditor(false)} size="large">
          <TemplateEditor
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setShowEditor(false)}
          />
        </Modal>
      )}
    </div>
  )
}

export default TemplateManager

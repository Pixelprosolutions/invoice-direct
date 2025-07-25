// SEO Helper Functions for Invoice Direct
// Based on comprehensive SEO strategy from planning documents

/**
 * Lazy load images for better Core Web Vitals
 */
export const setupLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))
  }
}

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const criticalStylesheets = [
    '/assets/critical.css',
    '/assets/fonts.css'
  ]

  criticalStylesheets.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'style'
    link.href = href
    document.head.appendChild(link)
  })

  // Preload critical fonts
  const criticalFonts = [
    '/assets/fonts/inter-regular.woff2',
    '/assets/fonts/inter-medium.woff2'
  ]

  criticalFonts.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = href
    document.head.appendChild(link)
  })
}

/**
 * Track Core Web Vitals
 */
export const trackCoreWebVitals = () => {
  // LCP - Largest Contentful Paint
  const observeLCP = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        
        // Report to analytics
        if (window.gtag) {
          window.gtag('event', 'LCP', {
            custom_map: { metric_value: lastEntry.startTime },
            value: Math.round(lastEntry.startTime),
            metric_id: 'lcp'
          })
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.log('LCP measurement not supported')
    }
  }

  // FID - First Input Delay
  const observeFID = () => {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (window.gtag) {
            window.gtag('event', 'FID', {
              custom_map: { metric_value: entry.processingStart - entry.startTime },
              value: Math.round(entry.processingStart - entry.startTime),
              metric_id: 'fid'
            })
          }
        })
      })
      observer.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.log('FID measurement not supported')
    }
  }

  // CLS - Cumulative Layout Shift
  const observeCLS = () => {
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        
        if (window.gtag) {
          window.gtag('event', 'CLS', {
            custom_map: { metric_value: clsValue },
            value: Math.round(clsValue * 1000),
            metric_id: 'cls'
          })
        }
      })
      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.log('CLS measurement not supported')
    }
  }

  observeLCP()
  observeFID()
  observeCLS()
}

/**
 * Generate structured data for different page types
 */
export const generateStructuredData = (pageType, data = {}) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": pageType
  }

  switch (pageType) {
    case 'SoftwareApplication':
      return {
        ...baseData,
        name: "Invoice Direct",
        applicationCategory: "BusinessApplication",
        operatingSystem: ["Web", "iOS", "Android"],
        offers: {
          "@type": "Offer",
          price: "10",
          priceCurrency: "USD",
          description: "Lifetime access to professional invoice software"
        },
        ...data
      }

    case 'Article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        author: {
          "@type": "Organization",
          name: "Invoice Direct"
        },
        publisher: {
          "@type": "Organization",
          name: "Invoice Direct",
          logo: "https://invoicedirect.app/logo.png"
        },
        datePublished: data.publishDate || new Date().toISOString(),
        dateModified: data.modifiedDate || new Date().toISOString(),
        ...data
      }

    case 'FAQPage':
      return {
        ...baseData,
        mainEntity: data.questions || []
      }

    default:
      return baseData
  }
}

/**
 * Critical CSS inlining function
 */
export const inlineCriticalCSS = () => {
  // This should be implemented at build time for better performance
  const criticalCSS = `
    /* Critical above-the-fold styles */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .hero { min-height: 600px; display: flex; align-items: center; }
    .heroTitle { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
    .heroSubtitle { font-size: 1.125rem; color: #666; margin-bottom: 2rem; }
    .primaryButton { background: #4f46e5; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-weight: 600; }
  `
  
  const style = document.createElement('style')
  style.textContent = criticalCSS
  document.head.appendChild(style)
}

/**
 * SEO-friendly URL generation
 */
export const generateSEOUrl = (title, category = '') => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
  
  return category ? `/${category}/${slug}` : `/${slug}`
}

/**
 * Meta tag management
 */
export const updateMetaTags = (tags) => {
  Object.entries(tags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`)
    
    if (!meta) {
      meta = document.createElement('meta')
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  })
}

/**
 * Analytics tracking for SEO events
 */
export const trackSEOEvent = (eventName, parameters = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      event_category: 'SEO',
      value: 1
    })
  }
}

/**
 * Internal linking helper
 */
export const generateInternalLinks = (content, linkMap) => {
  let processedContent = content
  
  Object.entries(linkMap).forEach(([keyword, url]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    processedContent = processedContent.replace(regex, 
      `<a href="${url}" class="internal-link">${keyword}</a>`
    )
  })
  
  return processedContent
}

/**
 * Keyword density analyzer
 */
export const analyzeKeywordDensity = (text, keywords) => {
  const words = text.toLowerCase().split(/\s+/)
  const totalWords = words.length
  
  return keywords.map(keyword => {
    const keywordWords = keyword.toLowerCase().split(/\s+/)
    let occurrences = 0
    
    for (let i = 0; i <= words.length - keywordWords.length; i++) {
      if (keywordWords.every((word, index) => words[i + index] === word)) {
        occurrences++
      }
    }
    
    return {
      keyword,
      occurrences,
      density: (occurrences / totalWords) * 100,
      optimal: occurrences >= 2 && occurrences <= 8 // 2-8 occurrences is typically good
    }
  })
}

/**
 * Performance monitoring
 */
export const monitorPerformance = () => {
  // Monitor JavaScript execution time
  const measureExecutionTime = (functionName, fn) => {
    return function(...args) {
      const start = performance.now()
      const result = fn.apply(this, args)
      const end = performance.now()
      
      if (window.gtag) {
        window.gtag('event', 'function_execution_time', {
          function_name: functionName,
          execution_time: Math.round(end - start),
          event_category: 'Performance'
        })
      }
      
      return result
    }
  }

  // Monitor page load metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      
      if (window.gtag && navigation) {
        window.gtag('event', 'page_load_metrics', {
          dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart),
          load_complete: Math.round(navigation.loadEventEnd - navigation.navigationStart),
          event_category: 'Performance'
        })
      }
    }, 0)
  })
}

/**
 * Initialize all SEO optimizations
 */
export const initializeSEO = () => {
  // Setup performance monitoring
  trackCoreWebVitals()
  monitorPerformance()
  
  // Setup lazy loading
  setupLazyLoading()
  
  // Preload critical resources
  preloadCriticalResources()
  
  // Track page view for SEO
  trackSEOEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href
  })
}

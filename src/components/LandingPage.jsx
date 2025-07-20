import React from 'react'
import styles from './LandingPage.module.css'
import { FaFileInvoiceDollar, FaDownload, FaCheck, FaRocket } from 'react-icons/fa'

const LandingPage = ({ onSignUp, onSignIn }) => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            ✨ Simple & Professional Invoice Generator
          </div>
          <h1 className={styles.heroTitle}>
            Create Professional <span className={styles.highlight}>Invoices</span> in Minutes
          </h1>
          <p className={styles.heroSubtitle}>
            Generate clean, professional invoices with our simple form. Add your business details, 
            line items, and download as PDF. Start with 3 free invoices.
          </p>
          <div className={styles.heroActions}>
            <button onClick={onSignUp} className={styles.primaryButton}>
              <FaRocket /> Start Creating Invoices Free
            </button>
            <button onClick={onSignIn} className={styles.secondaryButton}>
              Sign In
            </button>
          </div>
          <div className={styles.heroTrust}>
            No credit card required • 3 free invoices to start
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.invoicePreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewLogo}></div>
              <div className={styles.previewTitle}>INVOICE</div>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewLine}></div>
              <div className={styles.previewLine}></div>
              <div className={styles.previewLine}></div>
              <div className={styles.previewTable}>
        <div className={styles.heroVisual}>
          <div className={styles.invoicePreview}>
            <div className={styles.previewHeader}>
              <div className={styles.previewLogo}></div>
              <div className={styles.previewTitle}>INVOICE</div>
            </div>
            <div className={styles.previewContent}>
              <div className={styles.previewLine}></div>
              <div className={styles.previewLine}></div>
              <div className={styles.previewLine}></div>
              <div className={styles.previewTable}>
                <div className={styles.tableLine}></div>
                <div className={styles.tableLine}></div>
                <div className={styles.tableLine}></div>
              </div>
              <div className={styles.previewTotal}></div>
            </div>
          </div>
        </div>
                <div className={styles.tableLine}></div>
                <div className={styles.tableLine}></div>
                <div className={styles.tableLine}></div>
              </div>
              <div className={styles.previewTotal}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Everything You Need to Create Professional Invoices</h2>
            <p>Simple tools that get the job done</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaFileInvoiceDollar />
              </div>
              <h3>Simple Invoice Form</h3>
              <p>Fill out business details, client info, and line items in an easy-to-use form.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaDownload />
              </div>
              <h3>Professional PDF Output</h3>
              <p>Generate clean, professional invoices that you can download and send to clients.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaCheck />
              </div>
              <h3>Add Your Branding</h3>
              <p>Upload your logo and customize colors to match your business brand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Simple Pricing</h2>
            <p>Start free, upgrade when you need more</p>
          </div>
          
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Free</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>$0</span>
                </div>
                <p className={styles.pricingSubtext}>Perfect for trying it out</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> 3 invoices per month</li>
                <li><FaCheck /> PDF download</li>
                <li><FaCheck /> Basic customization</li>
                <li><FaCheck /> Add your logo</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Get Started Free
              </button>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Premium</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>$10</span>
                  <span className={styles.period}>lifetime</span>
                </div>
                <p className={styles.pricingSubtext}>One-time payment</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> <strong>Unlimited invoices</strong></li>
                <li><FaCheck /> Remove watermarks</li>
                <li><FaCheck /> Save invoice history</li>
                <li><FaCheck /> Custom branding</li>
                <li><FaCheck /> Priority support</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Create Your First Invoice?</h2>
          <p>Start creating professional invoices in minutes</p>
          <div className={styles.ctaActions}>
            <button onClick={onSignUp} className={styles.ctaButton}>
              <FaRocket /> Start Creating Free
            </button>
            <p className={styles.ctaSubtext}>
              No credit card required • 3 free invoices • Ready in 2 minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
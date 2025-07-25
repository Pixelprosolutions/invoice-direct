import React, { useEffect, useRef } from 'react'
import styles from './LandingPage.module.css'
import { FaFileInvoiceDollar, FaDownload, FaCheck, FaRocket, FaClock, FaUserFriends, FaShieldAlt, FaChartLine, FaPaintBrush, FaGlobeAmericas, FaMobile, FaCloudDownloadAlt, FaStar, FaArrowRight, FaLock } from 'react-icons/fa'

const LandingPage = ({ onSignUp, onSignIn }) => {
  const observerRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.fadeInUp)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const elements = document.querySelectorAll(`.${styles.observeElement}`)
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            ✨ #1 Free Invoice Generator for Small Businesses
          </div>
          <h1 className={styles.heroTitle}>
            Create Professional Invoices in Under 60 Seconds
          </h1>
          <p className={styles.heroSubtitle}>
            Join 50,000+ freelancers and small businesses who trust Invoice Direct. Generate stunning invoices, 
            track payments, manage clients, and get paid faster with our intuitive invoice maker.
          </p>
          <div className={styles.heroActions}>
            <button onClick={onSignUp} className={styles.primaryButton}>
              <FaRocket /> Start Creating Invoices Free
            </button>
            <p className={styles.ctaNote}>
              ✓ No credit card required • ✓ Setup in 2 minutes • ✓ 3 free invoices
            </p>
          </div>

          <div className={styles.heroSecondary}>
            <button onClick={onSignIn} className={styles.secondaryButton}>
              Already have an account? Sign In
            </button>
          </div>

        </div>
        <div className={styles.heroVisual}>
          <div className={styles.appDemo}>
            <div className={styles.demoHeader}>
              <div className={styles.browserBar}>
                <div className={styles.browserDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className={styles.urlBar}>app.invoicedirect.com</div>
              </div>
            </div>
            <div className={styles.demoContent}>
              <div className={styles.demoSidebar}>
                <div className={styles.sidebarItem}>📄 Create Invoice</div>
                <div className={styles.sidebarItem}>📊 Dashboard</div>
                <div className={styles.sidebarItem}>👥 Clients</div>
                <div className={styles.sidebarItem}>💰 Payments</div>
              </div>
              <div className={styles.demoMain}>
                <div className={styles.demoForm}>
                  <div className={styles.formSection}>
                    <h4>Invoice Details</h4>
                    <div className={styles.formField}></div>
                    <div className={styles.formField}></div>
                  </div>
                  <div className={styles.formSection}>
                    <h4>Bill To</h4>
                    <div className={styles.formField}></div>
                    <div className={styles.formField}></div>
                  </div>
                  <div className={styles.invoiceItems}>
                    <div className={styles.itemRow}>
                      <span>Design Services</span>
                      <span>$2,500.00</span>
                    </div>
                    <div className={styles.itemRow}>
                      <span>Development</span>
                      <span>$3,200.00</span>
                    </div>
                    <div className={styles.totalRow}>
                      <strong>Total: $5,700.00</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.demoFloating}>
            <div className={styles.floatingBadge}>✓ Auto-saved</div>
            <div className={styles.floatingBadge}>📧 Email sent</div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`${styles.benefits} ${styles.observeElement}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Why 50,000+ Businesses Choose Invoice Direct</h2>
            <p>The most trusted online invoice generator for professionals worldwide</p>
          </div>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <FaClock />
              </div>
              <h3>Save 5+ Hours Weekly</h3>
              <p>Automate your invoicing process and focus on growing your business instead of paperwork.</p>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <FaChartLine />
              </div>
              <h3>Get Paid 40% Faster</h3>
              <p>Professional invoices with payment tracking help you collect payments quicker than ever.</p>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                <FaShieldAlt />
              </div>
              <h3>100% Secure & Reliable</h3>
              <p>Bank-grade security protects your data. Trusted by professionals in 150+ countries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Everything You Need to Run Your Business</h2>
            <p>Professional invoicing tools designed for freelancers and small businesses</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaFileInvoiceDollar />
              </div>
              <h3>Smart Invoice Builder</h3>
              <p>Create professional invoices in seconds with our intelligent form. Auto-calculate taxes, discounts, and totals.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaPaintBrush />
              </div>
              <h3>Custom Branding</h3>
              <p>Add your logo, customize colors, and choose from professional templates to match your brand perfectly.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaUserFriends />
              </div>
              <h3>Client Management</h3>
              <p>Store client information, track payment history, and manage all your business relationships in one place.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaDownload />
              </div>
              <h3>Instant PDF Download</h3>
              <p>Generate high-quality PDF invoices instantly. Perfect for email, printing, or record keeping.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaChartLine />
              </div>
              <h3>Payment Tracking</h3>
              <p>Monitor payment status, send automatic reminders, and track your cash flow with detailed analytics.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaMobile />
              </div>
              <h3>Mobile Optimized</h3>
              <p>Create and manage invoices on any device. Full functionality on desktop, tablet, and mobile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={styles.socialProof}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Trusted by Professionals Worldwide</h2>
            <p>Join thousands of freelancers and small businesses who love Invoice Direct</p>
          </div>
          
          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialRating}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <div className={styles.testimonialContent}>
                <p>"Invoice Direct saved me hours every week. I can create professional invoices in under a minute and my clients pay me 50% faster now."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #f59e0b, #ea580c)'}}>SJ</div>
                <div className={styles.authorInfo}>
                  <strong>Sarah Johnson</strong>
                  <span>Freelance Designer • Boston, MA</span>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialRating}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <div className={styles.testimonialContent}>
                <p>"The best invoice generator I've used. Clean interface, powerful features, and the $10 lifetime deal is incredible value."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>MC</div>
                <div className={styles.authorInfo}>
                  <strong>Mike Chen</strong>
                  <span>Marketing Consultant • San Francisco, CA</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialRating}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <div className={styles.testimonialContent}>
                <p>"Perfect for my small business. Professional invoices, easy client management, and excellent payment tracking. Highly recommended!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar} style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>ED</div>
                <div className={styles.authorInfo}>
                  <strong>Emma Davis</strong>
                  <span>Business Owner • Austin, TX</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <FaGlobeAmericas />
              <span>Used in 150+ Countries</span>
            </div>
            <div className={styles.trustBadge}>
              <FaShieldAlt />
              <span>Bank-Grade Security</span>
            </div>
            <div className={styles.trustBadge}>
              <FaCheck />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Simple, Transparent Pricing</h2>
            <p>Start free, upgrade only when you need more. No monthly fees, no hidden costs.</p>
          </div>
          
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Free Starter</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>$0</span>
                </div>
                <p className={styles.pricingSubtext}>Perfect for testing and small projects</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> 3 professional invoices per month</li>
                <li><FaCheck /> PDF download & email</li>
                <li><FaCheck /> Basic customization</li>
                <li><FaCheck /> Add your logo</li>
                <li><FaCheck /> Client management</li>
                <li><FaCheck /> Mobile app access</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Start Free Today
              </button>
              <p className={styles.pricingNote}>No credit card required</p>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>🔥 Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Professional</h3>
                <div className={styles.price}>
                  <span className={styles.amount}>$10</span>
                  <span className={styles.period}>lifetime</span>
                </div>
                <p className={styles.pricingSubtext}>One-time payment • Best value</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> <strong>Unlimited invoices forever</strong></li>
                <li><FaCheck /> Remove all watermarks</li>
                <li><FaCheck /> Complete invoice history</li>
                <li><FaCheck /> Advanced custom branding</li>
                <li><FaCheck /> Payment tracking & reminders</li>
                <li><FaCheck /> Revenue analytics & reports</li>
                <li><FaCheck /> Priority email support</li>
                <li><FaCheck /> Multiple template designs</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Upgrade to Professional
              </button>

            </div>
          </div>
          
          <div className={styles.pricingNote}>
            <div className={styles.savingsBadge}>
              <span className={styles.savingsText}>💰 Save $39/year with lifetime deal!</span>
            </div>
            <p>🎉 <strong>Limited Time:</strong> Get Professional for life at just $10. Regular price $49/year.</p>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about Invoice Direct</p>
          </div>
          
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>Is Invoice Direct really free?</h3>
              <p>Yes! You get 3 professional invoices per month completely free. No hidden costs, no trial limitations. Upgrade to Professional for unlimited invoices.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I customize my invoices?</h3>
              <p>Absolutely! Add your logo, choose colors, select templates, and create invoices that perfectly match your brand. Professional plan includes advanced customization options.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Do I need to install anything?</h3>
              <p>No downloads required! Invoice Direct works in any web browser. Create invoices on your computer, tablet, or phone with full functionality everywhere.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>How do I get paid faster?</h3>
              <p>Professional invoices get paid 40% faster on average. Our payment tracking system sends automatic reminders and helps you maintain healthy cash flow.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Is my data secure?</h3>
              <p>Yes! We use bank-grade encryption and security measures. Your data is stored securely and never shared with third parties. We're trusted by 50,000+ users worldwide.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>What if I need help?</h3>
              <p>We're here for you! Free users get community support, and Professional users receive priority email support with fast response times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaBadge}>
            <FaStar className={styles.ctaBadgeIcon} />
            Trusted by 50,000+ Businesses
          </div>
          <h2>Ready to Transform Your Invoicing?</h2>
          <p>Join thousands of professionals who switched to Invoice Direct to save time and get paid faster</p>

          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <FaCheck className={styles.ctaFeatureIcon} />
              <span>No credit card required</span>
            </div>
            <div className={styles.ctaFeature}>
              <FaCheck className={styles.ctaFeatureIcon} />
              <span>3 free invoices</span>
            </div>
            <div className={styles.ctaFeature}>
              <FaCheck className={styles.ctaFeatureIcon} />
              <span>Setup in 2 minutes</span>
            </div>

          </div>

          <div className={styles.ctaActions}>
            <button onClick={onSignUp} className={styles.ctaButton}>
              <FaRocket className={styles.ctaButtonIcon} />
              Start Creating Invoices Free
              <FaArrowRight className={styles.ctaButtonArrow} />
            </button>

            <div className={styles.ctaTrust}>
              <div className={styles.securityBadges}>
                <div className={styles.securityBadge}>
                  <FaLock className={styles.securityIcon} />
                  <span>SSL Secured</span>
                </div>
                <div className={styles.securityBadge}>
                  <FaShieldAlt className={styles.securityIcon} />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.ctaBackground}>
          <div className={styles.ctaFloatingElement}></div>
          <div className={styles.ctaFloatingElement}></div>
          <div className={styles.ctaFloatingElement}></div>
        </div>
      </section>

      {/* Sticky CTA for mobile */}
      <div className={styles.stickyCta}>
        <button onClick={onSignUp} className={styles.stickyCtaButton}>
          <FaRocket /> Start Free
        </button>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© {new Date().getFullYear()} Invoice Direct. All rights reserved.</p>
          <p>Developed by <a href="https://pixelpro.solutions" target="_blank" rel="noopener noreferrer">Pixelpro Solutions</a></p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

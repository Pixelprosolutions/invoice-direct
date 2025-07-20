import React from 'react'
import styles from './LandingPage.module.css'
import {
  FaFileInvoiceDollar,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaRocket,
  FaCheck,
  FaStar,
  FaClock,
  FaDownload,
  FaPalette,
  FaGlobe,
  FaMobile,
  FaQuoteLeft,
  FaArrowRight,
  FaPlay
} from 'react-icons/fa'

const LandingPage = ({ onSignUp, onSignIn }) => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            ✨ Trusted by 10,000+ professionals worldwide
          </div>
          <h1 className={styles.heroTitle}>
            Create Professional <span className={styles.highlight}>Invoices</span> in Seconds
          </h1>
          <p className={styles.heroSubtitle}>
            The fastest way to create, send, and track professional invoices. Beautiful templates, automated workflows, and powerful analytics - all in one simple platform.
            Start free with 3 invoices, then scale with unlimited access for just $9/month.
          </p>
          <div className={styles.heroActions}>
            <button onClick={onSignUp} className={styles.primaryButton}>
              <FaRocket /> Start Creating Invoices Free
            </button>
          </div>
          <div className={styles.heroTrust}>
            Join thousands of businesses streamlining their invoicing
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <strong>50,000+</strong>
              <span>Invoices Generated</span>
            </div>
            <div className={styles.stat}>
              <strong>$10M+</strong>
              <span>Revenue Processed</span>
            </div>
            <div className={styles.stat}>
              <strong>4.8/5</strong>
              <span>Customer Rating</span>
            </div>
            <div className={styles.stat}>
              <strong>2 min</strong>
              <span>Average Setup</span>
            </div>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.mockupContainer}>
            <div className={styles.invoiceMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.mockupLogo}></div>
                <div className={styles.mockupTitle}>INVOICE</div>
              </div>
              <div className={styles.mockupContent}>
                <div className={styles.mockupLine}></div>
                <div className={styles.mockupLine}></div>
                <div className={styles.mockupLine}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={styles.socialProof}>
        <div className={styles.container}>
          <p className={styles.socialProofText}>Trusted by professionals at</p>
          <div className={styles.logoGrid}>
            <div className={styles.companyLogo}>TechCorp</div>
            <div className={styles.companyLogo}>DesignStudio</div>
            <div className={styles.companyLogo}>ConsultPro</div>
            <div className={styles.companyLogo}>FreelanceHub</div>
            <div className={styles.companyLogo}>StartupLab</div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className={styles.problemSolution}>
        <div className={styles.container}>
          <div className={styles.problemSection}>
            <h2>Invoicing Shouldn't Be This Hard</h2>
            <div className={styles.problemList}>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>⏰</span>
                <span>Hours wasted on manual invoice creation and formatting</span>
              </div>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>💸</span>
                <span>Lost revenue from delayed payments and follow-ups</span>
              </div>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>🤯</span>
                <span>Juggling multiple tools and spreadsheets</span>
              </div>
            </div>
          </div>
          <div className={styles.solutionSection}>
            <h2>We Make It Simple</h2>
            <div className={styles.solutionList}>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>⚡</span>
                <span>Generate beautiful invoices in under 2 minutes</span>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>🚀</span>
                <span>Get paid 40% faster with smart automation</span>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>📈</span>
                <span>Complete visibility into your business finances</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Everything You Need to Get Paid Faster</h2>
            <p>Powerful features designed to streamline your entire invoicing workflow</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaClock />
              </div>
              <h3>Quick Invoice Creation</h3>
              <p>Simple form-based invoice creation with all the essential fields you need to get paid professionally.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaFileInvoiceDollar />
              </div>
              <h3>Professional PDF Output</h3>
              <p>Generate clean, professional-looking invoices that you can download as PDF or print directly.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaPalette />
              </div>
              <h3>Basic Customization</h3>
              <p>Add your business details, logo, and customize colors to match your brand identity.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaDownload />
              </div>
              <h3>Easy Download & Share</h3>
              <p>Download your invoices as PDF files or share them directly with your clients via email.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaShieldAlt />
              </div>
              <h3>Secure & Private</h3>
              <p>Your data is stored securely with user authentication. Only you can access your invoice information.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaMobile />
              </div>
              <h3>Mobile Ready</h3>
              <p>Works perfectly on desktop, tablet, and mobile devices. Create invoices from anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Start Invoicing in 3 Simple Steps</h2>
            <p>No complex setup required. Get started in minutes, not hours.</p>
          </div>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Set Up Your Profile</h3>
              <p>Add your business information once. We'll automatically include it in all your invoices.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Create Your Invoice</h3>
              <p>Add line items, set payment terms, and customize the design to match your brand perfectly.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Send & Track</h3>
              <p>Send instantly via email or download as PDF. Monitor payment status and get paid faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Loved by Thousands of Professionals</h2>
            <p>See why businesses choose Invoice Direct for their invoicing needs</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p>"This tool has completely transformed how I handle invoicing. What used to take me hours now takes minutes. Absolutely game-changing!"</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorInfo}>
                  <strong>Sarah Chen</strong>
                  <span>Freelance Designer</span>
                </div>
                <div className={styles.rating}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p>"The professional templates make such a difference. My clients are impressed and I'm getting paid faster than ever before."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorInfo}>
                  <strong>Mike Rodriguez</strong>
                  <span>Marketing Consultant</span>
                </div>
                <div className={styles.rating}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p>"Finally, an invoicing tool that just works. Clean, simple, and incredibly powerful. Couldn't be happier with my choice."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorInfo}>
                  <strong>Emma Thompson</strong>
                  <span>Web Developer</span>
                </div>
                <div className={styles.rating}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Choose Your Plan</h2>
            <p>Start free and upgrade when you need more. Simple, transparent pricing.</p>
          </div>
          
          <div className={styles.pricingCards}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Free Forever</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>0</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p className={styles.pricingSubtext}>Perfect for getting started</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> 3 invoices per month</li>
                <li><FaCheck /> Basic invoice template</li>
                <li><FaCheck /> PDF download</li>
                <li><FaCheck /> Add your logo</li>
                <li><FaCheck /> Basic customization</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Get Started Free
              </button>
              <p className={styles.noCard}>No credit card required</p>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>🔥 Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Premium</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>10</span>
                  <span className={styles.period}>lifetime</span>
                </div>
                <p className={styles.pricingSubtext}>One-time payment</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> <strong>Unlimited invoices</strong></li>
                <li><FaCheck /> Custom branding</li>
                <li><FaCheck /> Remove watermarks</li>
                <li><FaCheck /> Invoice history</li>
                <li><FaCheck /> Advanced customization</li>
                <li><FaCheck /> Priority support</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Start Free Trial
              </button>
              <p className={styles.noCard}>Start with 3 free invoices</p>
            </div>
          </div>
          
          <div className={styles.pricingFooter}>
            <p>💡 <strong>Pro tip:</strong> Start free and upgrade when you need unlimited invoices!</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faq}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got answers to help you get started.</p>
          </div>
          
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How do I create my first invoice?</h3>
              <p>Simply fill out the invoice form with your business details, client information, and line items. Then download as PDF or share directly.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I customize invoices with my branding?</h3>
              <p>Yes! You can upload your logo and customize colors to match your brand. Premium users get additional customization options.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Is my data secure?</h3>
              <p>Yes! We use Supabase for secure data storage with user authentication. Your invoice data is private and only accessible by you.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I save my invoices?</h3>
              <p>Premium users can save and access their invoice history. Free users can download their invoices as PDF files for their records.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>What formats can I export invoices in?</h3>
              <p>Currently, you can download invoices as PDF files, which is the most common format for professional invoicing.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>What happens after I use my 3 free invoices?</h3>
              <p>You can upgrade to Premium for unlimited invoices, or wait until next month when your free quota resets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Invoicing?</h2>
            <p>Join thousands of professionals who've already streamlined their business with Invoice Direct</p>
            <div className={styles.ctaStats}>
              <div className={styles.ctaStat}>
                <strong>Simple</strong>
                <span>Easy to use</span>
              </div>
              <div className={styles.ctaStat}>
                <strong>Professional</strong>
                <span>Clean PDF output</span>
              </div>
              <div className={styles.ctaStat}>
                <strong>Secure</strong>
                <span>Your data is safe</span>
              </div>
            </div>
            <div className={styles.ctaActions}>
              <button onClick={onSignUp} className={styles.ctaButton}>
                <FaRocket /> Create Your First Invoice Free
              </button>
              <p className={styles.ctaSubtext}>
                ✅ No credit card required &nbsp;&nbsp; ✅ 3 free invoices &nbsp;&nbsp; ✅ Ready in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage

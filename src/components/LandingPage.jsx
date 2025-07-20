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
            🚀 Trusted by 10,000+ professionals worldwide
          </div>
          <h1 className={styles.heroTitle}>
            Stop Wasting Time on <span className={styles.highlight}>Invoice Creation</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Generate professional invoices in under 30 seconds. No design skills needed.
            Start free with 3 invoices, then scale with unlimited access for just $9/month.
          </p>
          <div className={styles.heroActions}>
            <button onClick={onSignUp} className={styles.primaryButton}>
              <FaRocket /> Start Free - No Credit Card Required
            </button>
            <button className={styles.demoButton}>
              <FaPlay /> Watch 2-min Demo
            </button>
          </div>
          <div className={styles.heroTrust}>
            <span>Join 500+ businesses already using Invoice Direct</span>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <strong>10,000+</strong>
              <span>Invoices Generated</span>
            </div>
            <div className={styles.stat}>
              <strong>$2.5M+</strong>
              <span>Processed</span>
            </div>
            <div className={styles.stat}>
              <strong>4.8/5</strong>
              <span>User Rating</span>
            </div>
            <div className={styles.stat}>
              <strong>30 sec</strong>
              <span>Avg. Creation Time</span>
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
            <h2>Tired of Complicated Invoicing?</h2>
            <div className={styles.problemList}>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>😤</span>
                <span>Spending hours on invoice design and formatting</span>
              </div>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>💸</span>
                <span>Losing money on delayed or forgotten invoices</span>
              </div>
              <div className={styles.problemItem}>
                <span className={styles.problemIcon}>📊</span>
                <span>No clear overview of your business finances</span>
              </div>
            </div>
          </div>
          <div className={styles.solutionSection}>
            <h2>Invoice Direct Solves This</h2>
            <div className={styles.solutionList}>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>⚡</span>
                <span>Create professional invoices in 30 seconds</span>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>💰</span>
                <span>Get paid faster with automated reminders</span>
              </div>
              <div className={styles.solutionItem}>
                <span className={styles.solutionIcon}>📈</span>
                <span>Track all payments and revenue in one place</span>
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
            <p>Professional invoicing tools that save you time and help you get paid quicker</p>
          </div>
          
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaClock />
              </div>
              <h3>30-Second Creation</h3>
              <p>Generate professional invoices faster than making coffee. Our streamlined process gets you from start to send in seconds.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaPalette />
              </div>
              <h3>Beautiful Templates</h3>
              <p>Choose from professionally designed templates that make your business look established and trustworthy.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaUsers />
              </div>
              <h3>Smart Client Management</h3>
              <p>Save client details once, reuse forever. Build a database of customers for lightning-fast repeat invoicing.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaDownload />
              </div>
              <h3>Instant PDF Export</h3>
              <p>Download professional PDFs instantly or send directly to clients via email with one click.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaChartLine />
              </div>
              <h3>Payment Tracking</h3>
              <p>Never lose track of who owes what. Monitor payment status and send automated reminders.</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <FaMobile />
              </div>
              <h3>Works Everywhere</h3>
              <p>Create invoices on any device - desktop, tablet, or mobile. Your business never stops, neither do we.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Get Your First Invoice Done in 3 Simple Steps</h2>
            <p>No learning curve. No complicated setup. Just results.</p>
          </div>
          
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Add Your Details</h3>
              <p>Enter your business info and client details. We'll save everything for next time.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Choose Template</h3>
              <p>Pick from our professional templates and customize colors to match your brand.</p>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Send & Get Paid</h3>
              <p>Download PDF or send directly to your client. Track when they view and pay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What Our Users Say</h2>
            <p>Join thousands of professionals who've streamlined their invoicing</p>
          </div>
          
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonial}>
              <div className={styles.testimonialContent}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p>"Invoice Direct saved me 5 hours per week. I can now focus on my actual work instead of paperwork."</p>
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
                <p>"My clients love the professional look. I've been paid 40% faster since switching to Invoice Direct."</p>
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
                <p>"Simple, fast, and professional. Everything I needed in an invoicing tool without the complexity."</p>
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
            <p>Start free, upgrade when you're ready. No hidden fees, cancel anytime.</p>
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
                <p className={styles.pricingSubtext}>Perfect for trying us out</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> 3 invoices per month</li>
                <li><FaCheck /> Professional templates</li>
                <li><FaCheck /> PDF download</li>
                <li><FaCheck /> Email support</li>
                <li><FaCheck /> Basic analytics</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Start Free Forever
              </button>
              <p className={styles.noCard}>No credit card required</p>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>🔥 Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Professional</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>9</span>
                  <span className={styles.period}>/month</span>
                </div>
                <p className={styles.pricingSubtext}>For serious professionals</p>
              </div>
              <ul className={styles.featuresList}>
                <li><FaCheck /> <strong>Unlimited invoices</strong></li>
                <li><FaCheck /> All premium templates</li>
                <li><FaCheck /> Custom branding & logo</li>
                <li><FaCheck /> Advanced analytics</li>
                <li><FaCheck /> Payment tracking</li>
                <li><FaCheck /> Automated reminders</li>
                <li><FaCheck /> Priority support</li>
                <li><FaCheck /> Export to Excel/CSV</li>
              </ul>
              <button onClick={onSignUp} className={styles.pricingButton}>
                Start 14-Day Free Trial
              </button>
              <p className={styles.noCard}>Cancel anytime, no questions asked</p>
            </div>
          </div>
          
          <div className={styles.pricingFooter}>
            <p>💡 <strong>Pro tip:</strong> Most users upgrade after creating their 2nd invoice. Start free and see why!</p>
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
              <h3>How quickly can I create my first invoice?</h3>
              <p>Most users create their first professional invoice in under 2 minutes. Our streamlined process guides you through each step.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I customize the invoice templates?</h3>
              <p>Absolutely! Add your logo, change colors, modify layouts, and personalize every aspect to match your brand.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Is my data secure?</h3>
              <p>Yes. We use bank-level encryption and never store payment information. Your data is backed up automatically and kept private.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I track if clients have viewed my invoices?</h3>
              <p>With our Professional plan, you get detailed analytics showing when invoices are viewed, downloaded, and paid.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>What payment methods can I accept?</h3>
              <p>You can add payment instructions for bank transfers, PayPal, Stripe, or any payment method you prefer.</p>
            </div>
            
            <div className={styles.faqItem}>
              <h3>Can I cancel anytime?</h3>
              <p>Yes! Cancel your subscription anytime with one click. No questions asked, no cancellation fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Get Paid Faster?</h2>
            <p>Join 10,000+ professionals who've already streamlined their invoicing with Invoice Direct</p>
            <div className={styles.ctaStats}>
              <div className={styles.ctaStat}>
                <strong>30 seconds</strong>
                <span>Average creation time</span>
              </div>
              <div className={styles.ctaStat}>
                <strong>40% faster</strong>
                <span>Payment collection</span>
              </div>
              <div className={styles.ctaStat}>
                <strong>5 hours</strong>
                <span>Saved per week</span>
              </div>
            </div>
            <div className={styles.ctaActions}>
              <button onClick={onSignUp} className={styles.ctaButton}>
                <FaRocket /> Start Free - Create Your First Invoice Now
              </button>
              <p className={styles.ctaSubtext}>
                ✅ No credit card required &nbsp;&nbsp; ✅ 3 free invoices &nbsp;&nbsp; ✅ Setup in 2 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default LandingPage

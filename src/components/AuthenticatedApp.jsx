import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import styles from './AuthenticatedApp.module.css'
import InvoiceForm from './InvoiceForm'
import InvoicePreview from './InvoicePreview'
import InvoiceHistory from './InvoiceHistory'
import ClientManagement from './ClientManagement'
import BusinessProfile from './BusinessProfile'
import TemplateManager from './TemplateManager'
import QuickActions from './QuickActions'
import MobileFeaturesHub from './MobileFeaturesHub'
import QuickInvoiceForm from './QuickInvoiceForm'
import PaymentStatusUpdater from './PaymentStatusUpdater'
import PaymentTracking from './PaymentTracking'
import Reports from './Reports'
import OverdueAlerts from './OverdueAlerts'
import AppStatusChecker from './AppStatusChecker'
import FloatingActionButton from './FloatingActionButton'
import Modal from './Modal'
import UserDashboard from './UserDashboard'
import MVPStatusChecker from './MVPStatusChecker'
import ConfigChecker from './ConfigChecker'
import DatabaseSetupChecker from './DatabaseSetupChecker'
import StripeCheckout from './StripeCheckout'
import PaymentSuccess from './PaymentSuccess'
import { FaUser, FaHome, FaFileInvoice, FaHistory, FaSignOutAlt, FaUsers, FaBuilding, FaPalette, FaBolt, FaMobile, FaCreditCard, FaChartBar, FaCog, FaCamera, FaCrown, FaPlus, FaRocket, FaGem, FaDatabase } from 'react-icons/fa'

const AuthenticatedApp = () => {
  const [activeView, setActiveView] = useState('home')
  const [showPreview, setShowPreview] = useState(false)
  const [showUserDashboard, setShowUserDashboard] = useState(false)
  const [showMobileFeatures, setShowMobileFeatures] = useState(false)
  const [showQuickInvoice, setShowQuickInvoice] = useState(false)
  const [showPaymentStatus, setShowPaymentStatus] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const { user, canCreateInvoice, getRemainingInvoices, signOut, forceSignOut, isPremium } = useAuth()

  // Check for payment success on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('session_id')) {
      setShowPaymentSuccess(true)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])
  // Check if current user is valid for database operations
  const isValidUser = user && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  const handleCreateInvoice = () => {
    if (!canCreateInvoice()) {
      toast.warning(`You have reached your free invoice limit (3 invoices). Please upgrade to continue.`);
      setShowUpgradeModal(true)
      return
    }
    
    setActiveView('create')
  }

  const handlePreviewInvoice = () => {
    if (!canCreateInvoice()) {
      toast.warning(`You have reached your free invoice limit (3 invoices). Please upgrade to continue.`);
      setShowUpgradeModal(true)
      return
    }
    
    setShowPreview(true)
  }

  const handleSignOut = async () => {
    try {
      signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      // Force reload as fallback
      window.location.reload()
    }
  }

  const handleUpgradeSuccess = () => {
    setShowUpgradeModal(false)
    toast.success('🎉 Welcome to Lifetime Access!')
  }

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <section className={styles.formSection}>
            <InvoiceForm onPreview={handlePreviewInvoice} onNavigateHome={() => setActiveView('home')} />
          </section>
        )
      case 'history':
        return <InvoiceHistory setActiveView={setActiveView} onNavigateHome={() => setActiveView('home')} />
      case 'clients':
        return <ClientManagement onNavigateHome={() => setActiveView('home')} />
      case 'business':
        return <BusinessProfile onNavigateHome={() => setActiveView('home')} />
      case 'templates':
        return <TemplateManager onNavigateHome={() => setActiveView('home')} />
      case 'payments':
        return <PaymentTracking onNavigateHome={() => setActiveView('home')} />
      case 'reports':
        return <Reports onNavigateHome={() => setActiveView('home')} />
      case 'status':
        return <AppStatusChecker />
      case 'test':
        return <MVPStatusChecker />
      case 'config':
        return <ConfigChecker />
      case 'payment-success':
        return <PaymentSuccess onContinue={() => setActiveView('home')} />
      default:
        return (
          <div className={styles.homeContent}>
            {/* Hero Welcome Section */}
            <div className={styles.heroSection}>
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1>Welcome back!</h1>
                  <p>Create professional invoices and manage your business finances</p>
                </div>
                <div className={styles.heroActions}>
                  <button onClick={handleCreateInvoice} className={styles.primaryCta}>
                    <FaPlus />
                    Create Invoice
                  </button>
                  <button onClick={() => setActiveView('history')} className={styles.secondaryCta}>
                    <FaHistory />
                    View History
                  </button>
                </div>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaRocket />
                  </div>
                  <div className={styles.statContent}>
                    <h3>{getRemainingInvoices() === Infinity ? '∞' : getRemainingInvoices()}</h3>
                    <p>Invoices Remaining</p>
                  </div>
                </div>
                {isPremium() && (
                  <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                      <FaGem />
                    </div>
                    <div className={styles.statContent}>
                      <h3>Premium</h3>
                      <p>Lifetime Access</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <QuickActions
              onCreateInvoice={handleCreateInvoice}
              onSetActiveView={setActiveView}
            />

            {/* Main Navigation Grid */}
            <div className={styles.navigationGrid}>
              {/* Core Features */}
              <div className={styles.featureSection}>
                <h2>
                  <FaFileInvoice />
                  Invoice Management
                </h2>
                <div className={styles.featureCards}>
                  <div className={styles.featureCard} onClick={handleCreateInvoice}>
                    <div className={styles.cardIcon}>
                      <FaPlus />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Create Invoice</h3>
                      <p>Generate professional invoices with custom branding</p>
                    </div>
                    <div className={styles.cardArrow}>→</div>
                  </div>
                  
                  <div className={styles.featureCard} onClick={() => setActiveView('history')}>
                    <div className={styles.cardIcon}>
                      <FaHistory />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Invoice History</h3>
                      <p>View, edit, and manage all your past invoices</p>
                    </div>
                    <div className={styles.cardArrow}>→</div>
                  </div>
                </div>
              </div>

              {/* Business Management */}
              <div className={styles.featureSection}>
                <h2>
                  <FaBuilding />
                  Business Management
                </h2>
                <div className={styles.featureCards}>
                  <div 
                    className={`${styles.featureCard} ${!isPremium() ? styles.premiumCard : ''}`}
                    onClick={() => {
                      if (!isPremium()) {
                        toast.warning('Client management is available for Lifetime Access users. Upgrade to unlock!');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setActiveView('clients');
                    }}
                  >
                    <div className={styles.cardIcon}>
                      <FaUsers />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Client Management</h3>
                      <p>Organize and track your client relationships</p>
                    </div>
                    {!isPremium() && <div className={styles.premiumBadge}><FaCrown /> Premium</div>}
                    <div className={styles.cardArrow}>→</div>
                  </div>
                  
                  <div className={styles.featureCard} onClick={() => setActiveView('business')}>
                    <div className={styles.cardIcon}>
                      <FaBuilding />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Business Profile</h3>
                      <p>Configure your company information and settings</p>
                    </div>
                    <div className={styles.cardArrow}>→</div>
                  </div>
                </div>
              </div>

              {/* Analytics & Tracking */}
              <div className={styles.featureSection}>
                <h2>
                  <FaChartBar />
                  Analytics & Tracking
                </h2>
                <div className={styles.featureCards}>
                  <div 
                    className={`${styles.featureCard} ${!isPremium() ? styles.premiumCard : ''}`}
                    onClick={() => {
                      if (!isPremium()) {
                        toast.warning('Payment tracking is available for Lifetime Access users. Upgrade to unlock!');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setActiveView('payments');
                    }}
                  >
                    <div className={styles.cardIcon}>
                      <FaCreditCard />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Payment Tracking</h3>
                      <p>Monitor payment status and send reminders</p>
                    </div>
                    {!isPremium() && <div className={styles.premiumBadge}><FaCrown /> Premium</div>}
                    <div className={styles.cardArrow}>→</div>
                  </div>
                  
                  <div 
                    className={`${styles.featureCard} ${!isPremium() ? styles.premiumCard : ''}`}
                    onClick={() => {
                      if (!isPremium()) {
                        toast.warning('Reports & analytics are available for Lifetime Access users. Upgrade to unlock!');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setActiveView('reports');
                    }}
                  >
                    <div className={styles.cardIcon}>
                      <FaChartBar />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Business Reports</h3>
                      <p>Revenue analytics and financial insights</p>
                    </div>
                    {!isPremium() && <div className={styles.premiumBadge}><FaCrown /> Premium</div>}
                    <div className={styles.cardArrow}>→</div>
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div className={styles.featureSection}>
                <h2>
                  <FaPalette />
                  Customization
                </h2>
                <div className={styles.featureCards}>
                  <div 
                    className={`${styles.featureCard} ${!isPremium() ? styles.premiumCard : ''}`}
                    onClick={() => {
                      if (!isPremium()) {
                        toast.warning('Advanced templates are available for Lifetime Access users. Upgrade to unlock!');
                        setShowUpgradeModal(true);
                        return;
                      }
                      setActiveView('templates');
                    }}
                  >
                    <div className={styles.cardIcon}>
                      <FaPalette />
                    </div>
                    <div className={styles.cardContent}>
                      <h3>Invoice Templates</h3>
                      <p>Customize your invoice design and branding</p>
                    </div>
                    {!isPremium() && <div className={styles.premiumBadge}><FaCrown /> Premium</div>}
                    <div className={styles.cardArrow}>→</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className={styles.mobileSection}>
              <h2>
                <FaMobile />
                Mobile Features
              </h2>
              <div className={styles.mobileCards}>
                <div className={styles.mobileCard} onClick={() => setShowQuickInvoice(true)}>
                  <FaBolt />
                  <span>Quick Invoice</span>
                </div>
                <div className={styles.mobileCard} onClick={() => setShowQuickInvoice(true)}>
                  <FaCamera />
                  <span>Photo Expenses</span>
                </div>
                <div className={styles.mobileCard} onClick={() => setShowPaymentStatus(true)}>
                  <FaCreditCard />
                  <span>Payment Status</span>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.authenticatedApp}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 onClick={() => setActiveView('home')} className={styles.logo}>Invoice Direct</h1>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowUserDashboard(true)}
            className={styles.userButton}
            title={`User Dashboard - ${user.email}`}
          >
            <FaUser />
          </button>
          {!isPremium() && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className={styles.upgradeButton}
              title="Upgrade to Lifetime Access"
            >
              <FaCrown />
            </button>
          )}
          <button
            onClick={handleSignOut}
            className={styles.logoutButton}
            title="Sign Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {isSupabaseConfigured && !isValidUser && (
        <div className={styles.errorBanner}>
          <p>
            <strong>Session Error:</strong> Your current session is not compatible with the database.
            Please sign in with a valid account.
            <button
              onClick={forceSignOut}
              className={styles.signOutLink}
            >
              Sign Out & Continue →
            </button>
          </p>
        </div>
      )}

      {!isSupabaseConfigured && (
        <div className={styles.devBanner}>
          <p>
            <strong>Development Mode:</strong> Running without database.
            Data is stored locally and will be lost on browser refresh.
            <a
              href="https://github.com/supabase/supabase"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.configLink}
            >
              Configure Supabase →
            </a>
          </p>
        </div>
      )}

      {!canCreateInvoice() && (
        <div className={styles.limitBanner}>
          <div className={styles.limitContent}>
            <div className={styles.limitText}>
              <strong>Free Plan Limit Reached</strong>
              <span>You've used all 3 free invoices this month</span>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className={styles.upgradeLink}
            >
              <FaCrown />
              Upgrade to Lifetime Access - $10
            </button>
          </div>
        </div>
      )}

      <OverdueAlerts onNavigateToPayments={() => setActiveView('payments')} />

      <main className={styles.main}>
        {renderContent()}
      </main>

      {showPreview && (
        <Modal onClose={() => setShowPreview(false)}>
          <InvoicePreview />
        </Modal>
      )}

      {showUserDashboard && (
        <Modal onClose={() => setShowUserDashboard(false)}>
          <UserDashboard onClose={() => setShowUserDashboard(false)} />
        </Modal>
      )}

      {showMobileFeatures && (
        <Modal onClose={() => setShowMobileFeatures(false)}>
          <MobileFeaturesHub onClose={() => setShowMobileFeatures(false)} />
        </Modal>
      )}

      {showQuickInvoice && (
        <Modal onClose={() => setShowQuickInvoice(false)}>
          <QuickInvoiceForm
            onClose={() => setShowQuickInvoice(false)}
            onComplete={() => {
              setShowQuickInvoice(false);
              setActiveView('create');
            }}
          />
        </Modal>
      )}

      {showPaymentStatus && (
        <Modal onClose={() => setShowPaymentStatus(false)}>
          <PaymentStatusUpdater onClose={() => setShowPaymentStatus(false)} />
        </Modal>
      )}

      {showUpgradeModal && (
        <Modal onClose={() => setShowUpgradeModal(false)}>
          <StripeCheckout
            isOpen={showUpgradeModal}
            onSuccess={handleUpgradeSuccess}
            onCancel={() => setShowUpgradeModal(false)}
          />
        </Modal>
      )}

      {showPaymentSuccess && (
        <Modal onClose={() => setShowPaymentSuccess(false)}>
          <PaymentSuccess onContinue={() => {
            setShowPaymentSuccess(false)
            setActiveView('home')
          }} />
        </Modal>
      )}
      <FloatingActionButton
        onQuickInvoice={() => setShowQuickInvoice(true)}
        onPhotoExpense={() => setShowQuickInvoice(true)}
        onPaymentStatus={() => setShowPaymentStatus(true)}
        onMobileHub={() => setShowMobileFeatures(true)}
      />
    </div>
  )
}

export default AuthenticatedApp
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
import { FaUser, FaHome, FaFileInvoice, FaHistory, FaSignOutAlt, FaUsers, FaBuilding, FaPalette, FaBolt, FaMobile, FaCreditCard, FaChartBar, FaCog } from 'react-icons/fa'

const AuthenticatedApp = () => {
  const [activeView, setActiveView] = useState('home')
  const [showPreview, setShowPreview] = useState(false)
  const [showUserDashboard, setShowUserDashboard] = useState(false)
  const [showMobileFeatures, setShowMobileFeatures] = useState(false)
  const [showQuickInvoice, setShowQuickInvoice] = useState(false)
  const [showPaymentStatus, setShowPaymentStatus] = useState(false)
  const { user, canCreateInvoice, getRemainingInvoices, signOut, forceSignOut } = useAuth()

  // Check if current user is valid for database operations
  const isValidUser = user && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)
  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY

  const handleCreateInvoice = () => {
    if (!canCreateInvoice()) {
      toast.warning('You have reached your free invoice limit. Please upgrade to continue.');
      setShowUserDashboard(true)
      return
    }
    
    setActiveView('create')
  }

  const handlePreviewInvoice = () => {
    if (!canCreateInvoice()) {
      toast.warning('You have reached your free invoice limit. Please upgrade to continue.');
      setShowUserDashboard(true)
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

  const renderContent = () => {
    switch (activeView) {
      case 'create':
        return (
          <section className={styles.formSection}>
            <InvoiceForm onPreview={handlePreviewInvoice} />
          </section>
        )
      case 'history':
        return <InvoiceHistory setActiveView={setActiveView} />
      case 'clients':
        return <ClientManagement />
      case 'business':
        return <BusinessProfile onNavigateHome={() => setActiveView('home')} />
      case 'templates':
        return <TemplateManager />
      case 'payments':
        return <PaymentTracking />
      case 'reports':
        return <Reports />
      case 'status':
        return <AppStatusChecker />
      case 'test':
        return <MVPStatusChecker />
      case 'config':
        return <ConfigChecker />
      default:
        return (
          <div className={styles.homeContent}>
            <div className={styles.welcomeSection}>
              <h2>Welcome back!</h2>
              <p>Create professional invoices for your business</p>
              {canCreateInvoice() && (
                <div className={styles.remainingInvoices}>
                  {getRemainingInvoices() === Infinity ? (
                    <span className={styles.premium}>Premium Account - Unlimited Invoices</span>
                  ) : (
                    <span>
                      {getRemainingInvoices()} free invoice{getRemainingInvoices() !== 1 ? 's' : ''} remaining
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions Section */}
            <QuickActions
              onCreateInvoice={handleCreateInvoice}
              onSetActiveView={setActiveView}
            />

            {/* Grouped Navigation Sections */}
            <div className={styles.navigationSections}>
              {/* Invoices Section */}
              <div className={styles.navigationSection}>
                <h3 className={styles.sectionTitle}>
                  <FaFileInvoice className={styles.sectionIcon} />
                  Invoices
                </h3>
                <div className={styles.sectionCards}>
                  <div className={styles.actionCard} onClick={handleCreateInvoice}>
                    <div className={styles.actionIcon}>
                      <FaFileInvoice />
                    </div>
                    <h4>Create</h4>
                    <p>Generate professional invoices</p>
                  </div>
                  <div className={styles.actionCard} onClick={() => setActiveView('history')}>
                    <div className={styles.actionIcon}>
                      <FaHistory />
                    </div>
                    <h4>History</h4>
                    <p>View and manage past invoices</p>
                  </div>
                </div>
              </div>

              {/* Manage Section */}
              <div className={styles.navigationSection}>
                <h3 className={styles.sectionTitle}>
                  <FaCog className={styles.sectionIcon} />
                  Manage
                </h3>
                <div className={styles.sectionCards}>
                  <div
                    className={`${styles.actionCard} ${user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity ? styles.premiumFeature : ''}`}
                    onClick={() => {
                      if (user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity) {
                        toast.warning('Client management is available for lifetime users. Upgrade to unlock!');
                        setShowUserDashboard(true);
                        return;
                      }
                      setActiveView('clients');
                    }}
                  >
                    <div className={styles.actionIcon}>
                      <FaUsers />
                    </div>
                    <h4>Clients</h4>
                    <p>Organize client information</p>
                    {user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity && (
                      <div className={styles.premiumBadge}>Premium</div>
                    )}
                  </div>
                  <div
                    className={`${styles.actionCard} ${user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity ? styles.premiumFeature : ''}`}
                    onClick={() => {
                      if (user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity) {
                        toast.warning('Payment tracking is available for lifetime users. Upgrade to unlock!');
                        setShowUserDashboard(true);
                        return;
                      }
                      setActiveView('payments');
                    }}
                  >
                    <div className={styles.actionIcon}>
                      <FaCreditCard />
                    </div>
                    <h4>Payments</h4>
                    <p>Track payment status</p>
                    {user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity && (
                      <div className={styles.premiumBadge}>Premium</div>
                    )}
                  </div>
                  <div
                    className={`${styles.actionCard} ${user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity ? styles.premiumFeature : ''}`}
                    onClick={() => {
                      if (user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity) {
                        toast.warning('Reports & analytics are available for lifetime users. Upgrade to unlock!');
                        setShowUserDashboard(true);
                        return;
                      }
                      setActiveView('reports');
                    }}
                  >
                    <div className={styles.actionIcon}>
                      <FaChartBar />
                    </div>
                    <h4>Reports</h4>
                    <p>Revenue and analytics</p>
                    {user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity && (
                      <div className={styles.premiumBadge}>Premium</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Features Section */}
              <div className={styles.navigationSection}>
                <h3 className={styles.sectionTitle}>
                  <FaMobile className={styles.sectionIcon} />
                  Mobile Features
                </h3>
                <div className={styles.sectionCards}>
                  <div className={styles.actionCard} onClick={() => setShowMobileFeatures(true)}>
                    <div className={styles.actionIcon}>
                      <FaBolt />
                    </div>
                    <h4>Quick Invoice</h4>
                    <p>Fast mobile invoice creation</p>
                  </div>
                  <div className={styles.actionCard} onClick={() => setShowMobileFeatures(true)}>
                    <div className={styles.actionIcon}>
                      <FaMobile />
                    </div>
                    <h4>Mobile Hub</h4>
                    <p>All mobile-optimized tools</p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className={styles.navigationSection}>
                <h3 className={styles.sectionTitle}>
                  <FaCog className={styles.sectionIcon} />
                  Settings
                </h3>
                <div className={styles.sectionCards}>
                  <div
                    className={`${styles.actionCard} ${user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity ? styles.premiumFeature : ''}`}
                    onClick={() => {
                      if (user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity) {
                        toast.warning('Advanced templates are available for lifetime users. Upgrade to unlock!');
                        setShowUserDashboard(true);
                        return;
                      }
                      setActiveView('templates');
                    }}
                  >
                    <div className={styles.actionIcon}>
                      <FaPalette />
                    </div>
                    <h4>Templates</h4>
                    <p>Customize invoice designs</p>
                    {user && getRemainingInvoices() <= 3 && getRemainingInvoices() !== Infinity && (
                      <div className={styles.premiumBadge}>Premium</div>
                    )}
                  </div>
                  <div className={styles.actionCard} onClick={() => setActiveView('business')}>
                    <div className={styles.actionIcon}>
                      <FaBuilding />
                    </div>
                    <h4>Business</h4>
                    <p>Company profile settings</p>
                  </div>
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
          <p>
            You've reached your free invoice limit.
            <button
              onClick={() => setShowUserDashboard(true)}
              className={styles.upgradeLink}
            >
              Upgrade to Premium - $10 Lifetime
            </button>
          </p>
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

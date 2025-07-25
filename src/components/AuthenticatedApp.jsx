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
        return <BusinessProfile />
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

            <div className={styles.quickActions}>
              <div className={styles.actionCard} onClick={handleCreateInvoice}>
                <div className={styles.actionIcon}>
                  <FaFileInvoice />
                </div>
                <h3>Create New Invoice</h3>
                <p>Generate a professional invoice in seconds</p>
              </div>
              
              <div className={styles.actionCard} onClick={() => setActiveView('history')}>
                <div className={styles.actionIcon}>
                  <FaHistory />
                </div>
                <h3>Invoice History</h3>
                <p>View and manage your past invoices</p>
              </div>

              <div className={styles.actionCard} onClick={() => setActiveView('clients')}>
                <div className={styles.actionIcon}>
                  <FaUsers />
                </div>
                <h3>Manage Clients</h3>
                <p>Add and organize your client information</p>
              </div>

              <div className={styles.actionCard} onClick={() => setActiveView('templates')}>
                <div className={styles.actionIcon}>
                  <FaPalette />
                </div>
                <h3>Invoice Templates</h3>
                <p>Choose professional designs for your invoices</p>
              </div>

              <div className={styles.actionCard} onClick={() => setShowMobileFeatures(true)}>
                <div className={styles.actionIcon}>
                  <FaMobile />
                </div>
                <h3>Mobile Features</h3>
                <p>Quick invoice creation and mobile-optimized tools</p>
              </div>

              <div className={styles.actionCard} onClick={() => setActiveView('payments')}>
                <div className={styles.actionIcon}>
                  <FaCreditCard />
                </div>
                <h3>Payment Tracking</h3>
                <p>Monitor payment status and send reminders</p>
              </div>

              <div className={styles.actionCard} onClick={() => setActiveView('reports')}>
                <div className={styles.actionIcon}>
                  <FaChartBar />
                </div>
                <h3>App Status Check</h3>
                <p>Check features and populate test data</p>
              </div>
            </div>
            
            <div className={styles.actionCard} onClick={() => setActiveView('test')}>
              <div className={styles.actionIcon}>
                <FaFileInvoice />
              </div>
              <h3>Test MVP Features</h3>
              <p>Check if all features are working properly</p>
            </div>
            
            <div className={styles.actionCard} onClick={() => setActiveView('config')}>
              <div className={styles.actionIcon}>
                <FaFileInvoice />
              </div>
              <h3>Check Supabase Config</h3>
              <p>Verify database and authentication setup</p>
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
          <nav className={styles.navigation}>
            <button
              className={`${styles.navButton} ${activeView === 'home' ? styles.active : ''}`}
              onClick={() => setActiveView('home')}
            >
              <FaHome />
              <span className={styles.navText}>Home</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'create' ? styles.active : ''}`}
              onClick={handleCreateInvoice}
            >
              <FaFileInvoice />
              <span className={styles.navText}>Create</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'history' ? styles.active : ''}`}
              onClick={() => setActiveView('history')}
            >
              <FaHistory />
              <span className={styles.navText}>History</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'clients' ? styles.active : ''}`}
              onClick={() => setActiveView('clients')}
            >
              <FaUsers />
              <span className={styles.navText}>Clients</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'payments' ? styles.active : ''}`}
              onClick={() => setActiveView('payments')}
            >
              <FaCreditCard />
              <span className={styles.navText}>Payments</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'reports' ? styles.active : ''}`}
              onClick={() => setActiveView('reports')}
            >
              <FaChartBar />
              <span className={styles.navText}>Reports</span>
            </button>

            <button
              className={`${styles.navButton} ${activeView === 'templates' ? styles.active : ''}`}
              onClick={() => setActiveView('templates')}
            >
              <FaPalette />
              <span className={styles.navText}>Templates</span>
            </button>
            <button
              className={`${styles.navButton} ${activeView === 'business' ? styles.active : ''}`}
              onClick={() => setActiveView('business')}
            >
              <FaBuilding />
              <span className={styles.navText}>Business</span>
            </button>
          </nav>
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

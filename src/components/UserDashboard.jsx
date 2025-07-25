import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './UserDashboard.module.css'
import { FaUser, FaCrown, FaFileInvoice, FaChartLine, FaCheckCircle, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import StripeCheckout from './StripeCheckout'
import { STRIPE_CONFIG } from '../stripe-config'

const UserDashboard = ({ onClose }) => {
  const { user, userProfile, isPremium, getRemainingInvoices } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showStripeCheckout, setShowStripeCheckout] = useState(false)

  const product = STRIPE_CONFIG.products.lifetimeAccess
  const remainingInvoices = getRemainingInvoices()
  const usagePercentage = userProfile ?
    (userProfile.invoice_count / (isPremium() ? 100 : 3)) * 100 : 0

  const handleUpgradeClick = () => {
    setShowUpgradeModal(false)
    setShowStripeCheckout(true)
  }

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult)
    toast.success('🎉 Welcome to Premium! Your account has been upgraded.')
    setShowStripeCheckout(false)
    // Close the dashboard to let user see the updated UI
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const handlePaymentCancel = () => {
    setShowStripeCheckout(false)
    setShowUpgradeModal(true)
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.userInfo} style={{ width: '100%', justifyContent: 'center' }}>
          <div className={styles.avatar}>
            <FaUser />
          </div>
          <div className={styles.userDetails}>
            <h3>{user?.email}</h3>
            <div className={styles.planBadge}>
              {isPremium() ? (
                <span className={styles.premiumBadge}>
                  <FaCrown /> Premium
                </span>
              ) : (
                <span className={styles.freeBadge}>Free Plan</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaFileInvoice />
          </div>
          <div className={styles.statContent}>
            <h4>Invoices Left</h4>
            <p className={styles.statNumber}>{userProfile?.invoice_count || 0}</p>
          </div>
        </div>

        {!isPremium() && (
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaChartLine />
            </div>
            <div className={styles.statContent}>
              <h4>Remaining</h4>
              <p className={styles.statNumber}>
                {remainingInvoices === Infinity ? '∞' : remainingInvoices}
              </p>
            </div>
          </div>
        )}
      </div>

      {!isPremium() && (
        <div className={styles.usageSection}>
          <h4>Free Plan Usage</h4>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className={styles.usageText}>
            {userProfile?.invoice_count || 0} of 3 invoices used this month
          </p>
          
          {remainingInvoices === 0 && (
            <div className={styles.limitReached}>
              <p>You've reached your free invoice limit!</p>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className={styles.upgradeButton}
              >
                <FaCrown /> Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      )}

      {!isPremium() && remainingInvoices > 0 && (
        <div className={styles.upgradePromo}>
          <h4>🚀 Unlock Premium Features</h4>
          <ul className={styles.featureList}>
            <li>✓ Unlimited invoices</li>
            <li>✓ Custom branding & logo</li>
            <li>✓ Remove watermarks</li>
            <li>✓ Advanced templates</li>
            <li>✓ Invoice history</li>
          </ul>
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className={styles.upgradeButton}
          >
            <FaCrown /> Upgrade Now
          </button>
        </div>
      )}

      {isPremium() && (
        <div className={styles.premiumFeatures}>
          <h4>✨ Premium Features Active</h4>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>∞</span>
              <span>Unlimited Invoices</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🎨</span>
              <span>Custom Branding</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📄</span>
              <span>No Watermarks</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <span>Invoice History</span>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className={styles.upgradeModal}>
          <div className={styles.upgradeContent}>
            <h3>Upgrade to Premium</h3>
            <div className={styles.pricingCard}>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                <span className={styles.amount}>10</span>
                <span className={styles.period}>lifetime</span>
              </div>
              <p>{product.description}</p>
            </div>
            
            <ul className={styles.upgradeFeatures}>
              <li>✓ Unlimited invoice generation</li>
              <li>✓ Upload your company logo</li>
              <li>✓ Custom colors and branding</li>
              <li>✓ Remove "Powered by" watermark</li>
              <li>✓ Access to all templates</li>
              <li>✓ Save and manage invoice history</li>
              <li>✓ Priority customer support</li>
            </ul>

            <div className={styles.upgradeActions}>
              <button
                onClick={handleUpgradeClick}
                className={styles.checkoutButton}
              >
                Upgrade Now - ${(product.price / 100).toFixed(0)} Lifetime
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className={styles.cancelButton}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <StripeCheckout
        isOpen={showStripeCheckout}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    </div>
  )
}

export default UserDashboard

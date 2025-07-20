import React from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Watermark.module.css'

const Watermark = ({ className = '' }) => {
  const { isPremium } = useAuth()

  // Don't render watermark for premium users
  if (isPremium()) {
    return null
  }

  return (
    <div className={`${styles.watermark} ${className}`}>
      <span className={styles.watermarkText}>
        Created with Invoice Direct
      </span>
    </div>
  )
}

export default Watermark

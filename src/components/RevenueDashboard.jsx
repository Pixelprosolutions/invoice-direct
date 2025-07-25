import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './RevenueDashboard.module.css';
import { 
  FaDollarSign, 
  FaChartLine, 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaEquals,
  FaEye,
  FaFilter,
  FaDownload,
  FaPrint,
  FaRedo,

  FaMoneyBillWave,
  FaWallet,
  FaHandHoldingUsd
} from 'react-icons/fa';

const RevenueDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadRevenueData();
  }, [refreshKey]);

  const loadRevenueData = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      setInvoices(savedInvoices);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      toast.error('Failed to load revenue data');
    }
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems || !Array.isArray(lineItems)) return 0;
    return lineItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  };

  const isOverdue = (invoice) => {
    if (!invoice.invoiceData?.dueDate || invoice.invoiceData?.status === 'paid') return false;
    const dueDate = new Date(invoice.invoiceData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const getRevenueData = () => {
    const currentDate = new Date();
    const currentYear = selectedYear;
    const currentMonth = selectedMonth;

    let totalRevenue = 0;
    let paidRevenue = 0;
    let pendingRevenue = 0;
    let overdueRevenue = 0;
    let invoiceCount = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    const monthlyData = {};
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        month: i,
        monthName: new Date(currentYear, i - 1, 1).toLocaleDateString('en-US', { month: 'long' }),
        revenue: 0,
        paid: 0,
        pending: 0,
        count: 0
      };
    }

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      const total = calculateTotal(invoice.invoiceData?.lineItems);
      const isPaid = invoice.invoiceData?.status === 'paid';
      const invoiceOverdue = isOverdue(invoice);

      // Filter by selected period
      if (selectedPeriod === 'year' && invoiceDate.getFullYear() === currentYear) {
        const month = invoiceDate.getMonth() + 1;
        monthlyData[month].revenue += total;
        monthlyData[month].count += 1;
        
        if (isPaid) {
          monthlyData[month].paid += total;
        } else {
          monthlyData[month].pending += total;
        }

        totalRevenue += total;
        invoiceCount += 1;

        if (isPaid) {
          paidRevenue += total;
          paidCount += 1;
        } else if (invoiceOverdue) {
          overdueRevenue += total;
          overdueCount += 1;
        } else {
          pendingRevenue += total;
          pendingCount += 1;
        }
      } else if (
        selectedPeriod === 'month' && 
        invoiceDate.getFullYear() === currentYear && 
        invoiceDate.getMonth() + 1 === currentMonth
      ) {
        totalRevenue += total;
        invoiceCount += 1;

        if (isPaid) {
          paidRevenue += total;
          paidCount += 1;
        } else if (invoiceOverdue) {
          overdueRevenue += total;
          overdueCount += 1;
        } else {
          pendingRevenue += total;
          pendingCount += 1;
        }
      }
    });

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueRevenue,
      invoiceCount,
      paidCount,
      pendingCount,
      overdueCount,
      monthlyData: Object.values(monthlyData),
      collectionRate: totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0
    };
  };

  const getOutstandingPayments = () => {
    return invoices
      .filter(invoice => invoice.invoiceData?.status !== 'paid')
      .map(invoice => ({
        ...invoice,
        total: calculateTotal(invoice.invoiceData?.lineItems),
        overdue: isOverdue(invoice),
        daysOverdue: isOverdue(invoice) ? Math.ceil((new Date() - new Date(invoice.invoiceData?.dueDate)) / (1000 * 60 * 60 * 24)) : 0
      }))
      .sort((a, b) => {
        // Sort overdue first, then by due date
        if (a.overdue && !b.overdue) return -1;
        if (!a.overdue && b.overdue) return 1;
        return new Date(a.invoiceData?.dueDate) - new Date(b.invoiceData?.dueDate);
      })
      .slice(0, 10); // Top 10 outstanding
  };

  const getRecentPayments = () => {
    return invoices
      .filter(invoice => invoice.invoiceData?.status === 'paid' && invoice.invoiceData?.paymentDate)
      .map(invoice => ({
        ...invoice,
        total: calculateTotal(invoice.invoiceData?.lineItems),
        paymentDate: invoice.invoiceData?.paymentDate
      }))
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
      .slice(0, 10); // 10 most recent payments
  };

  const getGrowthComparison = () => {
    const currentYear = selectedYear;
    const previousYear = currentYear - 1;
    
    const currentYearRevenue = invoices
      .filter(invoice => new Date(invoice.date).getFullYear() === currentYear)
      .reduce((sum, invoice) => sum + calculateTotal(invoice.invoiceData?.lineItems), 0);
    
    const previousYearRevenue = invoices
      .filter(invoice => new Date(invoice.date).getFullYear() === previousYear)
      .reduce((sum, invoice) => sum + calculateTotal(invoice.invoiceData?.lineItems), 0);

    const growth = previousYearRevenue > 0 ? 
      ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100 : 0;

    return {
      currentYear: currentYearRevenue,
      previousYear: previousYearRevenue,
      growth,
      isPositive: growth >= 0
    };
  };

  const exportData = (data, filename) => {
    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filename} exported successfully!`);
  };

  const revenueData = getRevenueData();
  const outstandingPayments = getOutstandingPayments();
  const recentPayments = getRecentPayments();
  const growthData = getGrowthComparison();

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };

  const getMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      name: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })
    }));
  };

  return (
    <div className={styles.revenueDashboard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            <FaDollarSign /> Revenue Dashboard
          </h1>
          <p>Comprehensive revenue tracking and payment insights</p>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.periodSelector}>
            <button 
              className={`${styles.periodButton} ${selectedPeriod === 'month' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Monthly
            </button>
            <button 
              className={`${styles.periodButton} ${selectedPeriod === 'year' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Yearly
            </button>
          </div>

          <div className={styles.dateSelectors}>
            {selectedPeriod === 'month' && (
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className={styles.dateSelect}
              >
                {getMonthOptions().map(month => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            )}
            
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.dateSelect}
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <button 
            className={styles.refreshButton}
            onClick={() => setRefreshKey(prev => prev + 1)}
            title="Refresh data"
          >
            <FaRedo />
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#059669' }}>
            <FaDollarSign />
          </div>
          <div className={styles.metricContent}>
            <h3>${revenueData.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
            <span className={styles.period}>
              {selectedPeriod === 'year' ? selectedYear : `${getMonthOptions()[selectedMonth - 1]?.name} ${selectedYear}`}
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#10b981' }}>
            <FaCheckCircle />
          </div>
          <div className={styles.metricContent}>
            <h3>${revenueData.paidRevenue.toFixed(2)}</h3>
            <p>Collected Revenue</p>
            <span className={styles.percentage}>
              {revenueData.collectionRate.toFixed(1)}% collection rate
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#f59e0b' }}>
            <FaClock />
          </div>
          <div className={styles.metricContent}>
            <h3>${revenueData.pendingRevenue.toFixed(2)}</h3>
            <p>Pending Revenue</p>
            <span className={styles.count}>{revenueData.pendingCount} invoices</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#dc2626' }}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.metricContent}>
            <h3>${revenueData.overdueRevenue.toFixed(2)}</h3>
            <p>Overdue Revenue</p>
            <span className={styles.count}>{revenueData.overdueCount} invoices</span>
          </div>
        </div>
      </div>

      {/* Growth Comparison */}
      <div className={styles.growthCard}>
        <h3>
          <FaChartLine /> Year-over-Year Growth
        </h3>
        <div className={styles.growthContent}>
          <div className={styles.growthStats}>
            <div className={styles.growthStat}>
              <span className={styles.year}>{selectedYear}</span>
              <span className={styles.amount}>${growthData.currentYear.toFixed(2)}</span>
            </div>
            <div className={styles.growthIndicator}>
              {growthData.isPositive ? (
                <FaArrowUp className={styles.positive} />
              ) : growthData.growth === 0 ? (
                <FaEquals className={styles.neutral} />
              ) : (
                <FaArrowDown className={styles.negative} />
              )}
              <span className={`${styles.growthPercent} ${growthData.isPositive ? styles.positive : growthData.growth === 0 ? styles.neutral : styles.negative}`}>
                {Math.abs(growthData.growth).toFixed(1)}%
              </span>
            </div>
            <div className={styles.growthStat}>
              <span className={styles.year}>{selectedYear - 1}</span>
              <span className={styles.amount}>${growthData.previousYear.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {selectedPeriod === 'year' && (
        <div className={styles.chartSection}>
          <h3>
            <FaChartLine /> Monthly Revenue Breakdown - {selectedYear}
          </h3>
          <div className={styles.revenueChart}>
            {revenueData.monthlyData.map(month => {
              const maxRevenue = Math.max(...revenueData.monthlyData.map(m => m.revenue));
              return (
                <div key={month.month} className={styles.chartBar}>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.revenueBar}
                      style={{ 
                        height: maxRevenue > 0 ? `${(month.revenue / maxRevenue) * 200}px` : '0px' 
                      }}
                      title={`${month.monthName}: $${month.revenue.toFixed(2)}`}
                    >
                      <div 
                        className={styles.paidBar}
                        style={{ 
                          height: month.revenue > 0 ? `${(month.paid / month.revenue) * 100}%` : '0%' 
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.barLabel}>
                    <span className={styles.monthLabel}>{month.monthName.slice(0, 3)}</span>
                    <span className={styles.amountLabel}>${month.revenue.toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e5e7eb' }}></div>
              <span>Total Revenue</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#10b981' }}></div>
              <span>Collected</span>
            </div>
          </div>
        </div>
      )}

      {/* Outstanding Payments */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>
            <FaWallet /> Outstanding Payments
          </h3>
          <button 
            className={styles.exportButton}
            onClick={() => exportData(outstandingPayments.map(p => ({
              'Invoice Number': p.invoiceData?.invoiceNumber || 'N/A',
              'Client': p.invoiceData?.clientName || 'Unknown',
              'Amount': p.total,
              'Due Date': p.invoiceData?.dueDate || 'N/A',
              'Days Overdue': p.daysOverdue,
              'Status': p.overdue ? 'Overdue' : 'Pending'
            })), 'outstanding_payments')}
          >
            <FaDownload /> Export
          </button>
        </div>

        <div className={styles.paymentsList}>
          {outstandingPayments.length === 0 ? (
            <div className={styles.emptyState}>
              <FaCheckCircle className={styles.emptyIcon} />
              <h4>All payments collected!</h4>
              <p>No outstanding payments at this time</p>
            </div>
          ) : (
            outstandingPayments.map(payment => (
              <div key={payment.id} className={`${styles.paymentItem} ${payment.overdue ? styles.overdue : ''}`}>
                <div className={styles.paymentInfo}>
                  <h4>{payment.invoiceData?.invoiceNumber || 'N/A'}</h4>
                  <p className={styles.clientName}>{payment.invoiceData?.clientName || 'Unknown Client'}</p>
                  <p className={styles.dueDate}>
                    <FaCalendarAlt /> Due: {new Date(payment.invoiceData?.dueDate).toLocaleDateString()}
                    {payment.overdue && (
                      <span className={styles.overdueBadge}>
                        {payment.daysOverdue} days overdue
                      </span>
                    )}
                  </p>
                </div>
                <div className={styles.paymentAmount}>
                  <span className={styles.amount}>${payment.total.toFixed(2)}</span>
                  <div className={`${styles.statusBadge} ${payment.overdue ? styles.overdue : styles.pending}`}>
                    {payment.overdue ? <FaExclamationTriangle /> : <FaClock />}
                    {payment.overdue ? 'OVERDUE' : 'PENDING'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {outstandingPayments.length > 0 && (
          <div className={styles.outstandingSummary}>
            <div className={styles.summaryItem}>
              <span>Total Outstanding:</span>
              <strong>${outstandingPayments.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Overdue Amount:</span>
              <strong className={styles.overdue}>
                ${outstandingPayments.filter(p => p.overdue).reduce((sum, p) => sum + p.total, 0).toFixed(2)}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>
            <FaHandHoldingUsd /> Recent Payments Received
          </h3>
          <button 
            className={styles.exportButton}
            onClick={() => exportData(recentPayments.map(p => ({
              'Invoice Number': p.invoiceData?.invoiceNumber || 'N/A',
              'Client': p.invoiceData?.clientName || 'Unknown',
              'Amount': p.total,
              'Payment Date': p.paymentDate,
              'Invoice Date': new Date(p.date).toLocaleDateString()
            })), 'recent_payments')}
          >
            <FaDownload /> Export
          </button>
        </div>

        <div className={styles.paymentsList}>
          {recentPayments.length === 0 ? (
            <div className={styles.emptyState}>
              <FaMoneyBillWave className={styles.emptyIcon} />
              <h4>No recent payments</h4>
              <p>Recent payments will appear here once invoices are marked as paid</p>
            </div>
          ) : (
            recentPayments.map(payment => (
              <div key={payment.id} className={styles.paymentItem}>
                <div className={styles.paymentInfo}>
                  <h4>{payment.invoiceData?.invoiceNumber || 'N/A'}</h4>
                  <p className={styles.clientName}>{payment.invoiceData?.clientName || 'Unknown Client'}</p>
                  <p className={styles.paymentDate}>
                    <FaCheckCircle className={styles.paidIcon} /> 
                    Paid: {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.paymentAmount}>
                  <span className={styles.amount}>${payment.total.toFixed(2)}</span>
                  <div className={`${styles.statusBadge} ${styles.paid}`}>
                    <FaCheckCircle />
                    PAID
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {recentPayments.length > 0 && (
          <div className={styles.recentSummary}>
            <div className={styles.summaryItem}>
              <span>Recent Total (Last 10):</span>
              <strong>${recentPayments.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Average Payment:</span>
              <strong>
                ${recentPayments.length > 0 ? (recentPayments.reduce((sum, p) => sum + p.total, 0) / recentPayments.length).toFixed(2) : '0.00'}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueDashboard;

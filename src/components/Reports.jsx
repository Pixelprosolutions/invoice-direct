import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import RevenueDashboard from './RevenueDashboard';
import styles from './Reports.module.css';
import { 
  FaChartBar, 
  FaCalendarAlt, 
  FaFileAlt, 
  FaUsers, 
  FaDownload,
  FaFilter,
  FaDollarSign,
  FaPercentage,

  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPrint,
  FaFileExport,
  FaChartLine,
  FaChartPie
} from 'react-icons/fa';

const Reports = () => {
  const [invoices, setInvoices] = useState([]);
  const [activeReport, setActiveReport] = useState('income');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadInvoicesData();
  }, []);

  const loadInvoicesData = () => {
    try {
      const savedInvoices = JSON.parse(localStorage.getItem('savedInvoices') || '[]');
      setInvoices(savedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoice data');
    }
  };

  const calculateTotal = (lineItems) => {
    if (!lineItems || !Array.isArray(lineItems)) return 0;
    return lineItems.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  };

  const getMonthlyIncomeData = () => {
    const monthlyData = {};
    const currentYear = selectedYear;

    // Initialize all months with zero
    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        month: i,
        monthName: new Date(currentYear, i - 1, 1).toLocaleDateString('en-US', { month: 'long' }),
        totalIncome: 0,
        paidIncome: 0,
        pendingIncome: 0,
        invoiceCount: 0,
        paidCount: 0,
        pendingCount: 0
      };
    }

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      const invoiceYear = invoiceDate.getFullYear();
      const invoiceMonth = invoiceDate.getMonth() + 1;

      if (invoiceYear === currentYear) {
        const total = calculateTotal(invoice.invoiceData?.lineItems);
        const isPaid = invoice.invoiceData?.status === 'paid';

        monthlyData[invoiceMonth].totalIncome += total;
        monthlyData[invoiceMonth].invoiceCount += 1;

        if (isPaid) {
          monthlyData[invoiceMonth].paidIncome += total;
          monthlyData[invoiceMonth].paidCount += 1;
        } else {
          monthlyData[invoiceMonth].pendingIncome += total;
          monthlyData[invoiceMonth].pendingCount += 1;
        }
      }
    });

    return Object.values(monthlyData);
  };

  const getTopClientsByRevenue = () => {
    const clientData = {};

    invoices.forEach(invoice => {
      const clientName = invoice.invoiceData?.clientName || 'Unknown Client';
      const total = calculateTotal(invoice.invoiceData?.lineItems);
      const isPaid = invoice.invoiceData?.status === 'paid';

      if (!clientData[clientName]) {
        clientData[clientName] = {
          name: clientName,
          totalRevenue: 0,
          paidRevenue: 0,
          pendingRevenue: 0,
          invoiceCount: 0,
          paidCount: 0,
          pendingCount: 0,
          lastInvoiceDate: invoice.date
        };
      }

      clientData[clientName].totalRevenue += total;
      clientData[clientName].invoiceCount += 1;

      if (isPaid) {
        clientData[clientName].paidRevenue += total;
        clientData[clientName].paidCount += 1;
      } else {
        clientData[clientName].pendingRevenue += total;
        clientData[clientName].pendingCount += 1;
      }

      // Update last invoice date if this is more recent
      if (new Date(invoice.date) > new Date(clientData[clientName].lastInvoiceDate)) {
        clientData[clientName].lastInvoiceDate = invoice.date;
      }
    });

    return Object.values(clientData)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10); // Top 10 clients
  };

  const getTaxReadyExpenseData = () => {
    const expenseData = [];

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.date);
      
      // Check if invoice is within selected date range
      if (invoiceDate >= new Date(dateRange.start) && invoiceDate <= new Date(dateRange.end)) {
        const lineItems = invoice.invoiceData?.lineItems || [];
        
        lineItems.forEach(item => {
          expenseData.push({
            date: invoice.date,
            invoiceNumber: invoice.invoiceData?.invoiceNumber || 'N/A',
            client: invoice.invoiceData?.clientName || 'Unknown',
            description: item.description || 'No description',
            category: item.category || 'General',
            amount: parseFloat(item.total) || 0,
            status: invoice.invoiceData?.status || 'unpaid',
            taxDeductible: true // Assuming all business expenses are tax deductible
          });
        });
      }
    });

    return expenseData.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
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

  const printReport = () => {
    window.print();
    toast.success('Print dialog opened');
  };

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

  const renderIncomeReport = () => {
    const monthlyData = getMonthlyIncomeData();
    const totalYearIncome = monthlyData.reduce((sum, month) => sum + month.totalIncome, 0);
    const totalPaidIncome = monthlyData.reduce((sum, month) => sum + month.paidIncome, 0);
    const totalPendingIncome = monthlyData.reduce((sum, month) => sum + month.pendingIncome, 0);

    const maxIncome = Math.max(...monthlyData.map(m => m.totalIncome));

    return (
      <div className={styles.reportContent}>
        <div className={styles.reportHeader}>
          <h2>
            <FaChartLine /> Monthly Income Summary - {selectedYear}
          </h2>
          <div className={styles.yearSelector}>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.yearSelect}
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#059669' }}>
              <FaDollarSign />
            </div>
            <div className={styles.cardContent}>
              <h3>${totalYearIncome.toFixed(2)}</h3>
              <p>Total Income {selectedYear}</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#10b981' }}>
              <FaArrowUp />
            </div>
            <div className={styles.cardContent}>
              <h3>${totalPaidIncome.toFixed(2)}</h3>
              <p>Paid Income</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#f59e0b' }}>
              <FaArrowDown />
            </div>
            <div className={styles.cardContent}>
              <h3>${totalPendingIncome.toFixed(2)}</h3>
              <p>Pending Income</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#6366f1' }}>
              <FaPercentage />
            </div>
            <div className={styles.cardContent}>
              <h3>{totalYearIncome > 0 ? ((totalPaidIncome / totalYearIncome) * 100).toFixed(1) : 0}%</h3>
              <p>Collection Rate</p>
            </div>
          </div>
        </div>

        <div className={styles.chartContainer}>
          <h3>Monthly Breakdown</h3>
          <div className={styles.barChart}>
            {monthlyData.map(month => (
              <div key={month.month} className={styles.barGroup}>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.totalBar}
                    style={{ 
                      height: maxIncome > 0 ? `${(month.totalIncome / maxIncome) * 200}px` : '0px' 
                    }}
                    title={`Total: $${month.totalIncome.toFixed(2)}`}
                  >
                    <div 
                      className={styles.paidBar}
                      style={{ 
                        height: month.totalIncome > 0 ? `${(month.paidIncome / month.totalIncome) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                </div>
                <div className={styles.barLabel}>
                  <span className={styles.monthName}>{month.monthName.slice(0, 3)}</span>
                  <span className={styles.amount}>${month.totalIncome.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e5e7eb' }}></div>
              <span>Total Income</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#059669' }}></div>
              <span>Paid Income</span>
            </div>
          </div>
        </div>

        <div className={styles.detailTable}>
          <h3>Monthly Details</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Income</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Invoices</th>
                <th>Collection Rate</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map(month => (
                <tr key={month.month}>
                  <td>{month.monthName}</td>
                  <td>${month.totalIncome.toFixed(2)}</td>
                  <td>${month.paidIncome.toFixed(2)}</td>
                  <td>${month.pendingIncome.toFixed(2)}</td>
                  <td>{month.invoiceCount}</td>
                  <td>
                    {month.totalIncome > 0 ? ((month.paidIncome / month.totalIncome) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.exportActions}>
          <button 
            className={styles.exportButton}
            onClick={() => exportToCSV(monthlyData, 'monthly_income_report')}
          >
            <FaDownload /> Export CSV
          </button>
          <button 
            className={styles.printButton}
            onClick={printReport}
          >
            <FaPrint /> Print Report
          </button>
        </div>
      </div>
    );
  };

  const renderExpenseReport = () => {
    const expenseData = getTaxReadyExpenseData();
    const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryTotals = expenseData.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return (
      <div className={styles.reportContent}>
        <div className={styles.reportHeader}>
          <h2>
            <FaFileAlt /> Tax-Ready Expense Report
          </h2>
          <div className={styles.dateRangeSelector}>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className={styles.dateInput}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className={styles.dateInput}
            />
          </div>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#dc2626' }}>
              <FaDollarSign />
            </div>
            <div className={styles.cardContent}>
              <h3>${totalExpenses.toFixed(2)}</h3>
              <p>Total Expenses</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#7c3aed' }}>
              <FaFileAlt />
            </div>
            <div className={styles.cardContent}>
              <h3>{expenseData.length}</h3>
              <p>Expense Items</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#0891b2' }}>
              <FaChartPie />
            </div>
            <div className={styles.cardContent}>
              <h3>{Object.keys(categoryTotals).length}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>

        <div className={styles.categoryBreakdown}>
          <h3>Expenses by Category</h3>
          <div className={styles.categoryList}>
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className={styles.categoryItem}>
                  <span className={styles.categoryName}>{category}</span>
                  <span className={styles.categoryAmount}>${amount.toFixed(2)}</span>
                  <div className={styles.categoryPercentage}>
                    {((amount / totalExpenses) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.detailTable}>
          <h3>Expense Details</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.slice(0, 50).map((expense, index) => (
                <tr key={index}>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.invoiceNumber}</td>
                  <td>{expense.client}</td>
                  <td>{expense.description}</td>
                  <td>{expense.category}</td>
                  <td>${expense.amount.toFixed(2)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[expense.status]}`}>
                      {expense.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenseData.length > 50 && (
            <p className={styles.tableNote}>
              Showing first 50 items. Export CSV for complete data.
            </p>
          )}
        </div>

        <div className={styles.exportActions}>
          <button 
            className={styles.exportButton}
            onClick={() => exportToCSV(expenseData, 'tax_expense_report')}
          >
            <FaDownload /> Export for Tax Preparation
          </button>
          <button 
            className={styles.printButton}
            onClick={printReport}
          >
            <FaPrint /> Print Report
          </button>
        </div>
      </div>
    );
  };

  const renderClientReport = () => {
    const clientData = getTopClientsByRevenue();
    const totalRevenue = clientData.reduce((sum, client) => sum + client.totalRevenue, 0);

    return (
      <div className={styles.reportContent}>
        <div className={styles.reportHeader}>
          <h2>
            <FaUsers /> Top Clients by Revenue
          </h2>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#059669' }}>
              <FaUsers />
            </div>
            <div className={styles.cardContent}>
              <h3>{clientData.length}</h3>
              <p>Active Clients</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#dc2626' }}>
              <FaDollarSign />
            </div>
            <div className={styles.cardContent}>
              <h3>${totalRevenue.toFixed(2)}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className={styles.summaryCard}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#7c3aed' }}>
              <FaArrowUp />
            </div>
            <div className={styles.cardContent}>
              <h3>${clientData.length > 0 ? (totalRevenue / clientData.length).toFixed(2) : '0.00'}</h3>
              <p>Average per Client</p>
            </div>
          </div>
        </div>

        <div className={styles.clientRanking}>
          <h3>Client Revenue Ranking</h3>
          <div className={styles.clientList}>
            {clientData.map((client, index) => (
              <div key={client.name} className={styles.clientItem}>
                <div className={styles.clientRank}>#{index + 1}</div>
                <div className={styles.clientInfo}>
                  <h4>{client.name}</h4>
                  <p>{client.invoiceCount} invoice{client.invoiceCount !== 1 ? 's' : ''}</p>
                  <p>Last invoice: {new Date(client.lastInvoiceDate).toLocaleDateString()}</p>
                </div>
                <div className={styles.clientStats}>
                  <div className={styles.revenueBar}>
                    <div 
                      className={styles.revenueProgress}
                      style={{ 
                        width: totalRevenue > 0 ? `${(client.totalRevenue / totalRevenue) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <div className={styles.clientAmounts}>
                    <span className={styles.totalRevenue}>${client.totalRevenue.toFixed(2)}</span>
                    <span className={styles.paidRevenue}>Paid: ${client.paidRevenue.toFixed(2)}</span>
                    {client.pendingRevenue > 0 && (
                      <span className={styles.pendingRevenue}>Pending: ${client.pendingRevenue.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className={styles.clientPercentage}>
                  {((client.totalRevenue / totalRevenue) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailTable}>
          <h3>Client Details</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Client Name</th>
                <th>Total Revenue</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Invoices</th>
                <th>Avg Invoice</th>
                <th>Last Invoice</th>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client, index) => (
                <tr key={client.name}>
                  <td>#{index + 1}</td>
                  <td>{client.name}</td>
                  <td>${client.totalRevenue.toFixed(2)}</td>
                  <td>${client.paidRevenue.toFixed(2)}</td>
                  <td>${client.pendingRevenue.toFixed(2)}</td>
                  <td>{client.invoiceCount}</td>
                  <td>${(client.totalRevenue / client.invoiceCount).toFixed(2)}</td>
                  <td>{new Date(client.lastInvoiceDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.exportActions}>
          <button 
            className={styles.exportButton}
            onClick={() => exportToCSV(clientData, 'top_clients_report')}
          >
            <FaDownload /> Export CSV
          </button>
          <button 
            className={styles.printButton}
            onClick={printReport}
          >
            <FaPrint /> Print Report
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h1>
          <FaChartBar /> Business Reports
        </h1>
        <p>Analyze your business performance with detailed insights</p>
      </div>

      <div className={styles.reportTabs}>
        <button 
          className={`${styles.tab} ${activeReport === 'income' ? styles.active : ''}`}
          onClick={() => setActiveReport('income')}
        >
          <FaChartLine /> Monthly Income
        </button>
        <button 
          className={`${styles.tab} ${activeReport === 'expenses' ? styles.active : ''}`}
          onClick={() => setActiveReport('expenses')}
        >
          <FaFileAlt /> Tax Expenses
        </button>
        <button 
          className={`${styles.tab} ${activeReport === 'clients' ? styles.active : ''}`}
          onClick={() => setActiveReport('clients')}
        >
          <FaUsers /> Top Clients
        </button>
      </div>

      {activeReport === 'income' && renderIncomeReport()}
      {activeReport === 'expenses' && renderExpenseReport()}
      {activeReport === 'clients' && renderClientReport()}
    </div>
  );
};

export default Reports;

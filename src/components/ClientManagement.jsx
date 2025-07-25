import React, { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSearch, FaUsers, FaArrowLeft } from 'react-icons/fa'
import Modal from './Modal'
import AddEditClient from './AddEditClient'
import ClientDetails from './ClientDetails'
import styles from './ClientManagement.module.css'

const ClientManagement = ({ onNavigateHome }) => {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [editingClient, setEditingClient] = useState(null)

  // Load clients from localStorage
  useEffect(() => {
    const savedClients = localStorage.getItem('invoiceClients')
    if (savedClients) {
      const parsedClients = JSON.parse(savedClients)
      setClients(parsedClients)
      setFilteredClients(parsedClients)
    }
  }, [])

  // Filter clients based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredClients(clients)
    } else {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredClients(filtered)
    }
  }, [searchTerm, clients])

  const saveClients = (newClients) => {
    setClients(newClients)
    localStorage.setItem('invoiceClients', JSON.stringify(newClients))
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setShowAddEditModal(true)
  }

  const handleEditClient = (client) => {
    setEditingClient(client)
    setShowAddEditModal(true)
  }

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const newClients = clients.filter(client => client.id !== clientId)
      saveClients(newClients)
    }
  }

  const handleViewClient = (client) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      // Update existing client
      const updatedClients = clients.map(client =>
        client.id === editingClient.id ? { ...clientData, id: editingClient.id } : client
      )
      saveClients(updatedClients)
    } else {
      // Add new client
      const newClient = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      saveClients([...clients, newClient])
    }
    setShowAddEditModal(false)
    setEditingClient(null)
  }

  return (
    <div className={styles.clientManagement}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Client Management</h2>
          <p>Manage your client directory and track payment history</p>
        </div>
        <button onClick={handleAddClient} className={styles.addButton}>
          <FaPlus /> Add Client
        </button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search clients by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>{clients.length}</h3>
          <p>Total Clients</p>
        </div>
        <div className={styles.statCard}>
          <h3>{clients.filter(c => c.status === 'active').length || clients.length}</h3>
          <p>Active Clients</p>
        </div>
        <div className={styles.statCard}>
          <h3>{clients.filter(c => c.lastInvoiceDate).length}</h3>
          <p>Invoiced This Month</p>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className={styles.emptyState}>
          {clients.length === 0 ? (
            <>
              <div className={styles.emptyIcon}>
                <FaUsers />
              </div>
              <h3>No clients yet</h3>
              <p>Start building your client directory by adding your first client</p>
              <button onClick={handleAddClient} className={styles.addButton}>
                <FaPlus /> Add Your First Client
              </button>
            </>
          ) : (
            <>
              <h3>No clients found</h3>
              <p>Try adjusting your search term</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.clientGrid}>
          {filteredClients.map(client => (
            <div key={client.id} className={styles.clientCard}>
              <div className={styles.clientHeader}>
                <div className={styles.clientInfo}>
                  <h3>{client.name}</h3>
                  {client.company && <p className={styles.company}>{client.company}</p>}
                </div>
                <div className={styles.clientActions}>
                  <button
                    onClick={() => handleViewClient(client)}
                    className={styles.actionButton}
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEditClient(client)}
                    className={styles.actionButton}
                    title="Edit Client"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete Client"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className={styles.clientDetails}>
                {client.email && (
                  <div className={styles.contactItem}>
                    <FaEnvelope />
                    <span>{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className={styles.contactItem}>
                    <FaPhone />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className={styles.contactItem}>
                    <FaMapMarkerAlt />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>

              <div className={styles.clientFooter}>
                <div className={styles.clientStatus}>
                  <span className={`${styles.statusBadge} ${styles[client.status || 'active']}`}>
                    {client.status || 'Active'}
                  </span>
                </div>
                <div className={styles.clientStats}>
                  <span>Invoices: {client.invoiceCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddEditModal && (
        <Modal onClose={() => setShowAddEditModal(false)}>
          <AddEditClient
            client={editingClient}
            onSave={handleSaveClient}
            onCancel={() => setShowAddEditModal(false)}
          />
        </Modal>
      )}

      {showDetailsModal && selectedClient && (
        <Modal onClose={() => setShowDetailsModal(false)}>
          <ClientDetails
            client={selectedClient}
            onClose={() => setShowDetailsModal(false)}
            onEdit={() => {
              setShowDetailsModal(false)
              handleEditClient(selectedClient)
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default ClientManagement

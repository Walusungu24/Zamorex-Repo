import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import API from '../../services/api';
import './AdminPanel.css';

function AdminPanel() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await API.get('/admin/products/pending');
        setPendingProducts(res.data.products || []);
      } else {
        const res = await API.get('/admin/users');
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/products/${id}/approve`);
      await fetchData();
    } catch (error) {
      console.error('Error approving product:', error);
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await API.put(`/admin/products/${id}/reject`);
      await fetchData();
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
    setActionLoading(null);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const getRoleIcon = (role) => {
    const icons = {
      admin: '👑',
      farmer: '🌾',
      buyer: '🛒'
    };
    return icons[role] || '👤';
  };

  const getRoleBadgeClass = (role) => {
    return `role-badge role-${role}`;
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="admin-container container">
        <div className="page-header">
          <div>
            <h1>👑 Admin <span>Dashboard</span></h1>
            <p className="subtitle">Manage products and users across the platform</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-number">{pendingProducts.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{users.length}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span className="tab-icon">📋</span>
            Pending Approvals
            {pendingProducts.length > 0 && (
              <span className="tab-badge">{pendingProducts.length}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            Manage Users
            <span className="tab-badge">{users.length}</span>
          </button>
        </div>

        {activeTab === 'pending' && (
          <>
            {pendingProducts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">✅</span>
                <h3>All Clear!</h3>
                <p>No products are currently pending approval. Everything is approved!</p>
              </div>
            ) : (
              <div className="pending-grid">
                {pendingProducts.map(product => (
                  <Card key={product.id} className="pending-card-item">
                    <div className="pending-card">
                      <div className="pending-header">
                        <div className="pending-title">
                          <h3>{product.name}</h3>
                          <span className="pending-badge">⏳ Pending Review</span>
                        </div>
                        <span className="pending-id">#{product.id}</span>
                      </div>
                      <div className="pending-details">
                        <div className="detail-item">
                          <span className="detail-label">Type</span>
                          <span className="detail-value">{product.type}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Price</span>
                          <span className="detail-value">K{product.price}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Quantity</span>
                          <span className="detail-value">{product.quantity}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Farmer ID</span>
                          <span className="detail-value">#{product.farmer_id}</span>
                        </div>
                      </div>
                      <div className="pending-actions">
                        <Button 
                          variant="success" 
                          onClick={() => handleApprove(product.id)}
                          loading={actionLoading === product.id}
                          className="approve-btn"
                        >
                          ✅ Approve
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => handleReject(product.id)}
                          loading={actionLoading === product.id}
                          className="reject-btn"
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="users-toolbar">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <span className="users-count">{filteredUsers.length} users found</span>
            </div>

            <Card className="users-table-card">
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <span className="user-avatar-md">
                              {user.name?.charAt(0) || 'U'}
                            </span>
                            <span className="user-name">{user.name}</span>
                          </div>
                        </td>
                        <td className="user-phone">{user.phone}</td>
                        <td>
                          <span className={getRoleBadgeClass(user.role)}>
                            {getRoleIcon(user.role)} {user.role}
                          </span>
                        </td>
                        <td className="user-joined">
                          {new Date(user.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          {user.role !== 'admin' && (
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                              className="delete-user-btn"
                            >
                              🗑️ Delete
                            </Button>
                          )}
                          {user.role === 'admin' && (
                            <span className="admin-protected">🔒 Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminPanel;
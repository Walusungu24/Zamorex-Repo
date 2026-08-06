import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import API from '../../services/api';
import './FarmerDashboard.css';

function FarmerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: 'vegetables',
    price: '',
    quantity: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products/my-products');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity)
      });
      setShowAddModal(false);
      setNewProduct({ name: '', type: 'vegetables', price: '', quantity: '' });
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      await API.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setDeleting(null);
  };

  const getStatusBadge = (status) => {
    const config = {
      approved: { label: 'Approved', className: 'status-approved' },
      pending: { label: 'Pending', className: 'status-pending' },
      rejected: { label: 'Rejected', className: 'status-rejected' }
    };
    const { label, className } = config[status] || { label: status, className: '' };
    return <span className={`status-badge ${className}`}>{label}</span>;
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your products...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="farmer-container container">
        <div className="page-header">
          <div>
            <h1>🌾 My <span>Products</span></h1>
            <p className="subtitle">Manage your farm products and track their status</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌱</span>
            <h3>No Products Yet</h3>
            <p>Start by adding your first product to the marketplace!</p>
            <Button onClick={() => setShowAddModal(true)} style={{ marginTop: '16px' }}>
              + Add Your First Product
            </Button>
          </div>
        ) : (
          <Card>
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <span className="product-name">{product.name}</span>
                      </td>
                      <td>
                        <span className="product-type">{product.type}</span>
                      </td>
                      <td>
                        <span className="product-price">K{product.price}</span>
                      </td>
                      <td>{product.quantity}</td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          loading={deleting === product.id}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>➕ Add New Product</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAddProduct}>
                <Input
                  label="Product Name"
                  placeholder="e.g. Fresh Organic Tomatoes"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <div className="form-group">
                  <label className="input-label">Category</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="form-select"
                    required
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <Input
                    label="Price (K)"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <Button type="submit" loading={submitting}>
                    Add Product
                  </Button>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FarmerDashboard;
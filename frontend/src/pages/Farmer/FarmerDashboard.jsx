import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import API from '../../services/api';
import './FarmerDashboard.css';

function FarmerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [savingQuantity, setSavingQuantity] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [originalQuantities, setOriginalQuantities] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: '',
    type: 'vegetables',
    price: '',
    quantity: ''
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProducts();
    checkProfileComplete();
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

  const checkProfileComplete = async () => {
    try {
      const res = await API.get('/profiles/check');
      if (!res.data.isComplete) {
        setShowProfilePrompt(true);
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
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
      alert('Failed to add product');
    }
    setSubmitting(false);
  };

  const openEditModal = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      status: product.status
    });
    setShowEditModal(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/products/${editingProduct.id}`, {
        name: editingProduct.name,
        type: editingProduct.type,
        price: parseFloat(editingProduct.price)
      });
      setShowEditModal(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
    setSubmitting(false);
  };

  const handleQuantityChange = (productId, value) => {
    setOriginalQuantities(prev => ({
      ...prev,
      [productId]: prev[productId] !== undefined 
        ? prev[productId] 
        : products.find(p => p.id === productId)?.quantity
    }));

    setProducts(products.map(p =>
      p.id === productId ? { ...p, quantity: value } : p
    ));
  };

  const handleQuantityBlur = async (product) => {
    const newQuantity = parseInt(product.quantity);
    const originalQuantity = parseInt(originalQuantities[product.id]);

    if (isNaN(newQuantity) || newQuantity < 0) {
      alert('Quantity must be a valid number');
      await fetchProducts();
      setOriginalQuantities(prev => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
      return;
    }

    if (newQuantity === originalQuantity) {
      setOriginalQuantities(prev => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
      return;
    }

    setSavingQuantity(product.id);
    try {
      await API.patch(`/products/${product.id}/quantity`, {
        quantity: newQuantity
      });
      await fetchProducts();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
      await fetchProducts();
    } finally {
      setSavingQuantity(null);
      setOriginalQuantities(prev => {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      });
    }
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

  return (
    <>
      <Navbar user={user} />
      <div className="farmer-container container">
        {showProfilePrompt && (
          <div className="profile-prompt">
            <div className="profile-prompt-content">
              <div>
                <h3>Complete Your Profile</h3>
                <p>Add your farm details, location, and WhatsApp number so buyers can find and contact you easily.</p>
              </div>
              <Button onClick={() => navigate('/farmer/profile')}>
                Complete Profile
              </Button>
              <button className="prompt-dismiss" onClick={() => setShowProfilePrompt(false)}>
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="page-header">
          <div>
            <h1>My Products</h1>
            <p className="subtitle">Manage your farm products and track their status</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No Products Yet</h3>
            <p>Start by adding your first product to the marketplace.</p>
            <Button onClick={() => setShowAddModal(true)} style={{ marginTop: '16px' }}>
              Add Your First Product
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
                      <td><span className="product-name">{product.name}</span></td>
                      <td><span className="product-type">{product.type}</span></td>
                      <td><span className="product-price">K{product.price}</span></td>
                      <td>
                        <div className="quantity-editor">
                          <input
                            type="number"
                            min="0"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            onBlur={() => handleQuantityBlur(product)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') e.target.blur();
                            }}
                            className="quantity-input"
                            disabled={savingQuantity === product.id}
                          />
                          {savingQuantity === product.id && (
                            <span className="saving-indicator">Saving</span>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(product.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditModal(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            loading={deleting === product.id}
                          >
                            Delete
                          </Button>
                        </div>
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
                <h2>Add New Product</h2>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
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
                  <Button type="submit" loading={submitting}>Add Product</Button>
                  <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && editingProduct && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Product</h2>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
              </div>

              {editingProduct.status === 'approved' && (
                <div className="edit-warning">
                  Editing this product will reset its status to Pending for re-approval.
                </div>
              )}

              <form onSubmit={handleEditProduct}>
                <Input
                  label="Product Name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required
                />
                <div className="form-group">
                  <label className="input-label">Category</label>
                  <select
                    value={editingProduct.type}
                    onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}
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
                <Input
                  label="Price (K)"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  required
                />
                <p className="hint-text">
                  To update quantity, use the inline editor in the products table.
                </p>
                <div className="modal-actions">
                  <Button type="submit" loading={submitting}>Save Changes</Button>
                  <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
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
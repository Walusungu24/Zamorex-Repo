import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import API from '../../services/api';
import './BuyerDashboard.css';

function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [notifiedProduct, setNotifiedProduct] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products?page=${page}&limit=12`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleContactFarmer = (phone, productName) => {
    setNotifiedProduct(productName);
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      alert(`Farmer's phone number: Contact farmer directly through the platform.`);
    }
    setTimeout(() => setNotifiedProduct(null), 3000);
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading fresh farm products...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="buyer-container container">
        <div className="page-header">
          <div>
            <h1>🛒 Fresh <span>Farm Products</span></h1>
            <p className="subtitle">
              Browse locally grown produce from farmers near you
              {total > 0 && ` • ${total} products available`}
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🌿</span>
            <h3>No Products Available</h3>
            <p>Check back later for fresh farm products from our farmers.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(product => (
                <Card key={product.id} className="product-card">
                  <div className="product-content">
                    <div className="product-header">
                      <h3>{product.name}</h3>
                      <span className="product-type">{product.type}</span>
                    </div>
                    <div className="product-price">K{product.price}</div>
                    <div className="product-meta">
                      <span className="product-stock">📦 Stock: {product.quantity}</span>
                      <span className="product-farmer">👨‍🌾 {product.farmer_name || 'Farmer'}</span>
                    </div>
                    <Button 
                      fullWidth 
                      onClick={() => handleContactFarmer(product.farmer_phone, product.name)}
                    >
                      📞 Contact Farmer
                    </Button>
                    {notifiedProduct === product.name && (
                      <div className="contact-notification">
                        Calling farmer...
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => p - 1)} 
                  disabled={page === 1}
                >
                  ← Previous
                </Button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={page === totalPages}
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default BuyerDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [notifiedProduct, setNotifiedProduct] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `/products?page=${page}&limit=12${debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : ''}`;
      const res = await API.get(url);
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
      alert(`Farmer's phone number is not available.`);
    }
    setTimeout(() => setNotifiedProduct(null), 3000);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <>
      <Navbar user={user} />
      <div className="buyer-container container">
        <div className="page-header">
          <div>
            <h1>Fresh Farm Products</h1>
            <p className="subtitle">
              Browse locally grown produce from farmers near you
              {total > 0 && ` • ${total} products available`}
            </p>
          </div>
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="search-clear" onClick={handleClearSearch}>
                ✕
              </button>
            )}
          </div>
          {debouncedSearch && !loading && (
            <p className="search-results-text">
              Showing results for: <strong>"{debouncedSearch}"</strong>
            </p>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading fresh farm products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>{debouncedSearch ? 'No Products Found' : 'No Products Available'}</h3>
            <p>
              {debouncedSearch
                ? `No products match "${debouncedSearch}". Try a different search term.`
                : 'Check back later for fresh farm products from our farmers.'}
            </p>
            {debouncedSearch && (
              <Button onClick={handleClearSearch} style={{ marginTop: '16px' }}>
                Clear Search
              </Button>
            )}
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
                      <span className="product-stock">Stock: {product.quantity}</span>
                      <span className="product-farmer">
                        <Link to={`/farmer/${product.farmer_id}`} className="farmer-link">
                          {product.farmer_name || 'Farmer'}
                        </Link>
                      </span>
                    </div>
                    <Button 
                      fullWidth 
                      onClick={() => handleContactFarmer(product.farmer_phone, product.name)}
                    >
                      Contact Farmer
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
                  Previous
                </Button>
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="secondary" 
                  onClick={() => setPage(p => p + 1)} 
                  disabled={page === totalPages}
                >
                  Next
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
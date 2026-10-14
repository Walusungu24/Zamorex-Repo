import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import API from '../../services/api';
import './FarmerProfile.css';

function FarmerProfile() {
  const { farmerId } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchFarmerProfile();
  }, [farmerId]);

  const fetchFarmerProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/profiles/farmer/${farmerId}`);
      setFarmer(res.data.farmer);
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    }
    setLoading(false);
  };

  const handleContactWhatsApp = () => {
    if (farmer.whatsapp) {
      window.open(`https://wa.me/${farmer.whatsapp.replace(/\s/g, '')}`, '_blank');
    }
  };

  const handleCall = () => {
    if (farmer.phone) {
      window.location.href = `tel:${farmer.phone}`;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading farmer profile...</p>
        </div>
      </>
    );
  }

  if (!farmer) {
    return (
      <>
        <Navbar user={user} />
        <div className="container">
          <div className="empty-state">
            <h3>Farmer Not Found</h3>
            <p>The farmer you're looking for doesn't exist or has been removed.</p>
            <Link to="/buyer">
              <Button style={{ marginTop: '16px' }}>Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="farmer-profile-container container">
        <BackButton to="/buyer" label="Back to Marketplace" />

        <div className="farmer-profile-header">
          <div className="farmer-avatar">
            {farmer.profile_picture ? (
              <img src={farmer.profile_picture} alt={farmer.name} />
            ) : (
              <div className="avatar-placeholder">
                {farmer.name?.charAt(0) || 'F'}
              </div>
            )}
          </div>
          <div className="farmer-info">
            <h1>{farmer.farm_name || farmer.name}</h1>
            <p className="farmer-name">{farmer.name}</p>
            {farmer.location && (
              <p className="farmer-location">{farmer.location}</p>
            )}
            {farmer.bio && (
              <p className="farmer-bio">{farmer.bio}</p>
            )}
            <div className="farmer-contact">
              {farmer.whatsapp && (
                <Button onClick={handleContactWhatsApp} className="whatsapp-btn">
                  Message on WhatsApp
                </Button>
              )}
              {farmer.phone && (
                <Button variant="secondary" onClick={handleCall}>
                  Call Farmer
                </Button>
              )}
            </div>
          </div>
        </div>

        {farmer.products && farmer.products.length > 0 && (
          <div className="farmer-products">
            <h2>Products from {farmer.farm_name || farmer.name}</h2>
            <div className="products-grid">
              {farmer.products.map(product => (
                <Card key={product.id} className="product-card">
                  <div className="product-content">
                    <h3>{product.name}</h3>
                    <span className="product-type">{product.type}</span>
                    <div className="product-price">K{product.price}</div>
                    <div className="product-meta">
                      <span>Stock: {product.quantity}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default FarmerProfile;
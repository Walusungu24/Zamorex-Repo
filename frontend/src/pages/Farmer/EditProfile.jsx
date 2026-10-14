import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Button from '../../components/common/Button';
import BackButton from '../../components/common/BackButton';
import API from '../../services/api';
import './EditProfile.css';

function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profiles/me');
      setProfile(res.data.profile);
    } catch (error) {
      console.log('No profile yet');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar user={user} />
        <div className="edit-profile-container container">
          <BackButton to="/farmer" label="Back to Products" />
          <div className="page-header">
            <h1>Your Profile</h1>
            <p className="subtitle">Buyers will see this information when viewing your products</p>
          </div>

          <div className="empty-state">
            <h3>You Haven't Created a Profile Yet</h3>
            <p>Complete your profile so buyers can learn about your farm and contact you easily.</p>
            <Button 
              onClick={() => navigate('/farmer/profile/edit')} 
              style={{ marginTop: '16px' }}
            >
              Create Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="profile-view-container container">
        <BackButton to="/farmer" label="Back to Products" />
        
        <div className="profile-view-header-bar">
          <div>
            <h1>Your Profile</h1>
            <p className="subtitle">This is how buyers see your profile</p>
          </div>
          <Button onClick={() => navigate('/farmer/profile/edit')}>
            Edit Profile
          </Button>
        </div>

        <div className="farmer-profile-header">
          <div className="farmer-avatar">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user.name?.charAt(0) || 'F'}
              </div>
            )}
          </div>
          <div className="farmer-info">
            <h1>{profile.farm_name || user.name}</h1>
            <p className="farmer-name">{user.name}</p>
            {profile.location && (
              <p className="farmer-location">{profile.location}</p>
            )}
            {profile.bio && (
              <p className="farmer-bio">{profile.bio}</p>
            )}
            <div className="farmer-contact">
              {profile.whatsapp && (
                <div className="contact-detail">
                  <span className="contact-label">WhatsApp</span>
                  <span className="contact-value">{profile.whatsapp}</span>
                </div>
              )}
              <div className="contact-detail">
                <span className="contact-label">Phone</span>
                <span className="contact-value">{user.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tip">
          <strong>Tip:</strong> Buyers see your farm name, location, bio, and contact details when they view your products.
        </div>
      </div>
    </>
  );
}

export default EditProfile;
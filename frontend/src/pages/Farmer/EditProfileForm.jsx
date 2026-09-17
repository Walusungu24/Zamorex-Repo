import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layouts/Navbar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import API from '../../services/api';
import './EditProfile.css';
import BackButton from '../../components/common/BackButton';

function EditProfileForm() {
  const [profile, setProfile] = useState({
    farm_name: '',
    location: '',
    whatsapp: '',
    bio: '',
    profile_picture: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/profiles/me');
      if (res.data.profile) {
        setProfile({
          farm_name: res.data.profile.farm_name || '',
          location: res.data.profile.location || '',
          whatsapp: res.data.profile.whatsapp || '',
          bio: res.data.profile.bio || '',
          profile_picture: res.data.profile.profile_picture || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await API.put('/profiles/me', profile);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
      window.location.href = '/farmer/profile';  // ← changed from /farmer
      }, 1500);
      // Redirect to farmer dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/farmer';
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <>
        <Navbar user={user} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="edit-profile-container container">
        <BackButton to="/farmer" label="Back to Products" />
        <div className="page-header">
          <h1>👨‍🌾 Edit Your <span>Profile</span></h1>
          <p className="subtitle">Complete your profile to help buyers find you</p>
        </div>

        <Card className="profile-form-card">
          <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}

            <div className="form-section">
              <h3>Farm Information</h3>
              
              <Input
                label="Farm Name"
                name="farm_name"
                placeholder="e.g. Green Valley Farm"
                value={profile.farm_name}
                onChange={handleChange}
              />

              <Input
                label="Farm Location"
                name="location"
                placeholder="e.g. Lusaka, Zambia"
                value={profile.location}
                onChange={handleChange}
              />

              <div className="form-group">
                <label className="input-label">Bio </label>
                <textarea
                  name="bio"
                  placeholder="Tell buyers about you, your farm, your farming practices, and what makes your produce special..."
                  value={profile.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Details</h3>

              <div className="form-group">
                <label className="input-label">WhatsApp Number <span className="optional-text">(preferred)</span></label>
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="Enter WhatsApp number with country code"
                  value={profile.whatsapp}
                  onChange={handleChange}
                  className="form-input"
                />
                <p className="hint-text"> This will be displayed to buyers for easy contact</p>
              </div>

              {/* Image upload coming in future update */}
              
            </div>

            <div className="form-actions">
              <Button type="submit" loading={saving}>
                Save Profile
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/farmer'}>
                Skip for Now
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

export default EditProfileForm;
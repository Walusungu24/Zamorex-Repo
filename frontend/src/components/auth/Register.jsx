import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'buyer',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registerData } = formData;
      
      await API.post('/users/register', registerData);
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🌾 Zamorex</h1>
          <p>Create your account to get started.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label className="input-label">I want to register as a...</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="buyer">Buyer - I want to buy products</option>
              <option value="farmer">Farmer - I want to sell products</option>
            </select>
          </div>

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Button from '../common/Button';
import Input from '../common/Input';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/users/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ZAMOREX</h1>
          <p>Welcome back. Please sign in to your account.</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button 
            type="submit" 
            fullWidth 
            loading={loading}
          >
            Sign In
          </Button>
        </form>

                <div className="auth-footer">
          <p>
            Don't have an account? <a href="/register">Create one</a>
          </p>
          <p className="support-link-wrapper">
            Need help? <a href="mailto:walusungumulenga24@gmail.com?subject=Zamorex%20Support%20Request">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
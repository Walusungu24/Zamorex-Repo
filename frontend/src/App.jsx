import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminPanel from './pages/Admin/AdminPanel';
import FarmerDashboard from './pages/Farmer/FarmerDashboard';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/farmer" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer" 
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
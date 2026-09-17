import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminPanel from './pages/Admin/AdminPanel';
import FarmerDashboard from './pages/Farmer/FarmerDashboard';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import EditProfile from './pages/Farmer/EditProfile';
import FarmerProfile from './pages/Public/FarmerProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './styles/global.css';
import EditProfileForm from './pages/Farmer/EditProfileForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Public farmer profile - anyone can view */}
        <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/farmer" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/profile/edit" element={
          <ProtectedRoute allowedRoles={['farmer']}>
          <EditProfileForm />
          </ProtectedRoute>
          } />
          <Route path="/farmer/profile" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/buyer" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
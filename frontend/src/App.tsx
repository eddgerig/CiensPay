import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import TestConnection from "./pages/TestConnection";
import React from 'react';
import CreateForm from "./components/CreateForm";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

function RegisterWrapper() {
  const navigate = useNavigate();
  return (
    <Register
      onBack={() => navigate('/login')}
      onRegisterSuccess={() => navigate('/login')}
    />
  );
}

function LoginWrapper() {
  const navigate = useNavigate();
  return (
    <Login
      onBack={() => navigate('/')}
      onLoginSuccess={() => navigate('/dashboard')}
    />
  );
}

function DashboardWrapper() {
  const navigate = useNavigate();
  return (
    <Dashboard
      onLogout={() => navigate('/login')}
    />
  );
}

function AdminDashboardWrapper() {
  const navigate = useNavigate();
  return (
    <AdminDashboard
      onLogout={() => navigate('/login')}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* si está logueado, no lo dejes entrar a login/register */}
        <Route path="/login" element={
          <PublicOnlyRoute>
            <LoginWrapper />
          </PublicOnlyRoute>
        } />

        <Route path="/register" element={
          <PublicOnlyRoute>
            <RegisterWrapper />
          </PublicOnlyRoute>
        } />

        {/* rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboardWrapper />
          </ProtectedRoute>
        } />

        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/test-connection2" element={<CreateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

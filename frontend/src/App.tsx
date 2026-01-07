import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import TestConnection from "./pages/TestConnection";
import React from 'react';
import CreateForm from "./components/CreateForm";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/register" element={<RegisterWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/test-connection2" element={<CreateForm />} />
      </Routes>
    </BrowserRouter>
  );
}

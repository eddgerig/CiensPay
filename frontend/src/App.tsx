import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function RegisterWrapper() {
  const navigate = useNavigate();
  return (
    <Register
      onBack={() => navigate('/login')}
      onRegisterSuccess={() => navigate('/login')}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

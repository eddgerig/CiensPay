import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import TestConnection from "./pages/TestConnection";
import React from 'react';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

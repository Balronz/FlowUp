import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import './index.css'


function App() {  

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<LoginPage/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

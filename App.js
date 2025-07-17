"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ProductProvider } from "./contexts/ProductContext"
import { CartProvider } from "./contexts/CartContext"
import NavigationBar from "./components/Navigation/NavigationBar"
import Home from "./pages/Home"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import Profile from "./pages/Auth/Profile"
import Products from "./pages/Products/Products"
import ProductDetail from "./pages/Products/ProductDetail"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import AdminRoute from "./components/Auth/AdminRoute"
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Cart/Checkout"
import ForgotPassword from "./pages/Auth/ForgotPassword"
import Footer from "./components/Layout/Footer"
import AuthLoader from "./components/Layout/AuthLoader"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

// Main app content that renders after auth check
const AppContent = () => {
  const { isCheckingAuth, isReady } = useAuth()

  // Show loading screen while checking authentication
  if (isCheckingAuth || !isReady) {
    return <AuthLoader />
  }

  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <NavigationBar />
            <Container className="mt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

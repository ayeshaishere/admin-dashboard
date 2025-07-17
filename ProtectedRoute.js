"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Spinner, Container } from "react-bootstrap"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth, isReady } = useAuth()

  // Show loading while checking authentication
  if (isCheckingAuth || !isReady) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

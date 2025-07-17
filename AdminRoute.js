"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Spinner, Container } from "react-bootstrap"

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isCheckingAuth, isReady } = useAuth()

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute

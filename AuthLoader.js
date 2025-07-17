"use client"
import { Container, Spinner } from "react-bootstrap"

const AuthLoader = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <Spinner animation="border" role="status" size="lg" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted">Checking authentication...</p>
      </div>
    </Container>
  )
}

export default AuthLoader

"use client"
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
// Correct (if you have CartContext.js):
import { useCart } from '../../contexts/CartContext';

const NavigationBar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const { getTotalItems } = useCart()

  const handleLogout = () => {
    logout()
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>ECommerce Store</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/products">
              <Nav.Link>Products</Nav.Link>
            </LinkContainer>
            {isAdmin && (
              <LinkContainer to="/admin">
                <Nav.Link>Admin Dashboard</Nav.Link>
              </LinkContainer>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <LinkContainer to="/cart">
                  <Nav.Link>Cart {getTotalItems() > 0 && <Badge bg="danger">{getTotalItems()}</Badge>}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Nav.Link>Welcome, {user?.firstName || user?.username}</Nav.Link>
                </LinkContainer>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar

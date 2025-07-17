"use client"
import { Container, Row, Col } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>ECommerce Store</h5>
            <p>Your one-stop shop for amazing products at great prices.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-light">
                  Products
                </a>
              </li>
              <li>
                <a href="/login" className="text-light">
                  Login
                </a>
              </li>
              <li>
                <a href="/register" className="text-light">
                  Register
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Info</h5>
            <p>Email: info@ecommercestore.com</p>
          
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p>&copy; 2025 ECommerce Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

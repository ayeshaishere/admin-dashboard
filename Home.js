"use client"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth()

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section bg-light py-5 mb-5">
        <Container>
          <Row className="text-center">
            <Col>
              <img src="/images/store.jpg" alt="Hero"  />
              <h1 className="display-4 mb-3">Welcome to ECommerce Store</h1>
              <p className="lead text-muted">Discover amazing products at great prices</p>
              {isAuthenticated && (
                <p className="text-muted">
                  Welcome back, {user?.firstName || user?.username}!
                  {isAdmin && <span className="badge bg-danger ms-2">Admin</span>}
                </p>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* About Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4">About Our Store</h2>
            <Row>
              <Col md={4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-shipping-fast fa-3x text-primary"></i>
                    </div>
                    <h5>Fast Shipping</h5>
                    <p>Get your products delivered quickly with our express shipping options.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-shield-alt fa-3x text-success"></i>
                    </div>
                    <h5>Secure Shopping</h5>
                    <p>Shop with confidence knowing your data is protected with top-level security.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-headset fa-3x text-info"></i>
                    </div>
                    <h5>24/7 Support</h5>
                    <p>Our customer support team is available around the clock to help you.</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Featured Products Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4">Why Choose Us?</h2>
            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Quality Products</h5>
                    <p>We source only the highest quality products from trusted manufacturers and brands.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Competitive Prices</h5>
                    <p>Get the best deals and competitive prices on all our products with regular discounts.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Easy Returns</h5>
                    <p>Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <h5>Wide Selection</h5>
                    <p>
                      Browse through thousands of products across multiple categories to find exactly what you need.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Call to Action */}
        <Row className="mb-5">
          <Col className="text-center">
            <Card className="bg-primary text-white">
              <Card.Body className="py-5">
                <h3>Ready to Start Shopping?</h3>
                <p className="lead">Browse our extensive collection of products and find your perfect match.</p>
                <Link to="/products">
                  <Button variant="light" size="lg">
                    Shop Now
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Links for Authenticated Users */}
        {isAuthenticated && (
          <Row className="mb-5">
            <Col>
              <h4 className="text-center mb-4">Quick Actions</h4>
              <Row className="justify-content-center">
                <Col md={3} className="mb-3">
                  <Card className="text-center">
                    <Card.Body>
                      <h6>My Profile</h6>
                      <Link to="/profile">
                        <Button variant="outline-primary" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} className="mb-3">
                  <Card className="text-center">
                    <Card.Body>
                      <h6>Shopping Cart</h6>
                      <Link to="/cart">
                        <Button variant="outline-success" size="sm">
                          View Cart
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                {isAdmin && (
                  <Col md={3} className="mb-3">
                    <Card className="text-center border-danger">
                      <Card.Body>
                        <h6>Admin Panel</h6>
                        <Link to="/admin">
                          <Button variant="outline-danger" size="sm">
                            Manage Store
                          </Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

export default Home

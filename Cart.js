"use client"
import { Container, Row, Col, Card, Button, Table, Form } from "react-bootstrap"
import { useCart } from "../../contexts/CartContext"
import { Link } from "react-router-dom"

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card>
              <Card.Body>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <Link to="/products">
                  <Button variant="primary">Browse Products</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Shopping Cart</h2>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            className="me-3"
                          />
                          <div>
                            <h6>{item.title}</h6>
                            <small className="text-muted">{item.brand}</small>
                          </div>
                        </div>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value))}
                          style={{ width: "80px" }}
                        />
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  <Button variant="outline-danger" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
                <div>
                  <h4>Total: ${getTotalPrice().toFixed(2)}</h4>
                </div>
              </div>

              <div className="text-end mt-3">
                <Link to="/products">
                  <Button variant="outline-primary" className="me-2">
                    Continue Shopping
                  </Button>
                </Link>
                <Link to="/checkout">
                  <Button variant="success">Proceed to Checkout</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Cart

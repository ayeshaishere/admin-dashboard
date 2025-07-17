"use client"
import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import { useCart } from "../../contexts/CartContext"
import { useNavigate } from "react-router-dom"

const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  zipCode: Yup.string().required("Zip code is required"),
  cardNumber: Yup.string().required("Card number is required"),
  expiryDate: Yup.string().required("Expiry date is required"),
  cvv: Yup.string().required("CVV is required"),
})

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOrderPlaced(true)
      clearCart()

      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch (error) {
      console.error("Order failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="success" className="text-center">
              <h4>Order Placed Successfully!</h4>
              <p>Thank you for your purchase. You will be redirected to the home page shortly.</p>
            </Alert>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <Container>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4>Checkout</h4>
            </Card.Header>
            <Card.Body>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  address: "",
                  city: "",
                  zipCode: "",
                  cardNumber: "",
                  expiryDate: "",
                  cvv: "",
                }}
                validationSchema={CheckoutSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <h5>Billing Information</h5>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.firstName && errors.firstName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.lastName && errors.lastName}
                          />
                          <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.address && errors.address}
                      />
                      <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.city && errors.city}
                          />
                          <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Zip Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="zipCode"
                            value={values.zipCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.zipCode && errors.zipCode}
                          />
                          <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <h5 className="mt-4">Payment Information</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="cardNumber"
                        value={values.cardNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="1234 5678 9012 3456"
                        isInvalid={touched.cardNumber && errors.cardNumber}
                      />
                      <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={values.expiryDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="MM/YY"
                            isInvalid={touched.expiryDate && errors.expiryDate}
                          />
                          <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV</Form.Label>
                          <Form.Control
                            type="text"
                            name="cvv"
                            value={values.cvv}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="123"
                            isInvalid={touched.cvv && errors.cvv}
                          />
                          <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="success" type="submit" disabled={isSubmitting} className="w-100">
                      {isSubmitting ? "Processing..." : `Place Order - $${getTotalPrice().toFixed(2)}`}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Order Summary</h5>
            </Card.Header>
            <Card.Body>
              {items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Checkout

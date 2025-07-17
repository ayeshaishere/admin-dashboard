"use client"
import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import { Link } from "react-router-dom"

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
})

const ForgotPassword = () => {
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("")
      setMessage("")

      // Simulate password reset email
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessage("Password reset instructions have been sent to your email address.")
    } catch (err) {
      setError("Failed to send password reset email")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h3 className="text-center">Forgot Password</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={handleSubmit}>
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email address"
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100">
                      {isSubmitting ? "Sending..." : "Send Reset Instructions"}
                    </Button>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-3">
                <p>
                  Remember your password? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPassword

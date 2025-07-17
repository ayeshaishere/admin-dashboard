"use client"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, Link } from "react-router-dom"

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string().email("Invalid email format"),
})

const Login = () => {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values)
      navigate("/")
    } catch (err) {
      console.error("Login error:", err)
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
              <h3 className="text-center">Login</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{ username: "", password: "", email: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email (Optional)</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter email address"
                        isInvalid={touched.email && errors.email}
                      />
                      <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter username (try: kminchelle)"
                        isInvalid={touched.username && errors.username}
                      />
                      <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter password (try: 0lelplR)"
                        isInvalid={touched.password && errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting || loading} className="w-100">
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </Form>
                )}
              </Formik>

              <div className="text-center mt-3">
                <p>
                  <Link to="/forgot-password">Forgot your password?</Link>
                </p>
                <p>
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
                <small className="text-muted">
                  Admin credentials: email: admin@ecommerce.com, username: admin, password: admin123
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Login

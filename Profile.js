"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import { useAuth } from "../../contexts/AuthContext"

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  age: Yup.number().min(18, "Must be at least 18 years old"),
})

const Profile = () => {
  const { user, isAdmin, dispatch } = useAuth()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("")
      setMessage("")

      if (isAdmin) {
        // For admin, update local storage and context
        const updatedUser = { ...user, ...values }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        dispatch({ type: "UPDATE_PROFILE", payload: values })
        setMessage("Profile updated successfully!")
      } else {
        // For regular users, try to update via API
        try {
          const updatedUser = { ...user, ...values }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          dispatch({ type: "UPDATE_PROFILE", payload: values })
          setMessage("Profile updated successfully!")
        } catch (apiError) {
          // If API fails, still update locally
          const updatedUser = { ...user, ...values }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          dispatch({ type: "UPDATE_PROFILE", payload: values })
          setMessage("Profile updated successfully!")
        }
      }
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h3>Profile {isAdmin && <span className="badge bg-danger">Admin</span>}</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  email: user.email || "",
                  age: user.age || "",
                  username: user.username || "",
                }}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
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
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" name="username" value={values.username} disabled />
                      <Form.Text className="text-muted">Username cannot be changed</Form.Text>
                    </Form.Group>

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
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={values.age}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.age && errors.age}
                      />
                      <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update Profile"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile

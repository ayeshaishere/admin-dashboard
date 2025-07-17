"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Button, Alert, Modal, Form, Tabs, Tab } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Formik } from "formik"
import * as Yup from "yup"
import axios from "axios"

const ProductSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().required("Price is required").min(0, "Price must be positive"),
  category: Yup.string().required("Category is required"),
  brand: Yup.string().required("Brand is required"),
  stock: Yup.number().required("Stock is required").min(0, "Stock must be positive"),
})

const AdminDashboard = () => {
  const { deleteUser } = useAuth()
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [activeTab, setActiveTab] = useState("users")

  useEffect(() => {
    fetchUsers()
    fetchProducts()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("https://dummyjson.com/users")
      setUsers(response.data.users)
    } catch (err) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/products")
      setProducts(response.data.products)
    } catch (err) {
      setError("Failed to fetch products")
    }
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.id)
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setShowDeleteModal(false)
      setUserToDelete(null)
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`https://dummyjson.com/products/${productToDelete.id}`)
      setProducts(products.filter((product) => product.id !== productToDelete.id))
      setShowDeleteModal(false)
      setProductToDelete(null)
    } catch (err) {
      setError("Failed to delete product")
    }
  }

  const handleAddProduct = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post("https://dummyjson.com/products/add", values)
      setProducts([response.data, ...products])
      setShowProductModal(false)
      resetForm()
    } catch (err) {
      setError("Failed to add product")
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteModal = (user) => {
    setUserToDelete(user)
    setProductToDelete(null)
    setShowDeleteModal(true)
  }

  const openDeleteProductModal = (product) => {
    setProductToDelete(product)
    setUserToDelete(null)
    setShowDeleteModal(true)
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2>Admin Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
            <Tab eventKey="users" title="User Management">
              <Card>
                <Card.Header>
                  <h4>User Management</h4>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <p>Loading users...</p>
                  ) : (
                    <Table responsive striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Age</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td>
                              <Button variant="danger" size="sm" onClick={() => openDeleteModal(user)}>
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="products" title="Product Management">
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h4>Product Management</h4>
                  <Button variant="success" onClick={() => setShowProductModal(true)}>
                    Add Product
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 20).map((product) => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>{product.title}</td>
                          <td>{product.category}</td>
                          <td>${product.price}</td>
                          <td>{product.stock}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => openDeleteProductModal(product)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <>
              Are you sure you want to delete user {userToDelete?.firstName} {userToDelete?.lastName}?
            </>
          )}
          {productToDelete && <>Are you sure you want to delete product "{productToDelete?.title}"?</>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={userToDelete ? handleDeleteUser : handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: "",
              description: "",
              price: "",
              category: "",
              brand: "",
              stock: "",
            }}
            validationSchema={ProductSchema}
            onSubmit={handleAddProduct}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && errors.title}
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="price"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.price && errors.price}
                      />
                      <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={values.stock}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.stock && errors.stock}
                      />
                      <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.category && errors.category}
                      />
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control
                        type="text"
                        name="brand"
                        value={values.brand}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.brand && errors.brand}
                      />
                      <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="me-2" onClick={() => setShowProductModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="success" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Product"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default AdminDashboard

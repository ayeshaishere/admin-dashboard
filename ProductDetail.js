"use client"

import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from "react-bootstrap"
import { useParams, Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import axios from "axios"

const ProductDetail = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError("")

        console.log("Fetching product with ID:", id)
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
        console.log("Product data:", response.data)

        setProduct(response.data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id])

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" size="lg">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading product details...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <h4>Error</h4>
          <p>{error}</p>
          <Link to="/products">
            <Button variant="primary">Back to Products</Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container>
        <Alert variant="warning">
          <h4>Product Not Found</h4>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button variant="primary">Back to Products</Button>
          </Link>
        </Alert>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Link to="/products">
            <Button variant="outline-secondary">← Back to Products</Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={product.thumbnail || product.images?.[0] || "/placeholder.svg?height=400&width=400"}
              style={{ height: "400px", objectFit: "cover" }}
            />
          </Card>

          {product.images && product.images.length > 1 && (
            <Row className="mt-3">
              {product.images.slice(1, 5).map((image, index) => (
                <Col key={index} xs={3}>
                  <img
                    src={image || "/placeholder.svg?height=100&width=100"}
                    alt={`${product.title} ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ height: "80px", objectFit: "cover", width: "100%" }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Col>

        <Col md={6}>
          <h1>{product.title}</h1>
          {product.brand && <p className="text-muted fs-5">{product.brand}</p>}

          <div className="mb-3">
            <Badge bg="secondary" className="me-2">
              {product.category}
            </Badge>
            {product.rating && <Badge bg="warning">★ {product.rating}</Badge>}
          </div>

          <div className="mb-3">
            <h3 className="text-primary">${product.price}</h3>
            {product.discountPercentage > 0 && (
              <p className="text-success">
                <strong>{product.discountPercentage}% off!</strong>
              </p>
            )}
          </div>

          <p className="mt-3 fs-6">{product.description}</p>

          <div className="mt-4">
            <Row>
              <Col sm={6}>
                <p>
                  <strong>Stock:</strong> {product.stock} available
                </p>
              </Col>
              {product.sku && (
                <Col sm={6}>
                  <p>
                    <strong>SKU:</strong> {product.sku}
                  </p>
                </Col>
              )}
            </Row>

            {product.weight && (
              <p>
                <strong>Weight:</strong> {product.weight}g
              </p>
            )}

            {product.dimensions && (
              <p>
                <strong>Dimensions:</strong> {product.dimensions.width} × {product.dimensions.height} ×{" "}
                {product.dimensions.depth} cm
              </p>
            )}
          </div>

          <div className="mt-4 d-grid gap-2">
            <Button
              variant={addedToCart ? "success" : "primary"}
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? "✓ Added to Cart!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <strong>Tags:</strong>
              <div className="mt-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default ProductDetail

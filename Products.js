"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap"
import { useProducts } from "../../contexts/ProductContext"
import { useCart } from "../../contexts/CartContext"
import { Link } from "react-router-dom"

const Products = () => {
  const { products, searchResults, loading, searchProducts } = useProducts()
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [addedProducts, setAddedProducts] = useState(new Set())
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        await searchProducts(searchQuery)
        setShowSearchResults(true)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedProducts((prev) => new Set([...prev, product.id]))
    setTimeout(() => {
      setAddedProducts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }

  const displayProducts = showSearchResults ? searchResults : products

  if (loading && !isSearching) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" size="lg">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading products...</p>
      </Container>
    )
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2>Products</h2>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
              {showSearchResults && (
                <Button variant="outline-danger" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>

          {showSearchResults && (
            <Alert variant="info" className="mt-2">
              Showing search results for "{searchQuery}" ({searchResults.length} results)
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        {displayProducts && displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.thumbnail || "/placeholder.svg?height=200&width=300"}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h5 text-primary">${product.price}</span>
                      <span className="badge bg-secondary">{product.category}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <Link to={`/products/${product.id}`} className="flex-grow-1">
                        <Button variant="outline-primary" className="w-100">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant={addedProducts.has(product.id) ? "success" : "primary"}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {addedProducts.has(product.id) ? "Added!" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <Alert variant="info">
              <h4>No products found</h4>
              <p>
                {showSearchResults
                  ? `No products match your search for "${searchQuery}"`
                  : "No products available at the moment"}
              </p>
              {showSearchResults && (
                <Button variant="primary" onClick={handleClearSearch}>
                  View All Products
                </Button>
              )}
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default Products

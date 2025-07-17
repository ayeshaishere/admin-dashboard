"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const ProductContext = createContext()

const productReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS_START":
      return { ...state, loading: true, error: null }
    case "FETCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        total: action.payload.total,
      }
    case "FETCH_PRODUCTS_ERROR":
      return { ...state, loading: false, error: action.payload }
    case "FETCH_PRODUCT_SUCCESS":
      return { ...state, selectedProduct: action.payload }
    case "SEARCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        searchResults: action.payload.products,
        searchTotal: action.payload.total,
      }
    case "SEARCH_PRODUCTS_START":
      return { ...state, loading: true, error: null }
    default:
      return state
  }
}

const initialState = {
  products: [],
  selectedProduct: null,
  searchResults: [],
  total: 0,
  searchTotal: 0,
  loading: false,
  error: null,
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState)

  const fetchProducts = async (limit = 30, skip = 0) => {
    dispatch({ type: "FETCH_PRODUCTS_START" })
    try {
      console.log("Fetching products...")
      const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      console.log("Products fetched:", response.data)
      dispatch({ type: "FETCH_PRODUCTS_SUCCESS", payload: response.data })
    } catch (error) {
      console.error("Error fetching products:", error)
      dispatch({
        type: "FETCH_PRODUCTS_ERROR",
        payload: error.response?.data?.message || "Failed to fetch products",
      })
    }
  }

  const fetchProduct = async (id) => {
    try {
      console.log("Fetching single product:", id)
      const response = await axios.get(`https://dummyjson.com/products/${id}`)
      console.log("Single product fetched:", response.data)
      dispatch({ type: "FETCH_PRODUCT_SUCCESS", payload: response.data })
      return response.data
    } catch (error) {
      console.error("Error fetching single product:", error)
      throw error
    }
  }

  const searchProducts = async (query) => {
    dispatch({ type: "SEARCH_PRODUCTS_START" })
    try {
      console.log("Searching products for:", query)
      const response = await axios.get(`https://dummyjson.com/products/search?q=${query}`)
      console.log("Search results:", response.data)
      dispatch({ type: "SEARCH_PRODUCTS_SUCCESS", payload: response.data })
    } catch (error) {
      console.error("Error searching products:", error)
      dispatch({
        type: "FETCH_PRODUCTS_ERROR",
        payload: error.response?.data?.message || "Search failed",
      })
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const value = {
    ...state,
    fetchProducts,
    fetchProduct,
    searchProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

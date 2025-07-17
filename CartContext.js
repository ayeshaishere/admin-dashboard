"use client"

import { createContext, useContext, useReducer, useEffect, useState } from "react"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload,
        isLoaded: true,
      }
    case "ADD_TO_CART":
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    default:
      return state
  }
}

const initialState = {
  items: [],
  isOpen: false,
  isLoaded: false,
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isInitializing, setIsInitializing] = useState(true)

  // Load cart from localStorage on initialization
  useEffect(() => {
    const loadSavedCart = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          if (Array.isArray(cartItems)) {
            console.log("Loading saved cart:", cartItems.length, "items")
            dispatch({ type: "LOAD_CART", payload: cartItems })
          }
        } else {
          dispatch({ type: "LOAD_CART", payload: [] })
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("cart")
        dispatch({ type: "LOAD_CART", payload: [] })
      } finally {
        setIsInitializing(false)
      }
    }

    loadSavedCart()
  }, [])

  // Save cart to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (state.isLoaded && !isInitializing) {
      try {
        localStorage.setItem("cart", JSON.stringify(state.items))
        console.log("Cart saved to localStorage:", state.items.length, "items")
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [state.items, state.isLoaded, isInitializing])

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const removeFromCart = (productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInitializing,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

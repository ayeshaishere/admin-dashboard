"use client"

import { createContext, useContext, useReducer, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext()

const ADMIN_CREDENTIALS = {
  email: "admin@ecommerce.com",
  username: "admin",
  password: "admin123",
  firstName: "Admin",
  lastName: "User",
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.email === ADMIN_CREDENTIALS.email,
        isInitialized: true,
      }
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload, isInitialized: true }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isInitialized: true,
      }
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } }
    case "INITIALIZE_COMPLETE":
      return { ...state, isInitialized: true }
    default:
      return state
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
  isInitialized: false, // New flag to track if we've checked localStorage
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check for saved user on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsCheckingAuth(true)
        const savedUser = localStorage.getItem("user")

        if (savedUser) {
          try {
            const user = JSON.parse(savedUser)

            // Validate the saved user data
            if (user && user.id && (user.username || user.email)) {
              console.log("Found saved user, auto-logging in:", user.username || user.email)

              // Check if it's admin
              const isAdmin = user.email === ADMIN_CREDENTIALS.email

              dispatch({
                type: "LOGIN_SUCCESS",
                payload: user,
              })

              console.log(`Auto-login successful for ${isAdmin ? "admin" : "user"}: ${user.firstName || user.username}`)
            } else {
              // Invalid user data, remove it
              localStorage.removeItem("user")
              dispatch({ type: "INITIALIZE_COMPLETE" })
            }
          } catch (parseError) {
            console.error("Error parsing saved user data:", parseError)
            localStorage.removeItem("user")
            dispatch({ type: "INITIALIZE_COMPLETE" })
          }
        } else {
          dispatch({ type: "INITIALIZE_COMPLETE" })
        }
      } catch (error) {
        console.error("Error during auth initialization:", error)
        dispatch({ type: "INITIALIZE_COMPLETE" })
      } finally {
        setIsCheckingAuth(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" })
    try {
      // Check if it's admin login
      if (
        credentials.email === ADMIN_CREDENTIALS.email &&
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        const adminUser = {
          id: "admin",
          ...ADMIN_CREDENTIALS,
        }
        localStorage.setItem("user", JSON.stringify(adminUser))
        dispatch({ type: "LOGIN_SUCCESS", payload: adminUser })
        return
      }

      // For regular users, authenticate with DummyJSON
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username: credentials.username,
        password: credentials.password,
      })

      const user = response.data
      localStorage.setItem("user", JSON.stringify(user))
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error.response?.data?.message || "Login failed",
      })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post("https://dummyjson.com/users/add", userData)
      const newUser = response.data
      localStorage.setItem("user", JSON.stringify(newUser))
      dispatch({ type: "LOGIN_SUCCESS", payload: newUser })
      return newUser
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error.response?.data?.message || "Registration failed",
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("cart") // Also clear cart on logout
    dispatch({ type: "LOGOUT" })
  }

  const updateProfile = async (updatedData) => {
    try {
      if (state.isAdmin) {
        // For admin, just update locally
        const updatedUser = { ...state.user, ...updatedData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        dispatch({ type: "UPDATE_PROFILE", payload: updatedData })
        return updatedUser
      } else {
        // For regular users, try API first, then fallback to local
        try {
          const response = await axios.put(`https://dummyjson.com/users/${state.user.id}`, updatedData)
          const updatedUser = { ...state.user, ...updatedData }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          dispatch({ type: "UPDATE_PROFILE", payload: updatedData })
          return updatedUser
        } catch (apiError) {
          // API failed, update locally
          const updatedUser = { ...state.user, ...updatedData }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          dispatch({ type: "UPDATE_PROFILE", payload: updatedData })
          return updatedUser
        }
      }
    } catch (error) {
      throw error
    }
  }

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`https://dummyjson.com/users/${userId}`)
      return true
    } catch (error) {
      throw error
    }
  }

  const value = {
    ...state,
    dispatch,
    login,
    register,
    logout,
    updateProfile,
    deleteUser,
    isCheckingAuth,
    isReady: state.isInitialized && !isCheckingAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

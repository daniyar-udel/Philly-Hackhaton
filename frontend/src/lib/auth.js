import { createContext, useContext } from 'react'

const KEY = 'eyn_user'

export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export const storeUser = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export const clearStoredUser = () => localStorage.removeItem(KEY)

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

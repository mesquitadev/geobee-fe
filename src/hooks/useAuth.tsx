import { useContext } from 'react'
import {
  AuthContext,
  AuthContextData,
  AuthProvider,
} from '../contexts/AuthContext'

function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an authProvider')
  }
  return context
}

export { AuthProvider, useAuth }

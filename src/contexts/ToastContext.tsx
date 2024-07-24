import { createContext, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import ToastContainer from '../components/ToastContainer'

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}

export interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}

export const ToastContext = createContext<ToastContextData>(
  {} as ToastContextData,
)

export const ToastProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuidv4()
      const toast = {
        id,
        type,
        title,
        description,
      }

      setMessages((state) => [...state, toast])
    },
    [],
  )

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((message) => message.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}
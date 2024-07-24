import { createContext, ReactNode, useMemo, useState } from 'react'

export type LoadingContextData = {
  loading: boolean
  setLoading: (value: boolean) => void
}

export const LoadingContext = createContext({} as LoadingContextData)

type AuthContextProps = {
  children: ReactNode
}

export function LoadingProvider({ children }: AuthContextProps) {
  const [loading, setLoading] = useState(false)

  const updatedValue = useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading],
  )
  return (
    <LoadingContext.Provider value={updatedValue}>
      {children}
    </LoadingContext.Provider>
  )
}

import { PropsWithChildren } from 'react'

import { LoadingProvider } from '../contexts/LoadingContext'
import { AuthProvider } from '../contexts/AuthContext'

type AppProviderProps = PropsWithChildren<Record<string, unknown>>

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <LoadingProvider>
    <AuthProvider>{children}</AuthProvider>
  </LoadingProvider>
)

export default AppProvider

import React, { ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import ValidateView from '../Dialog'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen  lg:grid lg:grid-cols-app">
      <Sidebar />
      <main className="max-w-screen lg:col-start-2 lg:w-auto ">
        {/* <ValidateView /> */}
        {children}
      </main>
    </div>
  )
}

export default Layout

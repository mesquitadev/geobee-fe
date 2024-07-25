// BackdropLoading.tsx
import React from 'react'
import './styles.css'
interface BackdropLoadingProps {
  isLoading: boolean
}

const BackdropLoading: React.FC<BackdropLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loader"></div>
    </div>
  )
}

export default BackdropLoading

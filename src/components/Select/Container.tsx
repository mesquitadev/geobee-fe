import { ReactNode } from 'react'

interface InputContainerProps {
  children: ReactNode
  className?: string
}

const SelectContainer = ({
  children,
  className,
  ...rest
}: InputContainerProps) => {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

export default SelectContainer

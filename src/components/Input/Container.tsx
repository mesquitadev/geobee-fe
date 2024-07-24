import { ReactNode } from 'react'

interface InputContainerProps {
  children: ReactNode
  className?: string
}

const InputContainer = ({
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

export default InputContainer

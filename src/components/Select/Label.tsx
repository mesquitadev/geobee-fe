import { forwardRef } from 'react'

interface InputContainerProps {
  name: string
  label: string
}

const LabelContainer = ({ name, label, ...rest }: InputContainerProps) => {
  return (
    <label
      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      htmlFor={name}
      {...rest}
    >
      {label}
    </label>
  )
}

export default forwardRef(LabelContainer)

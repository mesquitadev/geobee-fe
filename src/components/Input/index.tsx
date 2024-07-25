import React, { forwardRef, useRef, useImperativeHandle } from 'react'
import { Control, Controller } from 'react-hook-form'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control
  name: string
  type?: string
  className?: string
  placeholder?: string
  errors: any
}

const Input = (
  {
    control,
    name,
    type = 'text',
    placeholder,
    errors,
    className,
    ...rest
  }: InputProps,
  ref: any,
) => {
  const inputElementRef = useRef<HTMLInputElement | null>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputElementRef.current?.focus()
    },
  }))

  const getError = (message: string) => {
    return <p className="text-red-500 text-xs italic">{message}</p>
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <input
            {...field}
            ref={inputElementRef}
            className={className}
            id={name}
            type={type}
            placeholder={placeholder}
            {...rest}
          />
          {getError(errors)}
        </>
      )}
    />
  )
}

export default forwardRef(Input)

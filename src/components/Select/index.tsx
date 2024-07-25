import { forwardRef, useRef, useImperativeHandle } from 'react'
import { Control, Controller } from 'react-hook-form'

type Option = {
  value: string
  label: string
}
type Options = Option[]

interface InputProps {
  control: Control
  name: string
  type?: string
  className?: string
  placeholder?: string
  errors: any
  options: Options
}

const Select = (
  {
    control,
    name,
    type = 'text',
    placeholder,
    errors,
    className,
    options,
    ...rest
  }: InputProps,
  ref: any,
) => {
  const inputElementRef = useRef<HTMLSelectElement | null>(null)

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
          <div className="relative">
            <select className={className} id={name} {...rest} {...field}>
              <option>Selecione uma opção...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"> */}
            {/*  <svg */}
            {/*    className="fill-current h-4 w-4" */}
            {/*    xmlns="http://www.w3.org/2000/svg" */}
            {/*    viewBox="0 0 20 20" */}
            {/*  > */}
            {/*    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> */}
            {/*  </svg> */}
            {/* </div> */}
          </div>
          {getError(errors)}
        </>
      )}
    />
  )
}

export default forwardRef(Select)

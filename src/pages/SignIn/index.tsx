import logo from '../../assets/logo-geobee.svg'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAuth } from '../../hooks/useAuth.tsx'
import { useLoading } from '../../hooks/useLoading.tsx'
import Input from '../../components/Input'
import InputContainer from '../../components/Input/Container.tsx'
import InputLabel from '../../components/Input/Label.tsx'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link } from 'react-router-dom'
type Inputs = {
  email: string
  password: string
}

const SignIn = () => {
  const { signIn } = useAuth()
  const { loading } = useLoading()
  const signInFormSchema = yup.object().shape({
    email: yup
      .string()
      .required('Este campo é obrigatório')
      .email('E-mail inválido'),
    password: yup.string().required('Este campo é obrigatório'),
  })
  const { handleSubmit, formState, watch, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(signInFormSchema),
  })
  const { errors } = formState

  const handleSignIn: SubmitHandler<Inputs> = async (values) => {
    if (!loading) await signIn(values)
  }

  return (
    <div className="min-h-screen flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 dark:bg-zinc-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-32 w-auto" src={logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          BeeMAPPER | Entrar
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(handleSignIn)} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <InputContainer className="w-full px-3">
              <InputLabel label="Email" name="email" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                control={control}
                name="email"
                placeholder="Digite seu Email..."
                errors={errors?.email?.message}
              />
            </InputContainer>

            <InputContainer className="w-full px-3">
              <InputLabel label="Senha" name="password" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                control={control}
                name="password"
                type="password"
                placeholder="Digite sua Senha..."
                errors={errors?.password?.message}
              />
            </InputContainer>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Entrar
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Não tem uma conta?{' '}
          <Link
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            to="/cadastre-se"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  )
}
export default SignIn

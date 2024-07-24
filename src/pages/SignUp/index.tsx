import logo from '../../assets/logo-geobee.svg'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useLoading } from '../../hooks/useLoading.tsx'
import Input from '../../components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import InputLabel from '../../components/Input/Label.tsx'
import InputContainer from '../../components/Input/Container.tsx'
import SelectContainer from '../../components/Select/Container.tsx'
import Select from '../../components/Select'
import { removeMask, validarCPF } from '../../utils'
import { useCallback } from 'react'
import api from '../../services'
import { enqueueSnackbar } from 'notistack'
import { useHistory } from 'react-router-dom'

type Inputs = {
  fullName: string
  cpf: string
  email: string
  phone: string
  role: string
  password: string
}

const SignIn = () => {
  const { loading, setLoading } = useLoading()
  const history = useHistory()
  const signInFormSchema = yup.object().shape({
    fullName: yup.string().required('Este campo é obrigatório'),
    cpf: yup
      .string()
      .required('Este campo é obrigatório')
      .test('test-invalid-cpf', 'CPF Inválido', (cpf: string | undefined) =>
        validarCPF(cpf),
      ),
    email: yup
      .string()
      .required('Este campo é obrigatório')
      .email('E-mail inválido'),
    phone: yup.string().required('Este campo é obrigatório'),
    role: yup.string().optional(),
    password: yup
      .string()
      .required('Este campo é obrigatório')
      .min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: yup
      .string()
      .required('Confirmação de senha é obrigatória')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .oneOf([yup.ref('password'), null], 'As senhas devem corresponder'),
  })
  const { handleSubmit, formState, control } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(signInFormSchema),
  })
  const { errors } = formState

  const handleSignUp: SubmitHandler<Inputs> = useCallback(
    async (data: Inputs) => {
      setLoading(true)
      try {
        const { fullName, cpf, phone, role, password, email } = data
        data.cpf = removeMask(data.cpf)
        await api.post('auth/register', {
          fullName,
          cpf,
          phone,
          role,
          password,
          email,
        })

        enqueueSnackbar({
          message:
            'Cadastro realizado com sucesso, voltando pra tela de login...',
          anchorOrigin: 'center',
          variant: 'success',
        })

        history.push('/')
      } catch (err) {
        enqueueSnackbar({
          message:
            'Erro no cadastro! Ocorreu um erro ao cadastrar, verifique os dados inseridos!',
          variant: 'error',
        })
        setLoading(false)
      } finally {
        setLoading(false)
      }
    },
    [history, setLoading],
  )

  const options = [
    {
      label: 'Apicultor',
      value: 'APICULTOR',
    },
    {
      label: 'Meliponicultor',
      value: 'MELIPONICULTOR',
    },
  ]

  return (
    <div className="min-h-screen flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-32 w-auto" src={logo} alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-700">
          BeeMAPPER | Cadastre-se
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(handleSignUp)} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="Nome Completo" name="email" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="fullName"
                placeholder="Digite seu nome completo..."
                errors={errors?.fullName?.message}
              />
            </InputContainer>

            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="CPF" name="cpf" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="cpf"
                placeholder="000.000.000-00"
                errors={errors?.cpf?.message}
              />
            </InputContainer>

            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="Email" name="phone" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="email"
                placeholder="email@email.com"
                errors={errors?.email?.message}
              />
            </InputContainer>

            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="Telefone" name="phone" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="phone"
                placeholder="(00) 0000-0000"
                errors={errors?.phone?.message}
              />
            </InputContainer>
            <SelectContainer className="w-full px-3 py-2">
              <InputLabel label="Eu sou um:" name="role" />
              <Select
                options={options}
                control={control}
                name="role"
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                errors={errors?.role?.message}
              />
            </SelectContainer>

            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="Senha" name="password" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="password"
                type="password"
                placeholder="Digite sua Senha..."
                errors={errors?.password?.message}
              />
            </InputContainer>
            <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <InputLabel label="Confirmar Senha" name="password" />
              <Input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                control={control}
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua Senha..."
                errors={errors?.confirmPassword?.message}
              />
            </InputContainer>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  )
}
export default SignIn

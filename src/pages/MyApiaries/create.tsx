import { useCallback, useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'
import Breadcumbs from '../../components/Breadcumbs'
import 'leaflet/dist/leaflet.css'
import { removeMask, validarCPF } from '../../utils'
import InputContainer from '../../components/Input/Container.tsx'
import InputLabel from '../../components/Input/Label.tsx'
import Input from '../../components/Input'
import SelectContainer from '../../components/Select/Container.tsx'
import Select from '../../components/Select'
import { useHistory } from 'react-router-dom'
import * as yup from 'yup'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { enqueueSnackbar } from 'notistack'

type Inputs = {
  name: string
  latitude: number
  longitude: number
  tipoInstalacao: string
  tempoItinerante?: string
  quantidadeColmeias: string
  outrosApiariosRaio3km: boolean
  qtdColmeiasOutrosApiarios?: string | null
  fontesNectarPolen: boolean
  disponibilidadeAgua: boolean
  sombreamentoNatural: boolean
  protecaoVentosFortes: boolean
  distanciaSeguraContaminacao: boolean
  distanciaMinimaConstrucoes: boolean
  distanciaSeguraLavouras: boolean
  acessoVeiculos: boolean
}

export default function NewApiary() {
  const { loading, setLoading } = useLoading()
  const history = useHistory()
  const [disabled, setDisabled] = useState(false)
  const apiarioFormSchema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório'),
    latitude: yup.number().required('Este campo é obrigatório'),
    longitude: yup.number().required('Este campo é obrigatório'),
    tipoInstalacao: yup.string().required('Este campo é obrigatório'),
    tempoItinerante: yup.string().nullable(true).optional(),
    quantidadeColmeias: yup.string().required('Este campo é obrigatório'),
    outrosApiariosRaio3km: yup.boolean().required('Este campo é obrigatório'),
    qtdColmeiasOutrosApiarios: yup.string().nullable(true).optional(),
    fontesNectarPolen: yup.boolean().required('Este campo é obrigatório'),
    disponibilidadeAgua: yup.boolean().required('Este campo é obrigatório'),
    sombreamentoNatural: yup.boolean().required('Este campo é obrigatório'),
    protecaoVentosFortes: yup.boolean().required('Este campo é obrigatório'),
    distanciaSeguraContaminacao: yup
      .boolean()
      .required('Este campo é obrigatório'),
    distanciaMinimaConstrucoes: yup
      .boolean()
      .required('Este campo é obrigatório'),
    distanciaSeguraLavouras: yup.boolean().required('Este campo é obrigatório'),
    acessoVeiculos: yup.boolean().required('Este campo é obrigatório'),
  })
  const { handleSubmit, formState, control, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(apiarioFormSchema),
  })
  const { errors } = formState

  const handleSignUp: SubmitHandler<Inputs> = useCallback(
    async (data: Inputs) => {
      setLoading(true)
      try {
        await api.post('apiary', data)
        enqueueSnackbar({
          message: 'Cadastro realizado com sucesso!',
          anchorOrigin: 'center',
          variant: 'success',
        })
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
    [setLoading],
  )

  const options = [
    {
      label: 'Fixo',
      value: 'Fixo',
    },
    {
      label: 'Intinerante',
      value: 'Intinerante',
    },
  ]

  const tempoIntineranteOptions = [
    {
      label: 'Até 30 Dias',
      value: 'Até 30 Dias',
    },
    {
      label: 'Até 60 Dias',
      value: 'Até 60 Dias',
    },
    {
      label: 'Até 90 Dias',
      value: 'Até 90 Dias',
    },
  ]

  const qtdColmeiasOptions = [
    {
      label: 'Até 49 Colméias',
      value: 'Até 49 Colméias',
    },
    {
      label: '50 à 100 Colméias',
      value: '50 à 100 Colméias',
    },
    {
      label: '101 à 150 Colméias',
      value: '101 à 150 Colméias',
    },
    {
      label: '151 à 200 Colméias',
      value: '151 à 200 Colméias',
    },
    {
      label: 'Mais de 200 Colméias',
      value: 'Mais de 200 Colméias',
    },
  ]

  const outrosApiariosRaio3kmOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const qtdColmeiasOutrosApiariosOptions = [
    {
      label: 'Até 49 Colméias',
      value: 'Até 49 Colméias',
    },
    {
      label: '50 à 200 Colméias',
      value: '50 à 200 Colméias',
    },
    {
      label: '201 à 400 Colméias',
      value: '201 à 400 Colméias',
    },
    {
      label: '401 à 600 Colméias',
      value: '401 à 600 Colméias',
    },
    {
      label: 'Mais de 600 Colméias',
      value: 'Mais de 600 Colméias',
    },
  ]

  const fontesNectarPolenOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const disponibilidadeAguaOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const sombreamentoNaturalOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const protecaoVentosFortesOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const distanciaSeguraOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const distanciaMinimaConstrucoesOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const distanciaSeguraLavourasOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const acessoVeiculosOptions = [
    {
      label: 'Sim',
      value: 'true',
    },
    {
      label: 'Não',
      value: 'false',
    },
  ]

  const tipoInstalacao = watch('tipoInstalacao')
  const outrosApiariosRaio3km = watch('outrosApiariosRaio3km')

  const fontesNectarPolen = watch('fontesNectarPolen')
  const disponibilidadeAgua = watch('fontesNectarPolen')
  const sombreaentoNatural = watch('sombreamentoNatural')
  const protecaoVentosFortes = watch('protecaoVentosFortes')
  const distanciaSeguraContaminacao = watch('distanciaSeguraContaminacao')
  const distanciaMinimaConstrucoes = watch('distanciaMinimaConstrucoes')
  const distanciaMinimaLavouras = watch('distanciaMinimaLavouras')

  useEffect(() => {
    if (fontesNectarPolen === 'false') {
      setDisabled(true)
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
    }
    if (disponibilidadeAgua === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Será necessário adicionar água de qualidade no local!',
        variant: 'info',
      })
    }

    if (sombreaentoNatural === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Será necessário colocar as caixas à sombra! ',
        variant: 'info',
      })
    }
    if (protecaoVentosFortes === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
    }

    if (distanciaSeguraContaminacao === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
    }

    if (distanciaMinimaConstrucoes === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
    }

    if (distanciaMinimaLavouras === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
    }
  }, [
    disponibilidadeAgua,
    distanciaMinimaConstrucoes,
    distanciaMinimaLavouras,
    distanciaSeguraContaminacao,
    fontesNectarPolen,
    protecaoVentosFortes,
    sombreaentoNatural,
  ])

  return (
    <div className="w-full h-full p-10">
      <Breadcumbs pageName="Cadastrar Apiário" />

      <form onSubmit={handleSubmit(handleSignUp)} className="w-full max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <InputContainer className="w-full  px-3 mb-6 md:mb-0">
            <InputLabel label="Nome" name="name" />
            <Input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              control={control}
              name="name"
              placeholder="Nome para identificação do apiário..."
              errors={errors?.name?.message}
            />
          </InputContainer>

          <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <InputLabel label="Latitude" name="latitude" />
            <Input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              control={control}
              name="latitude"
              placeholder="0"
              errors={errors?.longitude?.message}
            />
          </InputContainer>
          <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <InputLabel label="Longitude" name="longitude" />
            <Input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              control={control}
              name="longitude"
              placeholder="0"
              errors={errors?.longitude?.message}
            />
          </InputContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="O apiário a ser instalado será?"
              name="tipoInstalacao"
            />
            <Select
              options={options}
              control={control}
              name="tipoInstalacao"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.tipoInstalacao?.message}
            />
          </SelectContainer>

          {tipoInstalacao === 'Intinerante' && (
            <SelectContainer className="w-full px-3 py-2">
              <InputLabel
                label="Caso você tenha respondido intinerante, por quanto tempo pretende ficar neste local?"
                name="role"
              />
              <Select
                options={tempoIntineranteOptions}
                control={control}
                name="tempoIntinerante"
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                errors={errors?.tempoIntinerante?.message}
              />
            </SelectContainer>
          )}

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Quantas Colméias pretende instalar nesse apiário?"
              name="quantidadeColmeias"
            />
            <Select
              options={qtdColmeiasOptions}
              control={control}
              name="quantidadeColmeias"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.quantidadeColmeias?.message}
            />
          </SelectContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há outros apiários no raio de 3 KM?"
              name="outrosApiariosRaio3km"
            />
            <Select
              options={outrosApiariosRaio3kmOptions}
              control={control}
              name="outrosApiariosRaio3km"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.quantidadeColmeias?.message}
            />
          </SelectContainer>

          {outrosApiariosRaio3km === 'true' && (
            <SelectContainer className="w-full px-3 py-2">
              <InputLabel
                label="Caso haja outros apiários no raio de 3 KM, qual a quantidade de colméias?"
                name="qtdColmeiasOutrosApiariosOptions"
              />
              <Select
                options={qtdColmeiasOutrosApiariosOptions}
                control={control}
                name="qtdColmeiasOutrosApiariosOptions"
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                errors={errors?.qtdColmeiasOutrosApiariosOptions?.message}
              />
            </SelectContainer>
          )}

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há fontes de néctar e pólen (flores) até 3km do local que pretende instalar o apiário?"
              name="fontesNectarPolen"
            />
            <Select
              options={fontesNectarPolenOptions}
              control={control}
              name="fontesNectarPolen"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.fontesNectarPolen?.message}
            />
          </SelectContainer>
          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há disponibilidade de água de qualidade até 500m a partir do local escolhido?"
              name="disponibilidadeAgua"
            />
            <Select
              options={disponibilidadeAguaOptions}
              control={control}
              name="disponibilidadeAgua"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.disponibilidadeAgua?.message}
            />
          </SelectContainer>
          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há sombreamento natural para as colméias?"
              name="sombreamentoNatural"
            />
            <Select
              options={sombreamentoNaturalOptions}
              control={control}
              name="sombreamentoNatural"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.sombreamentoNatural?.message}
            />
          </SelectContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há proteção contra ventos fortes?"
              name="protecaoVentosFortes"
            />
            <Select
              options={protecaoVentosFortesOptions}
              control={control}
              name="protecaoVentosFortes"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.protecaoVentosFortes?.message}
            />
          </SelectContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="Há uma distancia segura (mínimo de 3km) de possíveis fontes de contaminação (lixões, matadouros, fábrica de doces, engemhos, dentre outros)?"
              name="distanciaSeguraContaminacao"
            />
            <Select
              options={distanciaSeguraOptions}
              control={control}
              name="distanciaSeguraContaminacao"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.distanciaSeguraContaminacao?.message}
            />
          </SelectContainer>
          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="O local onde pretende instalar seu apiario atende a uma distancia mínima (400m) de currais, casas, escolas, estradas movimentadas, aviários e outras construções?"
              name="distanciaMinimaConstrucoes"
            />
            <Select
              options={distanciaMinimaConstrucoesOptions}
              control={control}
              name="distanciaMinimaConstrucoes"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.distanciaMinimaConstrucoes?.message}
            />
          </SelectContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="O local possui uma distância segua (3km) de lavouras (milho, soja, transgênicos, dentre outros)?"
              name="distanciaSeguraLavouras"
            />
            <Select
              options={distanciaSeguraLavourasOptions}
              control={control}
              name="distanciaSeguraLavouras"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.distanciaSeguraLavouras?.message}
            />
          </SelectContainer>

          <SelectContainer className="w-full px-3 py-2">
            <InputLabel
              label="O local pretendido apiário é de fácil acesso para entrada e saída de veiculos automobilisticos?   "
              name="acessoVeiculos"
            />
            <Select
              options={acessoVeiculosOptions}
              control={control}
              name="acessoVeiculos"
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              errors={errors?.acessoVeiculos?.message}
            />
          </SelectContainer>
        </div>

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}

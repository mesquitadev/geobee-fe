import { useCallback, useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'
import Breadcumbs from '../../components/Breadcumbs'
import 'leaflet/dist/leaflet.css'
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
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import BackdropLoading from '../../components/BackdropLoading'
import {
  disponibilidadeAguaOptions,
  distanciaMinimaConstrucoesOptions,
  distanciaSeguraLavourasOptions,
  distanciaSeguraOptions,
  especiesAbelhasOptions,
  fontesNectarPolenOptions,
  outrosApiariosRaio3kmOptions,
  protecaoVentosFortesOptions,
  qtdColmeiasOptions,
  qtdColmeiasOutrosApiariosOptions,
  sombreamentoNaturalOptions,
  tipoInstalacaoApiarioOptions,
} from '../../utils/options.ts'
import * as turf from '@turf/turf'
import { calcularRaioVoo } from '../../utils'

type Inputs = {
  name: string
  latitude: number
  longitude: number
  tipoInstalacao: string
  especieAbelha?: string
  quantidadeColmeias: string
  outrosMeliponariosRaio1km: boolean
  qtdColmeiasOutrosMeliponarios?: string | null
  fontesNectarPolen: boolean
  disponibilidadeAgua: boolean
  sombreamentoNatural: boolean
  protecaoVentosFortes: boolean
  distanciaSeguraContaminacao: boolean
  distanciaMinimaConstrucoes: boolean
  distanciaSeguraLavouras: boolean
  acessoVeiculos: boolean
  capacidadeDeSuporte?: number
}

function calcularCapacidadeSuporteMeliponicultura(hectares: number) {
  const arvoresPorHectare = 570
  const quantidadeArvores = hectares * arvoresPorHectare
  const arvoresPasto = quantidadeArvores * 0.45 // 45% das árvores fazem parte do pasto das abelhas
  const colmeiasPorHectare = arvoresPasto / 100 // Cada colmeia precisa de 100 árvores
  return Math.round(colmeiasPorHectare)
}

async function processGeoJSON(geojsonUrl, latitude, longitude, tipo, especie) {
  try {
    const response = await fetch(geojsonUrl)
    const geojsonData = await response.json()

    const centro = turf.point([Number(longitude), Number(latitude)])
    const { raioVooDEC } = calcularRaioVoo({
      tipoCadastro: tipo,
      especie,
    })

    const buffer = turf.buffer(centro, raioVooDEC, { units: 'kilometers' })

    const layers = geojsonData.features

    const featuresDentroBuffer = layers.filter((layer) => {
      return turf.booleanIntersects(layer, buffer)
    })

    const areas = {}
    featuresDentroBuffer.forEach((layer) => {
      const nomeCamada = layer.properties.VEGETACAO
      const area = Number(layer.properties['AREA (Ha)'])
      if (!areas[nomeCamada]) {
        areas[nomeCamada] = 0
      }
      areas[nomeCamada] += area
    })

    console.log('areas', areas)

    const pasto = calcularCapacidadeSuporteMeliponicultura(
      Number(areas.ARBOREO),
    )
    console.log('arb', Number(pasto))

    if (tipo === 'MELIPONICULTOR') {
      return pasto
    }
  } catch (error) {
    console.error('Erro ao processar GeoJSON:', error)
  }
}

export default function NewMeliponary() {
  const { loading, setLoading } = useLoading()
  const history = useHistory()
  const [disabled, setDisabled] = useState(false)
  const [latitude, setLatitude] = useState<number>(0)
  const [longitude, setLongitude] = useState<number>(0)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null,
  )

  const meliponarioFormSchema = yup.object().shape({
    name: yup.string().required('Este campo é obrigatório'),
    latitude: yup.number().optional(),
    longitude: yup.number().optional(),
    tipoInstalacao: yup.string().required('Este campo é obrigatório'),
    especieAbelha: yup.string().required('Este campo é obrigatório'),
    quantidadeColmeias: yup.string().required('Este campo é obrigatório'),
    outrosMeliponariosRaio1km: yup
      .boolean()
      .required('Este campo é obrigatório'),
    qtdColmeiasOutrosMeliponarios: yup.string().nullable(true).optional(),
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
  })
  const { handleSubmit, formState, control, watch } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(meliponarioFormSchema),
  })
  const { errors } = formState

  const handleSignUp: SubmitHandler<Inputs> = useCallback(
    async (data: Inputs) => {
      setLoading(true)
      try {
        const [kmls] = await Promise.all([
          processGeoJSON(
            'https://raw.githubusercontent.com/mesquitadev/geobee-fe/main/src/components/Mapa/geobee.geojson',
            Number(latitude),
            Number(longitude),
            'MELIPONICULTOR',
            data.especieAbelha,
          ),
        ])
        const updatedData = {
          ...data,
          latitude,
          longitude,
          capacidadeDeSuporte: kmls,
        }

        await Promise.all([api.post('meliponary', updatedData)])

        enqueueSnackbar({
          message: 'Cadastro realizado com sucesso!',
          variant: 'success',
        })
      } catch (err) {
        console.log('err', err)
        enqueueSnackbar({
          message: `Erro no cadastro! Ocorreu um erro ao cadastrar, ${err.response.data.message}`,
          variant: 'error',
        })
        setLoading(false)
      } finally {
        setLoading(false)
      }
    },
    [latitude, longitude, setLoading],
  )

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
    setPosition({ lat, lng })
  }

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        handleLocationSelect(e.latlng.lat, e.latlng.lng)
      },
    })
    return position === null ? null : <Marker position={position}></Marker>
  }

  const outrosMeliponariosRaio1km = watch('outrosMeliponariosRaio1km')

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
      setDisabled(true)
    } else {
      setDisabled(false)
    }

    if (distanciaMinimaLavouras === 'false') {
      enqueueSnackbar({
        message: 'OOPS! Aqui não é um local adequado para colocar o apiário!',
        variant: 'warning',
      })
      setDisabled(true)
    } else {
      setDisabled(false)
    }

    console.log(errors)
  }, [
    disponibilidadeAgua,
    distanciaMinimaConstrucoes,
    distanciaMinimaLavouras,
    distanciaSeguraContaminacao,
    errors,
    fontesNectarPolen,
    protecaoVentosFortes,
    sombreaentoNatural,
  ])

  return (
    <div className="w-full h-full p-10">
      <Breadcumbs pageName="Cadastrar Meliponário" />
      <BackdropLoading isLoading={loading} />
      <div className="grid grid-cols-2">
        <div>
          <form onSubmit={handleSubmit(handleSignUp)} className="w-full">
            <div className="flex flex-wrap mx-3 mb-6">
              <InputContainer className="w-full  px-3 mb-6 md:mb-0">
                <InputLabel label="Nome" name="name" />
                <Input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  control={control}
                  name="name"
                  placeholder="Nome para identificação do meliponário..."
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
                  value={latitude}
                  disabled
                  errors={errors?.latitude?.message}
                />
              </InputContainer>
              <InputContainer className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <InputLabel label="Longitude" name="longitude" />
                <Input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  control={control}
                  name="longitude"
                  placeholder="0"
                  value={longitude}
                  disabled
                  errors={errors?.longitude?.message}
                />
              </InputContainer>

              <SelectContainer className="w-full px-3 py-2">
                <InputLabel
                  label="O meliponário a ser instalado será?"
                  name="tipoInstalacao"
                />
                <Select
                  options={tipoInstalacaoApiarioOptions}
                  control={control}
                  name="tipoInstalacao"
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  errors={errors?.tipoInstalacao?.message}
                />
              </SelectContainer>

              <SelectContainer className="w-full px-3 py-2">
                <InputLabel
                  label="Qual a espécie de abelha sem ferrão pretende criar?"
                  name="role"
                />
                <Select
                  options={especiesAbelhasOptions}
                  control={control}
                  name="especieAbelha"
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  errors={errors?.especieAbelha?.message}
                />
              </SelectContainer>

              <SelectContainer className="w-full px-3 py-2">
                <InputLabel
                  label="Quantas Colméias pretende instalar nesse meliponário?"
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
                  label="Há outros meliponários no raio de 1 KM?"
                  name="outrosMeliponariosRaio1km"
                />
                <Select
                  options={outrosApiariosRaio3kmOptions}
                  control={control}
                  name="outrosMeliponariosRaio1km"
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  errors={errors?.outrosMeliponariosRaio1km?.message}
                />
              </SelectContainer>

              {outrosMeliponariosRaio1km === 'true' && (
                <SelectContainer className="w-full px-3 py-2">
                  <InputLabel
                    label="Caso haja outros meliponários no raio de 1 KM, qual a quantidade de colméias?"
                    name="qtdColmeiasOutrosApiarios"
                  />
                  <Select
                    options={qtdColmeiasOutrosApiariosOptions}
                    control={control}
                    name="qtdColmeiasOutrosMeliponarios"
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    errors={errors?.qtdColmeiasOutrosApiarios?.message}
                  />
                </SelectContainer>
              )}

              <SelectContainer className="w-full px-3 py-2">
                <InputLabel
                  label="Há fontes de néctar e pólen (flores) até 2km do local que pretende instalar o apiário?"
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
                  label="O local onde pretende instalar seu meliponário atende a uma distancia mínima (400m) de currais, casas, escolas, estradas movimentadas, aviários e outras construções?"
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
                  label="O local possui uma distância segura (3km) de lavouras (milho, soja, transgênicos, dentre outros)?"
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
            </div>

            <button
              disabled={disabled}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Cadastrar
            </button>
          </form>
        </div>

        <div>
          <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Selecione as Coordenadas
          </p>
          <MapContainer
            center={[-2.5555334824608353, -44.208297729492195]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

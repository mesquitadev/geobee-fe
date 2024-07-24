import { useCallback, useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'
import Breadcumbs from '../../components/Breadcumbs'
import kml from '../../components/Mapa/geobee-2023.kml'
import 'leaflet/dist/leaflet.css'
import * as turf from '@turf/turf'
import * as toGeoJSON from '@tmcw/togeojson'
import { calcularRaioVoo } from '../../utils'
import { Link } from 'react-router-dom'

const calcularCapacidadeSuporteApicultura = (areaTotal: number) => {
  const capacidadeSuporte = areaTotal / 7.07
  return Math.round(capacidadeSuporte)
}

export default function MyMeliponaries() {
  const { loading, setLoading } = useLoading()
  const [apiaries, setApiaries] = useState(null)
  const [geoJson, setGeoJson] = useState()

  useEffect(() => {
    const getMyData = async () => {
      try {
        setLoading(true) // Ativa o estado de carregamento antes da chamada da API
        const { data } = await api.get('/meliponary')
        setApiaries(data)
      } catch (err) {
        console.error(err) // Melhor tratamento de erro
      } finally {
        setLoading(false) // Desativa o estado de carregamento após a chamada da API
      }
    }

    getMyData() // Chama a função dentro do useEffect
  }, [setLoading]) // Dependências vazias significam que isso roda apenas uma vez, na montagem do componente

  const fetchAndProcessKML = useCallback(
    async (kmlUrl) => {
      try {
        setLoading(true)
        const res = await fetch(kmlUrl)
        const kmlText = await res.text()
        const parser = new DOMParser()
        const kml = parser.parseFromString(kmlText, 'text/xml')
        const convertedGeoJson = toGeoJSON.kml(kml)
        setGeoJson(convertedGeoJson)
      } catch (error) {
        console.error('Erro ao processar o KML:', error)
      } finally {
        setLoading(false)
      }
    },
    [setLoading],
  )

  useEffect(() => {
    fetchAndProcessKML(kml)
  }, [fetchAndProcessKML, loading, setLoading])

  async function analisarAreaEExibirSuporte(userData, geojsonData) {
    if (!loading) {
      const lat = Number(userData.latitude)
      const lng = Number(userData.longitude)
      const centro = turf.point([lat, lng])
      const { raioVooDEC } = calcularRaioVoo({
        tipoCadastro: userData.role,
      })

      const buffer = turf.buffer(centro, raioVooDEC, { units: 'kilometers' })

      // Processar GeoJSON diretamente
      const featuresDentroBuffer = geojsonData.features.filter((feature) => {
        return turf.booleanIntersects(feature, buffer)
      })

      const areas = {}
      featuresDentroBuffer.forEach((feature) => {
        const nomeCamada = feature.properties.VEGETAÇÃ
        const area = parseFloat(feature.properties['AREA (Ha)'])
        if (!areas[nomeCamada]) {
          areas[nomeCamada] = 0
        }
        areas[nomeCamada] += area
      })

      console.log(areas)

      const areaTotal =
        Number(areas.URBANO) + Number(areas.ARBUSTIVO) + Number(areas.HERBACEO)
      const suporteApicultura = calcularCapacidadeSuporteApicultura(areaTotal)

      console.log('asdasd', suporteApicultura)

      return suporteApicultura
    }
  }

  const [resultadosSuporte, setResultadosSuporte] = useState({})

  useEffect(() => {
    apiaries?.forEach(async (brand) => {
      const resultado = await analisarAreaEExibirSuporte(brand, geoJson)
      setResultadosSuporte((prevResultados) => ({
        ...prevResultados,
        [brand.id]: resultado,
      }))

      console.log(resultado)
    })
  }, [analisarAreaEExibirSuporte, apiaries, geoJson])

  return (
    <div className="w-full h-full p-10">
      <Breadcumbs pageName="Meus Meliponários" />

      <div className="py-5 justify-end items-end">
        <Link
          to="/meus-meliponarios/novo"
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="flex rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Adicionar Meliponário
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Top Channels
        </h4>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Nome
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tipo Instalação
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tipo
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Capacidade Suporte
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Ações
              </h5>
            </div>
          </div>

          {apiaries?.map((brand, key) => {
            return (
              <div
                className={`grid grid-cols-3 sm:grid-cols-5 ${
                  key === apiaries.length - 1
                    ? ''
                    : 'border-b border-stroke dark:border-strokedark'
                }`}
                key={key}
              >
                <div className="flex items-center gap-3 p-2.5 xl:p-5">
                  <p className="hidden text-black sm:block">{brand.name}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black">{brand.tipoInstalacao}</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{resultadosSuporte[brand.id]}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black dark:text-white">{brand.sales}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div
        id="authentication-modal"
        tabIndex="-1"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sign in to our platform
              </h3>
              <button
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                        required
                      />
                    </div>
                    <label
                      htmlFor="remember"
                      className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Lost Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login to your account
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  Not registered?{' '}
                  <a
                    href="#"
                    className="text-blue-700 hover:underline dark:text-blue-500"
                  >
                    Create account
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'
import Breadcumbs from '../../components/Breadcumbs'
import 'leaflet/dist/leaflet.css'
import { Link } from 'react-router-dom'
import BackdropLoading from '../../components/BackdropLoading/index.tsx'

export default function MyApiaries() {
  const { loading, setLoading } = useLoading()
  const [apiaries, setApiaries] = useState(null)

  useEffect(() => {
    const getMyData = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/apiary')
        setApiaries(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getMyData()
  }, [setLoading])

  return (
    <div className="w-full h-full p-10">
      <BackdropLoading isLoading={loading} />
      <Breadcumbs pageName="Meus Apiários" />

      <div className="py-5 justify-end items-end">
        <Link
          to="/meus-apiarios/novo"
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="flex rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Adicionar Apiário
        </Link>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Meus Apiários
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
                  <p className="text-meta-3">APIÁRIO</p>
                </div>

                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-meta-3">{brand.capacidadeDeSuporte}</p>
                </div>

                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-black">Editar / Apagar</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

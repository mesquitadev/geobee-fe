import Mapa from '../../components/Mapa'
import { useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'
import BackdropLoading from '../../components/BackdropLoading'
import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet'

export default function Home() {
  const { loading, setLoading } = useLoading()
  const [userData, setUserData] = useState(null)
  const [businessData, setBusinessData] = useState(null)
  const [geojsonData, setGeojsonData] = useState(null)
  useEffect(() => {
    const getMyData = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/mesquitadev/geobee-fe/main/src/components/Mapa/geobee.geojson',
        )
        const geojsonData = await response.json()
        setGeojsonData(geojsonData)
        setLoading(true) // Ativa o estado de carregamento antes da chamada da API
        const { data } = await api.get('/apiary/all')
        setBusinessData(data)
      } catch (err) {
        console.error(err) // Melhor tratamento de erro
      } finally {
        setLoading(false) // Desativa o estado de carregamento após a chamada da API
      }

      try {
        setLoading(true) // Ativa o estado de carregamento antes da chamada da API
        const { data } = await api.get('/user/me')
        setUserData(data)
      } catch (err) {
        console.error(err) // Melhor tratamento de erro
      } finally {
        setLoading(false) // Desativa o estado de carregamento após a chamada da API
      }
    }

    getMyData() // Chama a função dentro do useEffect
  }, [setLoading]) // Dependências vazias significam que isso roda apenas uma vez, na montagem do componente

  return (
    <>
      <BackdropLoading isLoading={loading} />
      {/* <Mapa userData={userData} businessData={businessData} loading={loading} /> */}
      <MapContainer
        center={[-2.5555334824608353, -44.208297729492195]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON data={geojsonData} />

        {businessData.map((data) => (
          <Marker
            key={data.id}
            position={[Number(data.latitude), Number(data.longitude)]}
          />
        ))}
      </MapContainer>
    </>
  )
}

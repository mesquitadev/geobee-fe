import Mapa from '../../components/Mapa'
import { useEffect, useState } from 'react'
import api from '../../services'
import { useLoading } from '../../hooks/useLoading.tsx'

export default function Home() {
  const { loading, setLoading } = useLoading()
  const [userData, setUserData] = useState(null)
  const [businessData, setBusinessData] = useState(null)
  useEffect(() => {
    const getMyData = async () => {
      try {
        setLoading(true) // Ativa o estado de carregamento antes da chamada da API
        const { data } = await api.get('/apiary')
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

  // Renderiza o componente Mapa somente se userData não for null
  return loading ? (
    <div>carregando...</div>
  ) : userData ? (
    <Mapa userData={userData} businessData={businessData} loading={loading} />
  ) : (
    <div>Sem dados disponíveis</div>
  )
}

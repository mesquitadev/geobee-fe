import NavItem from './NavItem.tsx'
import { Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../../services'
import { useLoading } from '../../../hooks/useLoading.tsx'

const AdminMenu = () => (
  <nav className="flex flex-col gap-0.5">
    <NavItem to="/home" icon={Home} title="Início" />
  </nav>
)

const ApicultorMenu = () => (
  <nav className="flex flex-col gap-0.5">
    <NavItem icon={Home} title="Início" to="/home" />
    <NavItem icon={Home} title="Meu Apiário" to="/meus-apiarios" />
  </nav>
)

const MeliponicultorMenu = () => (
  <nav className="flex flex-col gap-0.5">
    <NavItem icon={Home} title="Início" to="/home" />
    <NavItem icon={Home} title="Meu Meliponário" to="meus-meliponarios" />
  </nav>
)

const DefaultMenu = () => (
  <nav className="flex flex-col gap-0.5">
    <NavItem icon={Home} title="Início" />
  </nav>
)

const Navigation = () => {
  const { setLoading } = useLoading()
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    const getMyData = async () => {
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

  const Menu = ({ role }: { role: string | undefined | null }) => {
    switch (role) {
      case 'ADMIN':
        return <AdminMenu />
      case 'MELIPONICULTOR':
        return <MeliponicultorMenu />
      case 'APICULTOR':
        return <ApicultorMenu />
      default:
        return <DefaultMenu />
    }
  }

  return <Menu role={userData?.role} />
}

export default Navigation

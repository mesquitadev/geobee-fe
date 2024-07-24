import './App.css'
import 'leaflet/dist/leaflet.css'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import AppProvider from './providers/AppProvider.tsx'
import { SnackbarProvider } from 'notistack'

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AppProvider>
          <Routes />
        </AppProvider>
      </SnackbarProvider>
    </BrowserRouter>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from './auth.jsx'
import Login from './pages/Login.jsx'
import Registrazione from './pages/Registrazione.jsx'
import Dashboard from './pages/Dashboard.jsx'

function Protetta({ children }) {
  const { utente } = useAuth()
  return utente ? children : <Navigate to="/login" replace />
}

function SoloOspiti({ children }) {
  const { utente } = useAuth()
  return utente ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<SoloOspiti><Login /></SoloOspiti>} />
      <Route path="/registrazione" element={<SoloOspiti><Registrazione /></SoloOspiti>} />
      <Route path="/dashboard" element={<Protetta><Dashboard /></Protetta>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

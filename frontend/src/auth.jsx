import { createContext, useContext, useEffect, useState } from 'react'

// Il backend non ha token né sessione: l'utente restituito dal login
// viene tenuto nello state e in localStorage. Il logout lo cancella.
const CHIAVE = 'quieto.utente'
const AuthContext = createContext(null)

function leggiUtente() {
  try {
    return JSON.parse(localStorage.getItem(CHIAVE))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(leggiUtente)

  useEffect(() => {
    try {
      if (utente) localStorage.setItem(CHIAVE, JSON.stringify(utente))
      else localStorage.removeItem(CHIAVE)
    } catch {
      // storage non disponibile: l'utente resta solo nello state
    }
  }, [utente])

  const valore = {
    utente,
    accedi: setUtente,
    esci: () => setUtente(null),
    // Nessun endpoint per rileggere il saldo: dopo un bonifico eseguito lo aggiorniamo qui.
    scalaSaldo: (importo) =>
      setUtente((u) => ({ ...u, saldo: Math.round((Number(u.saldo) - importo) * 100) / 100 })),
  }

  return <AuthContext.Provider value={valore}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

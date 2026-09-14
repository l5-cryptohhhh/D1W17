// Unico punto di contatto con il backend. Gli URL sono relativi: in sviluppo
// ci pensa il proxy di Vite a inoltrarli a http://localhost:8080.

async function richiesta(metodo, url, body) {
  let risposta
  try {
    risposta = await fetch(url, {
      method: metodo,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Impossibile contattare il server. Controlla la connessione.')
  }

  // Alcune risposte sono testo semplice, gli errori e gli oggetti sono JSON.
  const testo = await risposta.text()
  let dati = testo
  try {
    dati = JSON.parse(testo)
  } catch {
    // risposta testuale: la teniamo così com'è
  }

  if (!risposta.ok) {
    const messaggio =
      dati?.messaggio ||
      (risposta.status >= 500
        ? 'Il server non risponde: controlla che il backend sia avviato.'
        : `Errore ${risposta.status}`)
    const errore = new Error(maiuscola(messaggio))
    errore.status = risposta.status
    throw errore
  }

  return typeof dati === 'string' ? maiuscola(dati) : dati
}

function maiuscola(testo) {
  return testo.charAt(0).toUpperCase() + testo.slice(1)
}

export const api = {
  registrazione: (dati) => richiesta('POST', '/api/auth/registrazione', dati),
  login: (email, password) => richiesta('POST', '/api/auth/login', { email, password }),
  richiediCodice: (email) => richiesta('POST', '/api/auth/codice', { email }),
  loginCodice: (email, codice) => richiesta('POST', '/api/auth/login-codice', { email, codice }),
  creaBonifico: (contoPartenzaId, contoDestinazioneId, importo) =>
    richiesta('POST', '/api/bonifici', { contoPartenzaId, contoDestinazioneId, importo }),
  confermaBonifico: (id, codice) => richiesta('POST', `/api/bonifici/${id}/conferma`, { codice }),
}

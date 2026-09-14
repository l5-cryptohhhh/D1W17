import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, EnvelopeSimple } from '@phosphor-icons/react'
import { api } from '../api.js'
import AuthLayout from '../components/AuthLayout.jsx'
import { Avviso, Bezel, Bottone, Campo, leggiImporto } from '../components/ui.jsx'

const vuoto = { nome: '', cognome: '', email: '', password: '', importoIniziale: '' }

export default function Registrazione() {
  const navigate = useNavigate()
  const [dati, setDati] = useState(vuoto)
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)
  const [conferma, setConferma] = useState(null)

  function aggiorna(e) {
    setDati({ ...dati, [e.target.name]: e.target.value })
  }

  async function invia(e) {
    e.preventDefault()
    const importo = leggiImporto(dati.importoIniziale)
    if (importo === null) {
      setErrore('Inserisci un importo iniziale valido, ad esempio 250 oppure 99,90.')
      return
    }

    setErrore('')
    setCaricamento(true)
    try {
      const testo = await api.registrazione({
        nome: dati.nome.trim(),
        cognome: dati.cognome.trim(),
        email: dati.email.trim(),
        password: dati.password,
        importoIniziale: importo,
      })
      setConferma({ testo, email: dati.email.trim() })
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }

  return (
    <AuthLayout>
      <Bezel coreClassName="p-6 sm:p-10">
        {conferma ? (
          <div className="animate-rise py-4 text-center">
            <span className="mx-auto flex size-18 items-center justify-center rounded-full bg-moss-50 text-moss-700 ring-8 ring-moss-50/50">
              <EnvelopeSimple size={30} weight="light" />
            </span>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight">Controlla la tua email</h2>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Abbiamo scritto a <span className="font-medium text-ink">{conferma.email}</span>. Apri
              il link di conferma per attivare il conto, poi torna qui per accedere.
            </p>
            {conferma.testo && (
              <div className="mx-auto mt-6 max-w-sm text-left">
                <Avviso tono="successo">{conferma.testo}</Avviso>
              </div>
            )}
            <Bottone icona={ArrowRight} onClick={() => navigate('/login')} className="mt-8">
              Vai all'accesso
            </Bottone>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">Apri il tuo conto</h2>
            <p className="mt-1.5 text-sm text-muted">
              Ti chiediamo solo l'essenziale. Il conto si attiva dopo la conferma via email.
            </p>

            <form onSubmit={invia} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Campo id="nome" name="nome" etichetta="Nome" autoComplete="given-name" required value={dati.nome} onChange={aggiorna} />
                <Campo id="cognome" name="cognome" etichetta="Cognome" autoComplete="family-name" required value={dati.cognome} onChange={aggiorna} />
              </div>
              <Campo
                id="email"
                name="email"
                etichetta="Email"
                type="email"
                autoComplete="email"
                placeholder="nome@esempio.it"
                suggerimento="Usa un indirizzo reale: riceverai il link di conferma."
                required
                value={dati.email}
                onChange={aggiorna}
              />
              <Campo
                id="password"
                name="password"
                etichetta="Password"
                type="password"
                autoComplete="new-password"
                required
                value={dati.password}
                onChange={aggiorna}
              />
              <Campo
                id="importoIniziale"
                name="importoIniziale"
                etichetta="Importo iniziale del conto"
                prefisso="€"
                inputMode="decimal"
                placeholder="0,00"
                required
                value={dati.importoIniziale}
                onChange={aggiorna}
                className="[&_input]:tabular-nums"
              />

              <Avviso>{errore}</Avviso>

              <Bottone type="submit" icona={ArrowRight} caricamento={caricamento} className="w-full">
                Crea il conto
              </Bottone>
            </form>

            <p className="mt-8 border-t border-ink/[0.06] pt-6 text-center text-sm text-muted">
              Hai già un conto?{' '}
              <Link to="/login" className="font-semibold text-moss-700 underline-offset-4 hover:underline">
                Accedi
              </Link>
            </p>
          </>
        )}
      </Bezel>
    </AuthLayout>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, EnvelopeSimple, Eye, EyeSlash } from '@phosphor-icons/react'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'
import AuthLayout from '../components/AuthLayout.jsx'
import { Avviso, Bezel, Bottone, Campo } from '../components/ui.jsx'

const modi = [
  ['password', 'Password'],
  ['codice', 'Codice via email'],
]

export default function Login() {
  const { accedi } = useAuth()
  const navigate = useNavigate()

  const [modo, setModo] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostraPassword, setMostraPassword] = useState(false)
  const [codice, setCodice] = useState('')
  const [codiceInviato, setCodiceInviato] = useState(false)
  const [messaggio, setMessaggio] = useState('')
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)

  function cambiaModo(nuovo) {
    setModo(nuovo)
    setErrore('')
  }

  async function esegui(azione) {
    setErrore('')
    setCaricamento(true)
    try {
      await azione()
    } catch (e) {
      setErrore(e.message)
    } finally {
      setCaricamento(false)
    }
  }

  function entra(utente) {
    accedi(utente)
    navigate('/dashboard', { replace: true })
  }

  function invia(e) {
    e.preventDefault()
    if (modo === 'password') {
      esegui(async () => entra(await api.login(email.trim(), password)))
    } else if (!codiceInviato) {
      esegui(async () => {
        setMessaggio(await api.richiediCodice(email.trim()))
        setCodiceInviato(true)
      })
    } else {
      esegui(async () => entra(await api.loginCodice(email.trim(), codice.trim())))
    }
  }

  function cambiaEmail() {
    setCodiceInviato(false)
    setCodice('')
    setMessaggio('')
    setErrore('')
  }

  const testoBottone =
    modo === 'password' ? 'Accedi' : codiceInviato ? 'Accedi con il codice' : 'Inviami il codice'

  return (
    <AuthLayout>
      <Bezel coreClassName="p-6 sm:p-10">
        <h2 className="text-2xl font-semibold tracking-tight">Bentornato</h2>
        <p className="mt-1.5 text-sm text-muted">Scegli come preferisci entrare nel tuo conto.</p>

        <div role="tablist" className="relative mt-8 grid grid-cols-2 rounded-full bg-ink/[0.045] p-1">
          <span
            aria-hidden="true"
            className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-float transition-transform duration-700 ease-soft ${modo === 'codice' ? 'translate-x-full' : ''}`}
          />
          {modi.map(([valore, etichetta]) => (
            <button
              key={valore}
              type="button"
              role="tab"
              aria-selected={modo === valore}
              onClick={() => cambiaModo(valore)}
              className={`relative rounded-full py-2.5 text-sm font-medium transition-colors duration-500 ease-soft ${modo === valore ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {etichetta}
            </button>
          ))}
        </div>

        <form onSubmit={invia} className="mt-8 space-y-5">
          <Campo
            id="email"
            etichetta="Email"
            type="email"
            autoComplete="email"
            placeholder="nome@esempio.it"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={modo === 'codice' && codiceInviato}
          />

          {modo === 'password' && (
            <Campo
              id="password"
              etichetta="Password"
              type={mostraPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="La tua password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              azione={
                <button
                  type="button"
                  onClick={() => setMostraPassword((v) => !v)}
                  aria-label={mostraPassword ? 'Nascondi password' : 'Mostra password'}
                  className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-500 ease-soft hover:bg-ink/[0.05] hover:text-ink"
                >
                  {mostraPassword ? <EyeSlash size={18} weight="light" /> : <Eye size={18} weight="light" />}
                </button>
              }
            />
          )}

          {modo === 'codice' && !codiceInviato && (
            <p className="flex items-start gap-3 rounded-2xl bg-moss-50/70 px-4 py-3 text-sm leading-relaxed text-moss-700">
              <EnvelopeSimple size={18} weight="light" className="mt-0.5 shrink-0" />
              Ti mandiamo un codice monouso all'indirizzo con cui ti sei registrato.
            </p>
          )}

          {modo === 'codice' && codiceInviato && (
            <div className="animate-rise space-y-5">
              <Avviso tono="successo">{messaggio || 'Codice inviato, controlla la tua email.'}</Avviso>
              <Campo
                id="codice"
                etichetta="Codice di accesso"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                required
                autoFocus
                value={codice}
                onChange={(e) => setCodice(e.target.value)}
                className="[&_input]:tracking-[0.3em]"
                suggerimento="Il codice vale per un solo accesso."
              />
            </div>
          )}

          <Avviso>{errore}</Avviso>

          <Bottone type="submit" icona={ArrowRight} caricamento={caricamento} className="w-full">
            {testoBottone}
          </Bottone>

          {modo === 'codice' && codiceInviato && (
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
              <button type="button" onClick={cambiaEmail} className="text-muted underline-offset-4 hover:text-ink hover:underline">
                Cambia email
              </button>
              <button
                type="button"
                disabled={caricamento}
                onClick={() => esegui(async () => setMessaggio(await api.richiediCodice(email.trim())))}
                className="text-muted underline-offset-4 hover:text-ink hover:underline disabled:opacity-50"
              >
                Invia di nuovo
              </button>
            </div>
          )}
        </form>

        <p className="mt-8 border-t border-ink/[0.06] pt-6 text-center text-sm text-muted">
          Non hai ancora un conto?{' '}
          <Link to="/registrazione" className="font-semibold text-moss-700 underline-offset-4 hover:underline">
            Aprilo ora
          </Link>
        </p>
      </Bezel>
    </AuthLayout>
  )
}

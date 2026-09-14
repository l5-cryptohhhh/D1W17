import { useEffect, useState } from 'react'
import { Check, CheckCircle, Clock, Copy, SignOut, Tray } from '@phosphor-icons/react'
import { useAuth } from '../auth.jsx'
import BonificoCard from '../components/BonificoCard.jsx'
import { Bezel, Bottone, Etichetta, Logo, euro } from '../components/ui.jsx'

function saluto() {
  const ora = new Date().getHours()
  if (ora < 13) return 'Buongiorno'
  if (ora < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}

// Il backend non espone lo storico: teniamo i bonifici avviati da questo browser.
function useBonificiLocali(utenteId) {
  const chiave = `quieto.bonifici.${utenteId}`
  const [lista, setLista] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(chiave)) ?? []
    } catch {
      return []
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(chiave, JSON.stringify(lista))
    } catch {
      // storage non disponibile
    }
  }, [chiave, lista])
  return [lista, setLista]
}

function Importo({ valore }) {
  const parti = euro.formatToParts(Number(valore))
  const intero = parti
    .filter((p) => ['minusSign', 'integer', 'group'].includes(p.type))
    .map((p) => p.value)
    .join('')
  const decimali = parti.find((p) => p.type === 'fraction')?.value ?? '00'
  return (
    <span className="tabular-nums">
      {intero}
      <span className="text-[0.42em] font-medium tracking-normal text-moss-100/70">,{decimali} €</span>
    </span>
  )
}

export default function Dashboard() {
  const { utente, esci, scalaSaldo } = useAuth()
  const [bonifici, setBonifici] = useBonificiLocali(utente.id)
  const [attivoId, setAttivoId] = useState(null)
  const [eseguito, setEseguito] = useState(null)
  const [copiato, setCopiato] = useState(false)

  const attivo = bonifici.find((b) => b.id === attivoId) ?? null
  const iniziali = `${utente.nome?.[0] ?? ''}${utente.cognome?.[0] ?? ''}`.toUpperCase()

  function creato(bonifico) {
    setBonifici((lista) => [{ ...bonifico, data: new Date().toISOString() }, ...lista])
    setEseguito(null)
    setAttivoId(bonifico.id)
  }

  function confermato(bonifico) {
    setBonifici((lista) => lista.map((b) => (b.id === bonifico.id ? { ...b, ...bonifico } : b)))
    scalaSaldo(Number(bonifico.importo))
    setAttivoId(null)
    setEseguito(bonifico)
  }

  async function copiaConto() {
    try {
      await navigator.clipboard.writeText(String(utente.contoId))
      setCopiato(true)
      setTimeout(() => setCopiato(false), 1800)
    } catch {
      // appunti non disponibili: il numero resta comunque visibile
    }
  }

  return (
    <div className="min-h-[100dvh] px-4 pb-16 md:px-8">
      <header className="sticky top-4 z-40 mx-auto mt-4 max-w-6xl animate-rise">
        <nav className="flex items-center justify-between rounded-full bg-white/70 py-2 pr-2 pl-4 shadow-soft ring-1 ring-ink/[0.06] backdrop-blur-xl">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2.5 pr-2 text-sm sm:flex">
              <span className="flex size-8 items-center justify-center rounded-full bg-moss-100 text-xs font-semibold text-moss-700">
                {iniziali}
              </span>
              {utente.nome} {utente.cognome}
            </span>
            <Bottone variante="fantasma" icona={SignOut} onClick={esci} className="min-h-11 py-1 text-sm">
              Esci
            </Bottone>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        <section className="mt-14 animate-rise [animation-delay:80ms] md:mt-24">
          <Etichetta>{saluto()}</Etichetta>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] md:text-6xl">Ciao, {utente.nome}.</h1>
          <p className="mt-3 text-base text-muted md:text-lg">Ecco il tuo conto, a colpo d'occhio.</p>
        </section>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-12 md:gap-6">
          <Bezel
            tono="scuro"
            className="animate-rise [animation-delay:160ms] md:col-span-7"
            coreClassName="relative overflow-hidden p-7 sm:p-10"
          >
            <span aria-hidden="true" className="absolute -top-28 -right-16 size-80 rounded-full bg-moss-500/45 blur-3xl" />
            <span aria-hidden="true" className="absolute -bottom-32 left-10 size-64 rounded-full bg-clay-300/15 blur-3xl" />
            <div className="relative flex h-full min-h-56 flex-col justify-between gap-10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-moss-100/75">Saldo disponibile</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-moss-100 uppercase">
                  EUR
                </span>
              </div>
              <p className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
                <Importo valore={utente.saldo} />
              </p>
              <p className="text-xs leading-relaxed text-moss-100/60">
                Aggiornato all'accesso e dopo ogni bonifico eseguito da qui.
              </p>
            </div>
          </Bezel>

          <Bezel className="animate-rise [animation-delay:240ms] md:col-span-5" coreClassName="flex flex-col p-7 sm:p-9">
            <p className="text-sm text-muted">Il tuo numero di conto</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-5xl font-semibold tracking-tight tabular-nums">{utente.contoId}</p>
              <button
                type="button"
                onClick={copiaConto}
                className="inline-flex items-center gap-2 rounded-full bg-moss-50 px-4 py-2 text-sm font-medium text-moss-700 transition-[background-color,transform] duration-500 ease-soft hover:bg-moss-100 active:scale-[0.97]"
              >
                {copiato ? <Check size={16} weight="light" /> : <Copy size={16} weight="light" />}
                {copiato ? 'Copiato' : 'Copia'}
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">Comunicalo a chi deve inviarti un bonifico.</p>
            <div className="min-h-7 flex-1" />
            <dl className="space-y-3 border-t border-ink/[0.06] pt-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Intestatario</dt>
                <dd className="truncate font-medium">
                  {utente.nome} {utente.cognome}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="truncate font-medium">{utente.email}</dd>
              </div>
            </dl>
          </Bezel>

          <Bezel className="animate-rise [animation-delay:320ms] md:col-span-7">
            <BonificoCard
              key={attivo?.id ?? 'nuovo'}
              utente={utente}
              attivo={attivo}
              eseguito={eseguito}
              onCreato={creato}
              onEseguito={confermato}
              onAnnulla={() => setAttivoId(null)}
              onNuovo={() => setEseguito(null)}
            />
          </Bezel>

          <Bezel className="animate-rise [animation-delay:400ms] md:col-span-5" coreClassName="p-6 sm:p-9">
            <h2 className="text-xl font-semibold tracking-tight">I tuoi bonifici</h2>
            <p className="mt-1 text-sm text-muted">Quelli avviati da questo dispositivo.</p>

            {bonifici.length === 0 ? (
              <div className="mt-10 flex flex-col items-center py-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-canvas text-muted">
                  <Tray size={24} weight="light" />
                </span>
                <p className="mt-4 text-sm text-muted">Nessun bonifico per ora.</p>
              </div>
            ) : (
              <ul className="-mx-2 mt-6 max-h-[26rem] space-y-1 overflow-y-auto">
                {bonifici.map((b) => {
                  const inAttesa = b.stato === 'IN_ATTESA'
                  return (
                    <li
                      key={b.id}
                      className={`flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors duration-500 ease-soft ${b.id === attivoId ? 'bg-honey-50/70' : 'hover:bg-canvas/70'}`}
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${inAttesa ? 'bg-honey-50 text-honey-700' : 'bg-moss-50 text-moss-700'}`}
                      >
                        {inAttesa ? <Clock size={18} weight="light" /> : <CheckCircle size={18} weight="light" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">Verso conto n. {b.contoDestinazioneId}</p>
                        <p className="text-xs text-muted">
                          {new Date(b.data).toLocaleString('it-IT', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' · '}
                          {inAttesa ? 'In attesa' : 'Eseguito'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold tabular-nums">−{euro.format(Number(b.importo))}</span>
                        {inAttesa && b.id !== attivoId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEseguito(null)
                              setAttivoId(b.id)
                            }}
                            className="text-xs font-semibold text-moss-700 underline-offset-4 hover:underline"
                          >
                            Autorizza
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Bezel>
        </div>

        <p className="mt-16 text-center text-xs text-muted">Quieto · progetto didattico Epicode D1W17</p>
      </main>
    </div>
  )
}

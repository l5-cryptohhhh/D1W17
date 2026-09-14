import { useState } from 'react'
import { ArrowRight, CheckCircle, ShieldCheck } from '@phosphor-icons/react'
import { api } from '../api.js'
import { Avviso, Bottone, Campo, euro, leggiImporto } from './ui.jsx'

const passi = ['Dati', 'Codice', 'Fatto']

/**
 * Bonifico in due passi: dati -> bonifico IN_ATTESA -> codice -> ESEGUITO.
 * Lo stato "attivo" e "eseguito" arriva dalla Dashboard, i campi restano locali.
 */
export default function BonificoCard({ utente, attivo, eseguito, onCreato, onEseguito, onAnnulla, onNuovo }) {
  const [destinatario, setDestinatario] = useState('')
  const [importo, setImporto] = useState('')
  const [codice, setCodice] = useState('')
  const [errore, setErrore] = useState('')
  const [caricamento, setCaricamento] = useState(false)

  const passo = attivo ? 2 : eseguito ? 3 : 1

  async function esegui(azione) {
    setErrore('')
    setCaricamento(true)
    try {
      await azione()
    } catch (e) {
      setErrore(e.message)
      setCaricamento(false)
    }
  }

  function crea(e) {
    e.preventDefault()
    const conto = Number(destinatario)
    const euroImporto = leggiImporto(importo)
    if (!Number.isInteger(conto) || conto <= 0) return setErrore('Inserisci un numero di conto valido.')
    if (!euroImporto) return setErrore("Inserisci un importo maggiore di zero, ad esempio 25 oppure 12,50.")
    esegui(async () => onCreato(await api.creaBonifico(utente.contoId, conto, euroImporto)))
  }

  function conferma(e) {
    e.preventDefault()
    esegui(async () => onEseguito(await api.confermaBonifico(attivo.id, codice.trim())))
  }

  return (
    <div className="p-6 sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Nuovo bonifico</h2>
          <p className="mt-1 text-sm text-muted">Prima i dati, poi il codice che ti inviamo via email.</p>
        </div>
        <ol className="flex gap-4 text-xs font-medium">
          {passi.map((nome, i) => (
            <li key={nome} className={`flex items-center gap-1.5 ${i + 1 <= passo ? 'text-moss-700' : 'text-ink/35'}`}>
              <span
                className={`flex size-5 items-center justify-center rounded-full text-[10px] ${i + 1 <= passo ? 'bg-moss-100' : 'bg-ink/[0.05]'}`}
              >
                {i + 1}
              </span>
              {nome}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-ink/[0.05]">
        <div
          className="h-full origin-left rounded-full bg-moss-500 transition-transform duration-1000 ease-soft"
          style={{ transform: `scaleX(${passo / 3})` }}
        />
      </div>

      {passo === 1 && (
        <form onSubmit={crea} className="mt-8 animate-rise space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              id="destinatario"
              etichetta="Numero di conto destinatario"
              inputMode="numeric"
              placeholder="Es. 2"
              required
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              className="[&_input]:tabular-nums"
            />
            <Campo
              id="importo"
              etichetta="Importo"
              prefisso="€"
              inputMode="decimal"
              placeholder="0,00"
              required
              value={importo}
              onChange={(e) => setImporto(e.target.value)}
              suggerimento={`Disponibili ${euro.format(Number(utente.saldo))}`}
              className="[&_input]:tabular-nums"
            />
          </div>
          <Avviso>{errore}</Avviso>
          <Bottone type="submit" icona={ArrowRight} caricamento={caricamento} className="w-full sm:w-auto">
            Continua
          </Bottone>
        </form>
      )}

      {passo === 2 && (
        <form onSubmit={conferma} className="mt-8 animate-rise space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-canvas/70 p-5">
            <div>
              <p className="text-xs text-muted">Bonifico n. {attivo.id} verso il conto n. {attivo.contoDestinazioneId}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
                {euro.format(Number(attivo.importo))}
              </p>
            </div>
            <span className="rounded-full bg-honey-50 px-3 py-1 text-xs font-medium text-honey-700">In attesa</span>
          </div>

          <Avviso tono="info">
            Ti abbiamo inviato un codice di 6 cifre a {utente.email}. I soldi partono solo dopo averlo
            inserito.
          </Avviso>

          <Campo
            id="codice-bonifico"
            etichetta="Codice di autorizzazione"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            required
            autoFocus
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="[&_input]:tracking-[0.3em] [&_input]:tabular-nums"
          />

          <Avviso>{errore}</Avviso>

          <div className="flex flex-wrap items-center gap-3">
            <Bottone type="submit" icona={ShieldCheck} caricamento={caricamento}>
              Autorizza bonifico
            </Bottone>
            <Bottone type="button" variante="fantasma" onClick={onAnnulla}>
              Più tardi
            </Bottone>
          </div>
        </form>
      )}

      {passo === 3 && (
        <div className="mt-8 animate-rise text-center sm:text-left">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-moss-50 text-moss-700 ring-8 ring-moss-50/50">
              <CheckCircle size={30} weight="light" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Bonifico eseguito</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {euro.format(Number(eseguito.importo))} inviati al conto n. {eseguito.contoDestinazioneId}. Il
                tuo saldo è già aggiornato.
              </p>
            </div>
          </div>
          <Bottone variante="chiaro" icona={ArrowRight} onClick={onNuovo} className="mt-8">
            Nuovo bonifico
          </Bottone>
        </div>
      )}
    </div>
  )
}

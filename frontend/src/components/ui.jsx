import { CheckCircle, CircleNotch, Info, Plant, WarningCircle } from '@phosphor-icons/react'

export const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

/** "12,50" o "12.50" -> 12.5; null se non è un importo con al massimo due decimali. */
export function leggiImporto(testo) {
  const pulito = testo.trim()
  return /^\d+([.,]\d{1,2})?$/.test(pulito) ? Number(pulito.replace(',', '.')) : null
}

const toniBezel = {
  chiaro: 'bg-white/85 inset-shadow-[0_1px_0_rgb(255_255_255)]',
  scuro: 'bg-moss-900 text-white inset-shadow-[0_1px_0_rgb(255_255_255/0.12)]',
}

/** Contenitore a doppia cornice: guscio esterno leggero + nucleo con ombra diffusa. */
export function Bezel({ tono = 'chiaro', className = '', coreClassName = '', children }) {
  return (
    <div className={`rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-ink/[0.05] ${className}`}>
      <div
        className={`h-full rounded-[calc(2rem-0.375rem)] shadow-soft ${toniBezel[tono]} ${coreClassName}`}
      >
        {children}
      </div>
    </div>
  )
}

const variantiBottone = {
  primario: ['bg-moss-900 text-white shadow-float hover:bg-moss-700', 'bg-white/12 text-moss-100'],
  chiaro: ['bg-white text-ink ring-1 ring-ink/[0.07] hover:bg-moss-50', 'bg-moss-50 text-moss-700'],
  fantasma: ['text-muted hover:bg-ink/[0.04] hover:text-ink', 'bg-ink/[0.05]'],
}

/** Pillola con icona finale annidata nel proprio cerchio. */
export function Bottone({
  variante = 'primario',
  icona: Icona,
  caricamento = false,
  className = '',
  children,
  ...props
}) {
  const [stile, cerchio] = variantiBottone[variante]
  const conIcona = Icona || caricamento
  return (
    <button
      {...props}
      disabled={caricamento || props.disabled}
      className={`group inline-flex min-h-13 items-center justify-center gap-3 rounded-full py-2 text-[0.925rem] font-semibold transition-[background-color,color,transform] duration-500 ease-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${conIcona ? 'pr-2 pl-6' : 'px-6'} ${stile} ${className}`}
    >
      <span>{children}</span>
      {conIcona && (
        <span
          className={`flex size-9 items-center justify-center rounded-full transition-transform duration-500 ease-soft group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${cerchio}`}
        >
          {caricamento ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <Icona size={16} weight="light" />
          )}
        </span>
      )}
    </button>
  )
}

/** Campo di input con etichetta, prefisso e azione opzionali. */
export function Campo({ etichetta, id, suggerimento, prefisso, azione, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[0.8rem] font-medium text-muted">
        {etichetta}
      </label>
      <div className="flex items-center gap-2 rounded-2xl bg-canvas/70 px-4 ring-1 ring-ink/[0.06] transition-[background-color,box-shadow] duration-500 ease-soft focus-within:bg-white focus-within:ring-2 focus-within:ring-moss-500/35">
        {prefisso && <span className="text-[0.95rem] text-muted">{prefisso}</span>}
        <input
          id={id}
          className="h-13 w-full min-w-0 bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-ink/30"
          {...props}
        />
        {azione}
      </div>
      {suggerimento && <p className="mt-1.5 text-xs leading-relaxed text-muted">{suggerimento}</p>}
    </div>
  )
}

const toniAvviso = {
  errore: ['bg-rose-50 text-rose-700', WarningCircle],
  successo: ['bg-moss-50 text-moss-700', CheckCircle],
  info: ['bg-honey-50 text-honey-700', Info],
}

export function Avviso({ tono = 'errore', children }) {
  if (!children) return null
  const [stile, Icona] = toniAvviso[tono]
  return (
    <div
      role={tono === 'errore' ? 'alert' : 'status'}
      className={`flex animate-rise gap-3 rounded-2xl px-4 py-3 text-sm leading-relaxed ${stile}`}
    >
      <Icona size={18} weight="light" className="mt-0.5 shrink-0" />
      <p>{children}</p>
    </div>
  )
}

export function Etichetta({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-moss-100/80 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-moss-700 uppercase ${className}`}
    >
      {children}
    </span>
  )
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-[0.8rem] bg-moss-900 text-moss-100 inset-shadow-[0_1px_0_rgb(255_255_255/0.15)]">
        <Plant size={18} weight="light" />
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight">Quieto</span>
    </span>
  )
}

import { Link } from 'react-router'
import { Password, PaperPlaneTilt, ShieldCheck } from '@phosphor-icons/react'
import { Etichetta, Logo } from './ui.jsx'

const punti = [
  [ShieldCheck, 'Conto attivo solo dopo la conferma via email'],
  [Password, 'Accedi con la password o con un codice monouso'],
  [PaperPlaneTilt, 'Ogni bonifico parte solo con il tuo codice'],
]

/** Layout diviso: messaggio a sinistra, modulo a destra. Su mobile si impila. */
export default function AuthLayout({ children }) {
  return (
    <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-10 px-4 py-8 md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-8 md:py-16">
      <section className="animate-rise">
        <Link to="/login" className="inline-block rounded-xl">
          <Logo />
        </Link>

        <div className="mt-10 md:mt-24">
          <Etichetta>Banca digitale · demo</Etichetta>
          <h1 className="mt-6 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance md:text-[4.25rem]">
            Il tuo denaro,
            <br />
            <span className="text-moss-600">con calma.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted md:text-lg">
            Apri un conto in pochi minuti, accedi come preferisci e autorizza ogni bonifico con un
            codice che arriva solo a te.
          </p>

          <ul className="mt-12 hidden space-y-4 md:block">
            {punti.map(([Icona, testo], i) => (
              <li
                key={testo}
                className="flex animate-rise items-center gap-4 text-[0.95rem] text-ink/80"
                style={{ animationDelay: `${250 + i * 90}ms` }}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/80 text-moss-700 shadow-soft">
                  <Icona size={20} weight="light" />
                </span>
                {testo}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="animate-rise [animation-delay:140ms]">{children}</section>
    </div>
  )
}

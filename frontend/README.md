# Frontend D1W17 · "Quieto"

Interfaccia React per l'app bancaria simulata della Consegna D1. Parla con il backend Spring Boot in `../backend`.

## Stack

- React 19 + Vite
- React Router
- Tailwind CSS v4
- Icone Phosphor, font Plus Jakarta Sans (installati via npm, niente CDN)

## Avvio

1. Avvia prima il backend (vedi il README in root): deve rispondere su `http://localhost:8080`.
2. Poi, in questa cartella:

```bash
npm install
npm run dev
```

3. Apri `http://localhost:5173`.

Il backend non ha CORS, quindi il dev server di Vite inoltra tutte le chiamate `/api/...` a `localhost:8080` (vedi `vite.config.js`). Per questo il frontend usa solo URL relativi.

## Pagine

| Percorso | Cosa fa |
|---|---|
| `/registrazione` | Nome, cognome, email, password, importo iniziale. Poi chiede di aprire il link di conferma ricevuto via email. |
| `/login` | Due modalità: email + password, oppure email + codice ricevuto via email. |
| `/dashboard` | Protetta. Saldo, numero di conto, nuovo bonifico in due passi, elenco dei bonifici avviati. |

## Struttura

```
src/
├── api.js                  chiamate al backend (JSON o testo, errori con `messaggio`)
├── auth.jsx                utente loggato in state + localStorage
├── App.jsx                 rotte e protezione
├── components/
│   ├── ui.jsx              Bezel, Bottone, Campo, Avviso, Logo...
│   ├── AuthLayout.jsx      layout diviso di login e registrazione
│   └── BonificoCard.jsx    dati -> IN_ATTESA -> codice -> ESEGUITO
└── pages/                  Login, Registrazione, Dashboard
```

## Limiti dovuti al backend

- Non ci sono token: il login restituisce solo l'utente, che viene salvato in `localStorage`. Il logout lo cancella.
- Non esistono endpoint GET per saldo o storico. Il saldo è quello ricevuto al login e viene scalato in locale dopo un bonifico eseguito. Se ricevi un bonifico, lo vedi al prossimo accesso.
- L'elenco "I tuoi bonifici" contiene solo i bonifici avviati da questo browser. Da lì puoi riprendere e autorizzare un bonifico rimasto in attesa.

## Prova completa

1. Registra due utenti con email reali e conferma entrambi dal link ricevuto.
2. Accedi con il primo e annota il numero di conto del secondo (lo vede nella sua dashboard).
3. Crea un bonifico verso quel conto: resta **in attesa** e arriva un codice via email.
4. Inserisci il codice: il bonifico diventa **eseguito** e il saldo si aggiorna.

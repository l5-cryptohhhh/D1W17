# Resume per il frontend (da leggere prima di iniziare)

Questo file serve a Claude Code (VS Code) per capire lo stato del progetto e da dove partire con il frontend.

## Il progetto

Esercizio "Consegna D1" (corso Epicode): app bancaria simulata. La consegna è divisa in due cartelle:

```
D1W17/
├── README.md
├── backend/    Spring Boot, COMPLETO: non modificarlo senza chiedere
└── frontend/   VUOTO: da costruire (qui c'è solo questo file)
```

Requisiti della traccia (il backend li copre già tutti):
1. Registrazione con dati personali e importo iniziale del conto.
2. Account disattivato finché l'utente non apre il link di conferma ricevuto via email.
3. Accesso in due modi, con lo stesso risultato: email + password, oppure email + codice ricevuto via email. In entrambi i casi l'account deve essere già confermato.
4. Bonifico non immediato: resta `IN_ATTESA` e va autorizzato con un codice arrivato via email. Solo con il codice giusto i soldi passano da un conto all'altro.

## Backend (già fatto)

- Spring Boot 4.1.1, Java 25, Maven, PostgreSQL (database `banca`), invio email tramite Gmail SMTP.
- Avvio: `cd backend` e poi `./mvnw spring-boot:run` (su Windows `mvnw.cmd spring-boot:run`). Risponde su **http://localhost:8080**.
- Le credenziali stanno in `backend/env.properties` (escluso da git): `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_PASSWORD`. L'app va avviata con working directory `backend/`, altrimenti non trova il file.
- Codice: `backend/src/main/java/org/example/d1w17/` (controller, dto, entity, service, exception).

## API disponibili

Base URL: `http://localhost:8080`

| Metodo | Endpoint | Body JSON | Risposta OK |
|---|---|---|---|
| POST | `/api/auth/registrazione` | `{nome, cognome, email, password, importoIniziale}` | 201, **testo semplice** |
| GET | `/api/auth/conferma?token=...` | – | 200, testo semplice (è il link inviato via email) |
| POST | `/api/auth/login` | `{email, password}` | 200, `Utente` (JSON) |
| POST | `/api/auth/codice` | `{email}` | 200, testo semplice (invia il codice via email) |
| POST | `/api/auth/login-codice` | `{email, codice}` | 200, `Utente` (JSON) |
| POST | `/api/bonifici` | `{contoPartenzaId, contoDestinazioneId, importo}` | 201, `Bonifico` (JSON) |
| POST | `/api/bonifici/{id}/conferma` | `{codice}` | 200, `Bonifico` (JSON) |

Forma delle risposte:
- `Utente` = `{ id, nome, cognome, email, contoId, saldo }`
- `Bonifico` = `{ id, contoPartenzaId, contoDestinazioneId, importo, stato }`, con `stato` pari a `"IN_ATTESA"` oppure `"ESEGUITO"`
- **Errore** (sempre JSON) = `{ status, messaggio }`. Mostrare `messaggio` all'utente: è già in italiano. Se falliscono più validazioni, i messaggi arrivano uniti da `, `.

Errori principali:
- registrazione: 400 validazione, 409 email già registrata
- login: 401 credenziali errate, 403 account non confermato
- richiesta codice: 404 email sconosciuta, 403 account non confermato
- login con codice: 401 codice non valido (il codice vale una volta sola)
- bonifico: 400 conti uguali, 404 conto inesistente
- conferma bonifico: 400 codice errato o saldo insufficiente (il bonifico resta `IN_ATTESA` e si può riprovare), 404 bonifico inesistente, 409 già eseguito

## Cose da sapere PRIMA di scrivere codice

1. **Non c'è configurazione CORS nel backend.** Dal browser le chiamate a `localhost:8080` verranno bloccate. Soluzione senza toccare il backend: usare un **proxy del dev server**, ad esempio in Vite `server.proxy: { '/api': 'http://localhost:8080' }`, e chiamare sempre URL relativi (`/api/...`).
2. **Alcune risposte sono testo, non JSON** (registrazione, conferma, richiesta codice): leggerle con `response.text()`. Gli errori invece sono sempre JSON.
3. **Non ci sono token né sessione.** Il login restituisce solo l'oggetto `Utente`. Il frontend lo salva (state + `localStorage`) e lo usa come "utente loggato". Il logout consiste nel cancellarlo.
4. **Non esistono endpoint GET** per rileggere utente, saldo o elenco bonifici. Il saldo mostrato è quello ricevuto al login: dopo un bonifico `ESEGUITO` va aggiornato in locale (`saldo - importo`). Per aggiungere un endpoint serve una modifica al backend: proporla all'utente, non farla da solo.
5. **Il link di conferma email punta al backend** (`app.url` in `backend/src/main/resources/application.properties`) e mostra un testo semplice. Il frontend non ha bisogno di una pagina di conferma: dopo la registrazione basta dire "controlla la tua email".
6. **Il bonifico usa gli ID dei conti.** `contoPartenzaId` è il `contoId` dell'utente loggato. Il destinatario va inserito come numero di conto, quindi in dashboard bisogna mostrare bene "Il tuo numero di conto: X".
7. Per avere un conto destinatario servono **due utenti registrati e confermati**. Le email arrivano davvero: usare indirizzi reali.

## Da dove partire

Lo stack non è ancora deciso: **chiedere all'utente** prima di creare il progetto. Proposta di default: React + Vite (JavaScript) con React Router, `fetch` e CSS semplice o Bootstrap.

Ordine di lavoro suggerito:
1. Creare il progetto dentro `frontend/`, configurare il proxy `/api` e verificare con il backend acceso.
2. Scrivere un modulo API unico (es. `src/api.js`) che gestisca JSON o testo e lanci un errore con `messaggio`.
3. Pagina **Registrazione**: form con i 5 campi, messaggio di successo "controlla l'email".
4. Pagina **Login** con due modalità (tab): password, oppure codice. Nel secondo caso prima "invia codice", poi si inserisce il codice.
5. **Dashboard** (protetta, senza utente si torna al login): nome, numero di conto, saldo, logout.
6. **Bonifico** in due passi: form (destinatario + importo) → bonifico `IN_ATTESA` → inserimento codice → `ESEGUITO` e saldo aggiornato.
7. Gestire loading ed errori in tutte le chiamate, poi scrivere `frontend/README.md` con le istruzioni di avvio.

Il `README.md` in root è della consegna: aggiornarlo alla fine con le istruzioni per avviare backend e frontend.

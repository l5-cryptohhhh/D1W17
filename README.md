# D1W17

App bancaria simulata (Consegna D1, Epicode): registrazione con conferma via email, accesso con password o codice, bonifici autorizzati con un codice.

```
D1W17/
├── backend/    Spring Boot + PostgreSQL + Gmail SMTP
└── frontend/   React + Vite + Tailwind
```

## 1. Backend

Requisiti: Java 25, PostgreSQL con un database `banca`.

Crea `backend/env.properties` con `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_PASSWORD`, poi:

```bash
cd backend
./mvnw spring-boot:run      # su Windows: mvnw.cmd spring-boot:run
```

Risponde su `http://localhost:8080`.

## 2. Frontend

Requisiti: Node.js 20 o superiore.

```bash
cd frontend
npm install
npm run dev
```

Apri `http://localhost:5173`. Dettagli in [frontend/README.md](frontend/README.md).

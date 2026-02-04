# Fraud Detection Dashboard

An interactive dashboard for fraud-related insights on transaction data over a selected date range. **Backend uses MongoDB with indexes** for fast date-range queries.

## Structure

- **backend/** — Express API (TypeScript): MongoDB, indexes on `timestamp` and `user_id`+`timestamp`, routes, controllers, services.
- **frontend/** — Next.js app (TypeScript): UI; fetches from backend API.
- **data/** — Mock data (`mock_transactions.json`); seeded into MongoDB on first run.

## Features

- **Graph**: X-axis = timestamp, Y-axis = transaction (scatter over time)
- **Fraud summary**: Total fraud events and list (HIGH_FREQUENCY, DISTANT_LOCATIONS)
- **Insight**: Which country has the most fraud suspicions?
- **Date range**: Start and end date filters

## Fraud rules

- **High frequency**: Same `user_id`, ≥6 transactions in 1 hour
- **Distant locations**: Same `user_id`, two transactions >500 km apart within 90 minutes

## Getting started (local)

1. **MongoDB** running on `localhost:27017` (or set `MONGODB_URI`).

2. **Seed data**: Put `data/mock_transactions.json` (array of `{ transaction_id, user_id, timestamp, amount, location: { latitude, longitude } }`). Backend seeds from this file on startup if the collection is empty, or call `GET http://localhost:4000/api/seed` to seed.

3. **Start backend and frontend:**

```bash
# Terminal 1 — backend (port 4000)
cd backend && npm install && npm run dev

# Terminal 2 — frontend (port 3000)
cd frontend && npm install && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Frontend uses `NEXT_PUBLIC_API_URL=http://localhost:4000` by default.

## Run with Docker

```bash
docker compose up --build
```

- **MongoDB** at `localhost:27017`
- **Backend** at [http://localhost:4000](http://localhost:4000); seeds from `./data/mock_transactions.json` on startup.
- Run frontend locally: `cd frontend && npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Database and indexes

- **MongoDB** database: `fraud_dashboard` (or `MONGODB_DB`).
- **Collection**: `transactions`.
- **Indexes** (created on seed):
  - `{ timestamp: 1 }` — fast date-range queries
  - `{ user_id: 1, timestamp: 1 }` — fraud detection by user and time

Env: `MONGODB_URI` (default `mongodb://localhost:27017`), `MONGODB_DB` (default `fraud_dashboard`), `DATA_PATH` (default `../data` for seed file path).

## Project structure

```
data/
  mock_transactions.json   # Seeded into MongoDB

backend/
  src/
    server.ts
    db/connection.ts       # MongoDB + ensureIndexes()
    db/seed.ts            # Seed from JSON file
    services/, controllers/, routes/, middlewares/, types/, utils/
  See backend/README.md

frontend/
  src/app/                # Pages, components
  See frontend/ for scripts
```

See **[DESIGN.md](./DESIGN.md)** for design details.

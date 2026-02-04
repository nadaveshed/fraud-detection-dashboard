# Fraud Dashboard — Backend

Express API in TypeScript. Entry point: **server.ts**. Uses **MongoDB** with indexes for fast date-range queries.

## Structure

```
src/
  server.ts              # Entry: Express app, routes, listen; runs seed on startup
  db/
    connection.ts        # MongoDB client, getDb(), ensureIndexes()
    seed.ts              # Seed from data/mock_transactions.json
  types/                 # Interfaces
  utils/                 # haversine, country-from-coords
  services/              # data.service (MongoDB queries), fraud.service, insight.service
  controllers/           # transactions, fraud, insights, seed
  routes/                # /api/transactions, /api/fraud-events, /api/insights, /api/seed
  middlewares/
```

## Scripts

- `npm run dev` — tsx watch (src/server.ts)
- `npm run build` — compile to dist/
- `npm start` — node dist/server.js

## Database

- **MongoDB** — `MONGODB_URI` (default `mongodb://localhost:27017`), `MONGODB_DB` (default `fraud_dashboard`).
- **Indexes**: `{ timestamp: 1 }`, `{ user_id: 1, timestamp: 1 }` (created on seed).
- **Seed**: On startup, if the `transactions` collection is empty, loads `DATA_PATH/mock_transactions.json` (default `../data/mock_transactions.json`). Or `GET /api/seed` to run seed manually.

# Design & Implementation Choices

## Overview

- **Frontend:** Next.js (React), TypeScript, SWR for data, Chart.js for the graph, react-datepicker for date range.
- **Backend:** Express (TypeScript), MongoDB for storage, in-memory fraud detection over transactions in the selected date range.

## Data Flow

1. User selects start/end date and clicks Apply.
2. Frontend calls three APIs in parallel: transactions, fraud-events, insights/country-fraud (all with `startDate`, `endDate`).
3. Backend loads transactions in range from MongoDB (indexed on `timestamp`), runs fraud detection (high frequency, distant locations), and for insights aggregates fraud events by country.
4. Dashboard shows: scatter chart (X: timestamp, Y: transaction), fraud summary (total + list with type per event), country insight (top countries by fraud count).

## API

- `GET /api/transactions?startDate=&endDate=` — transactions in range.
- `GET /api/fraud-events?startDate=&endDate=` — fraud summary (total, byType, events).
- `GET /api/insights/country-fraud?startDate=&endDate=` — country fraud insight (insights, total).
- `GET /api/seed` — manual seed from `data/mock_transactions.json`.

Dates are ISO strings (e.g. `2025-10-01T00:00:00.000Z`). MongoDB stores `timestamp` as string; range uses `$gte` / `$lte` (lexicographic order is correct for ISO).

## Fraud Rules

- **High frequency:** Same `user_id`, ≥6 transactions within 1 hour.
- **Distant locations:** Same `user_id`, two transactions >500 km apart within 90 minutes (Haversine). Country from coordinates via nearest known city (see `country-from-coords.ts`).

## Database

- MongoDB collection `transactions`. Indexes: `{ timestamp: 1 }`, `{ user_id: 1, timestamp: 1 }`.
- Seed: read `data/mock_transactions.json`, add `country` from coordinates if missing, insert if collection empty.

## Justification

- **MongoDB:** Simple range queries and indexing; mock data is JSON, so seeding is straightforward.
- **In-memory fraud detection:** Rules require grouping by user and sorting by time; running on the filtered set per request keeps implementation simple and correct for the assignment scope.
- **Separate frontend/backend:** Clear API boundary, frontend can be deployed independently (e.g. static + API URL).
- **Chart.js scatter:** X = timestamp, Y = ordinal (transaction index); transaction_id shown in tooltip. Ordinal Y avoids crowding the axis with hundreds of IDs.

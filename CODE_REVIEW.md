# Code Review: Fraud Detection Dashboard

Review against the **Assignment Description & Acceptance Criteria**.

---

## Required Features

### 1. Graph-like visualization

| Criterion | Status | Notes |
|-----------|--------|--------|
| **X-axis: timestamp** | Met | Chart uses timestamp (Date) on X; axis titled "Date", ticks formatted as dates. |
| **Y-axis: transaction_id** | Partial | Y-axis is numeric (transaction index). Assignment asks for "transaction_id"; tooltip shows `transaction_id` per point. With many transactions, a categorical Y of IDs is impractical; current approach uses ordinal Y with `transaction_id` in tooltip. **Recommendation:** Label Y-axis "transaction_id" (or "Transaction ID") so the axis meaning matches the spec. |

**Location:** `frontend/src/app/components/TransactionsChart.tsx`, `FraudDashboard.tsx` (section title).

---

### 2. Summary of fraud events (selected period)

| Criterion | Status | Notes |
|-----------|--------|--------|
| **Total number of fraud events** | Met | "Total fraud events in period: **N**" in Fraud events summary. |
| **For each event, display fraud event type** | Met | Each list item shows `FraudTypeLabel(e.fraud_type)` (HIGH_FREQUENCY / DISTANT_LOCATIONS) plus transaction_id, timestamp, country. |

**Location:** `frontend/src/app/components/FraudDashboard.tsx` (Fraud events summary section); backend `fraud.service.ts` (detection), `summarizeFraud()`.

---

### 3. Chosen insight

| Criterion | Status | Notes |
|-----------|--------|--------|
| **Which country has the most fraud suspicions?** | Met | Implemented. Backend `insight.service.ts` aggregates fraud events by country; frontend shows top countries and "Top country: X with N fraud suspicions." |
| **Empty state** | Minor | When there are no fraud events in the period, the country insight section is hidden (`countryInsight.insights.length > 0`). Showing a short message (e.g. "No fraud in this period") would make the insight always visible. |

**Location:** `backend/src/services/insight.service.ts`, `backend/src/routes/insights.routes.ts` (GET `/api/insights/country-fraud`); `frontend/src/app/components/FraudDashboard.tsx`.

---

### 4. Date range (start date and end date)

| Criterion | Status | Notes |
|-----------|--------|--------|
| **Selectable date range** | Met | DateRangePicker (react-datepicker) with start/end and Apply. |
| **Data filtered by range** | Met | All API calls pass `startDate` and `endDate`; backend filters transactions by `timestamp` with `$gte` / `$lte`. |

**Location:** `frontend/src/app/components/DateRangePicker.tsx`, `useDashboardData.ts` (query params); `backend/src/services/data.service.ts`.

---

## Supported Fraud Classifications

| Rule | Status | Implementation |
|------|--------|----------------|
| **High frequency** (same `user_id`, many transactions in short time) | Met | ≥6 transactions in 1 hour per user. `fraud.service.ts`: `detectHighFrequency()`, `HIGH_FREQUENCY_WINDOW_MS`, `HIGH_FREQUENCY_THRESHOLD`. |
| **Distant locations** (same `user_id`, two transactions far apart in short time) | Met | >500 km within 90 minutes. `fraud.service.ts`: `detectDistantLocations()`, `distanceKm()` (haversine), `DISTANT_KM_THRESHOLD`, `DISTANT_TIME_WINDOW_MS`. |

**Location:** `backend/src/services/fraud.service.ts`, `backend/src/utils/haversine.ts`.

---

## Constraints

| Constraint | Status | Notes |
|------------|--------|--------|
| **Separate frontend and backend** | Met | `frontend/` (Next.js) and `backend/` (Express) are separate; API at `/api/*`. |
| **Use provided mock data** | Met | `data/mock_transactions.json`; backend seeds MongoDB from it on startup (`db/seed.ts`). |
| **Design and implementation choices** | Partial | README describes structure and fraud rules. README points to **DESIGN.md**, which was missing; adding a DESIGN.md (or removing the link) is recommended. |

---

## Additional Notes

### Strengths

- **Indexes:** MongoDB indexes on `timestamp` and `user_id`+`timestamp` support date-range and fraud-detection queries.
- **Country from coords:** Seed enriches transactions with `country` via `country-from-coords.ts` for the country insight.
- **Error handling:** Async routes wrapped with `asyncHandler`; global `errorHandler` returns 500 + message.
- **UX:** SWR for caching/revalidation, skeleton loading, date picker with wide range (2020–2030), chart X-axis fixed to selected range with deduplicated date labels.

### Minor / Optional Improvements

1. **Y-axis label:** Use "transaction_id" (or "Transaction ID") on the chart Y-axis and section title to match the assignment wording.
2. **Country insight empty state:** Always show the "Which country has the most fraud suspicions?" block; when there are no events, show e.g. "No fraud in this period."
3. **DESIGN.md:** Add a short DESIGN.md (tech choices, API, data flow) or remove the reference from README.
4. **Query validation:** Optionally validate `startDate`/`endDate` format (e.g. ISO date or YYYY-MM-DD) and return 400 for invalid input.

---

## Summary

| Area | Verdict |
|------|--------|
| Graph (X: timestamp, Y: transaction_id) | Met (Y semantic: ordinal with transaction_id in tooltip; label can be aligned to "transaction_id"). |
| Fraud summary (total + type per event) | Met |
| Insight (country with most fraud suspicions) | Met |
| Date range filtering | Met |
| Fraud rules (high frequency, distant locations) | Met |
| Frontend/backend separation | Met |
| Mock data usage | Met |

The project satisfies the assignment. The suggested changes are small clarifications and UX improvements (Y-axis label, country empty state, DESIGN.md).

# Residency+ Axiom Dashboard Bootstrap Checklist
_G2 User Guide (2026-03-10)_

Use this checklist to build the first set of Axiom dashboard panels for monitoring the Residency+ wrapper functions.

---

## Prerequisites
Before starting, confirm these are in place:
- [ ] Axiom account active at https://app.axiom.co
- [ ] Dataset **`residency-plus`** exists (check under **Datasets**)
- [ ] `AXIOM_API_TOKEN`, `AXIOM_DATASET`, and `AXIOM_DOMAIN` set in Netlify env or local `.env`
- [ ] At least one wrapper request has been made (to generate events)

> **Note:** New events may take up to 60 seconds to appear in Axiom after a request is made.

---

## Step 1 — Confirm Events Are Arriving
1. Go to **https://app.axiom.co**
2. Click **Datasets** → select `residency-plus`
3. Run this query in Explorer:
   ```
   ['residency-plus']
   | where _telemetry == true
   | take 10
   ```
4. You should see `event`, `endpoint`, `status_code`, and `timestamp` fields.

---

## Step 2 — Build Dashboard Panels (in order)

Open **Dashboards** → **New Dashboard** → name it `Residency+ Wrapper Health`.

Use the queries in [`axiom_queries.apl.txt`](./axiom_queries.apl.txt) as copy-paste sources. Add panels in this order:

### Panel 1 — Request Volume by Endpoint
- **Type:** Time Series  
- **Source:** Query 1 from `axiom_queries.apl.txt`  
- **Goal:** See traffic split between `sc-official-search` and `sc-official-resolve`

### Panel 2 — Health Status Ratio
- **Type:** Pie or Donut  
- **Source:** Query 2 from `axiom_queries.apl.txt`  
- **Goal:** >98% of events should be `status_code: 200`

### Panel 3 — Latency p50 / p95
- **Type:** Time Series (dual line)  
- **Source:** Query 3 from `axiom_queries.apl.txt`  
- **Goal:** p50 under 400ms, p95 under 1200ms at healthy baseline

### Panel 4 — Rejection / Rate Limit Matrix
- **Type:** Stacked Bar  
- **Source:** Query 4 from `axiom_queries.apl.txt`  
- **Goal:** `rate_limit_block`, `origin_forbidden`, `upstream_429` near zero

### Panel 5 — Endpoint Performance Summary
- **Type:** Table  
- **Source:** Query 5 from `axiom_queries.apl.txt`  
- **Goal:** Side-by-side avg/p95 duration and total call count per endpoint

---

## First 10 Minutes Validation

Once panels are created, do a quick sweep:
- [ ] Events are appearing in the last 15 min time window
- [ ] No `upstream_429` events in this window
- [ ] p95 latency is under 1500ms
- [ ] `origin_forbidden` count is 0 (unless you intentionally sent a bad origin)
- [ ] All success events have `status_code: 200`

If any panel is empty, wait 2 minutes and refresh. If still empty after 5 minutes, check that the wrapper function ran at least once and that the `AXIOM_*` env vars are all set.

---

## Next Step
Once panels are saved, see [`ALERT_POLICY.md`](./ALERT_POLICY.md) to configure monitor alerts on top of these panels.

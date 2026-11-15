# TempoLab — running workout reconstruction MVP

A local-first workout planner and experimental pace-accuracy analyzer, inspired by Daniels training zones (no copyrighted book plans included).

## Run locally (Node.js 20+)

1. In [Intervals.icu Settings](https://intervals.icu/settings), generate a **personal API key** in Developer Settings.
2. Set the key in your own terminal, **never in GitHub or in chat**.
3. Start the server:

**PowerShell**
```powershell
$env:INTERVALS_API_KEY = Read-Host "Intervals API key"
node server.mjs
```

**macOS / Linux**
```bash
read -rsp "Intervals API key: " INTERVALS_API_KEY; echo
export INTERVALS_API_KEY
node server.mjs
```

4. Open http://127.0.0.1:4173
5. Create a structured workout, choose dates, search running activities, select a run, and click **Importar datos**.

## Implementation

- Local HTTP server with API-key Basic authentication to Intervals.icu; credential stays on the server.
- GET /api/activities?oldest=YYYY-MM-DD&newest=YYYY-MM-DD
- GET /api/activities/:id/samples (reads time, distance, velocity_smooth streams)
- Pace reconstruction from velocity or distance deltas, followed by alignment with planned elapsed-time phases.
- Experimental accuracy metric and per-phase coverage checks.
- CSV import and synthetic demo remain available.

## Known limitations

- **Not yet tested against a real Huawei GT 6 Pro activity or authenticated Intervals.icu account.**
- Data availability depends on what Huawei uploads and Intervals.icu exposes. Missing streams produce an explicit error.
- The phase boundaries are **inferred from planned elapsed time**; pauses, skipped phases, and manual changes can misalign them.
- Missing and irregular streams can affect coverage; the current metric is experimental, not VDOT O2's proprietary score.
- No OAuth, webhooks, FIT parsing, workout push to Huawei, or Daniels book plan library yet.
- For one personal user, a local API key is suitable; a multi-user hosted deployment should use OAuth instead.
- The server binds only to localhost and does not store the API key.
- Activities sourced from Strava may be unavailable through the Intervals.icu API due to provider restrictions.

## API references

- https://forum.intervals.icu/t/api-access-to-intervals-icu/609
- https://forum.intervals.icu/t/intervals-icu-api-integration-cookbook/80090
- https://forum.intervals.icu/t/access-activities-streams-via-api/101065

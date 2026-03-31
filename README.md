# DTF Radar

DTF Radar is a lightweight competitor intelligence prototype built for the DTF market.

It helps sellers, brands, and distributors track:
- pricing changes
- product launches
- promotional updates
- messaging shifts
- competitor activity trends

## Current status
This repository is an early MVP front-end prototype, focused on product structure and user flow rather than live data ingestion.

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- App Router

## What’s included
- Marketing landing page
- Dashboard with filters and trend widgets
- Competitor list view
- Competitor detail view
- Alerts list view
- Alert detail view
- Add competitor flow
- Discovery review flow
- MVP PRD in `docs/`

## Screens implemented
- `/`
- `/dashboard`
- `/competitors`
- `/competitors/[id]`
- `/competitors/new`
- `/competitors/new/discovery`
- `/alerts`
- `/alerts/[id]`

## Roadmap
### Phase 1 — Product prototype
- [x] landing page
- [x] dashboard skeleton
- [x] competitors list
- [x] alerts list
- [x] detail pages
- [x] onboarding flow mock

### Phase 2 — Product polish
- [x] dashboard filters mock
- [x] dashboard trend widgets
- [ ] reusable UI component extraction
- [ ] README polish with screenshots

### Phase 3 — Functional MVP
- [ ] competitor creation persistence
- [ ] page discovery backend
- [ ] page snapshot storage
- [ ] diff detection engine
- [ ] alert generation pipeline
- [ ] real dashboard metrics

## Local development
```bash
npm install
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Lint
```bash
npm run lint
```

## Docs
- `docs/DTF-Radar-MVP-PRD.md`
- `docs/ROADMAP.md`

## Notes
This project currently uses mock data under `src/lib/mock-data.ts`.

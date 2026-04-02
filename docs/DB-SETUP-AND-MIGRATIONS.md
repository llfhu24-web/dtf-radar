# Database Setup & Migrate Flow

This project uses **Prisma 7 + PostgreSQL**.

## 1. Environment
Create a local env file:

```bash
cp .env.example .env
```

Set:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/dtf_radar?schema=public"
```

---

## 2. Prisma 7 config behavior
This repo uses `prisma.config.ts`.

Important implication:
- Prisma commands require `DATABASE_URL`
- datasource URL is **not** stored inside `schema.prisma`
- if env loading fails, pass `DATABASE_URL` inline

Example:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/dtf_radar?schema=public" npx prisma generate
```

---

## 3. Fast MVP local setup
Use this when you just want a working local database quickly:

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

What each step does:
- `prisma generate` → generates Prisma client
- `prisma db push` → syncs current schema directly into DB
- `npm run db:seed` → inserts demo workspace / competitors / alerts data
- `npm run dev` → starts the app

---

## 4. Migration-based flow
Use this when you want checked-in schema history.

### Create the first migration
```bash
npx prisma migrate dev --name init
```

### Seed after migration
```bash
npm run db:seed
```

### Start the app
```bash
npm run dev
```

---

## 5. Team / later workflow
After migrations exist in `prisma/migrations/`, future schema changes should follow:

```bash
npx prisma migrate dev --name <change-name>
npm run db:seed
```

For a teammate pulling the repo:

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

---

## 6. Demo seed contents
Current seed inserts:
- demo user
- demo workspace: `workspace_demo`
- demo competitors
- demo tracked pages
- demo change events

This is enough to populate:
- `/competitors`
- `/competitors/[id]`
- `/alerts`
- `/alerts/[id]`
- `/dashboard`

---

## 7. Current recommendation
At the current MVP stage:
- use `db push` for fast iteration
- add `migrate dev` once schema changes start stabilizing

Recommended short-term policy:
1. local prototyping → `db push`
2. milestone checkpoint / before collaboration → `migrate dev`

---

## 8. Troubleshooting

### Error: missing DATABASE_URL
Cause:
- Prisma command could not see env vars

Fix:
- ensure `.env` exists
- or run with inline env:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/dtf_radar?schema=public" npx prisma generate
```

### Prisma 7 datasource URL error
If you see an error about datasource `url` not being supported in `schema.prisma`, that means the project must keep using `prisma.config.ts` for datasource configuration.

### Seed runs but app shows empty data
Check:
- `workspace_demo` exists
- route handlers still use `DEFAULT_WORKSPACE_ID = "workspace_demo"`
- database URL points to the same database you seeded

---

## 9. Suggested next improvement
After this doc step, the next strong follow-up is:
- create the first checked-in migration (`init`)
- add a one-command setup helper in package.json

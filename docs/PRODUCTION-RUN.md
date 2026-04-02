# Production Run Guide

This guide covers the current simplest server-side run flow for DTF Radar.

## What has already been verified
On the current cloud server, the following checks were completed successfully:

### Build
```bash
npm run build
```

Result:
- build passed
- static and dynamic routes compiled correctly

### Start
```bash
npm run start
```

Result:
- Next.js started successfully
- local verification to `http://127.0.0.1:3000/dashboard` returned `HTTP/1.1 200 OK`

---

## Current recommended run modes

### Mode A: Development preview
Use during feature work:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Use this when:
- actively coding
- verifying UI changes quickly
- testing from a cloud server on port 3000

---

### Mode B: Production-style run
Use this when you want a more realistic deployment check:

```bash
npm run build
npm run start
```

This verifies:
- the app can compile successfully
- the app can boot in production mode
- the app can serve HTTP responses correctly

---

## Minimal server deployment flow

### 1. Install dependencies
```bash
npm install
```

### 2. Prepare environment
```bash
cp .env.example .env
```

Example:
```bash
DATABASE_URL="postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public"
NEXT_PUBLIC_APP_URL="http://SERVER_IP:3000"
NODE_ENV="development"
```

If running in a more production-like server mode, you can change:

```bash
NODE_ENV="production"
```

---

### 3. Run database migration
```bash
DATABASE_URL="postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public" npx prisma migrate dev
```

### 4. Seed demo data if needed
```bash
npx tsx prisma/seed.ts
```

### 5. Build and start
```bash
npm run build
npm run start
```

---

## Accessing the app on a cloud server
Because the app runs on the server, `localhost:3000` means the server itself.

To view pages from your laptop/browser, you need one of these:

### Option 1: expose port 3000 temporarily
- open TCP 3000 in the cloud firewall / security group
- start the app
- visit:

```bash
http://SERVER_IP:3000/dashboard
http://SERVER_IP:3000/competitors
http://SERVER_IP:3000/alerts
```

### Option 2: SSH port forwarding
Forward server port 3000 to your local machine, then open `http://localhost:3000` locally.

### Option 3: reverse proxy with Nginx
Recommended later for a cleaner deployment on port 80/443.

---

## Recommended next productionization steps
Current setup is enough for server-side testing, but not a full production deployment yet.

### Next step 1: process management
Choose one:
- `pm2`
- `systemd`

So the app can restart automatically if the process exits.

### Next step 2: reverse proxy
Set up Nginx to:
- serve on port 80/443
- proxy to `127.0.0.1:3000`
- attach domain and HTTPS later

### Next step 3: lock down direct port access
After Nginx is in place:
- stop exposing 3000 publicly
- only expose 80/443

---

## Quick verification commands

### Check build
```bash
npm run build
```

### Check production start
```bash
npm run start
```

### Check local HTTP response on server
```bash
curl -I http://127.0.0.1:3000/dashboard
curl -I http://127.0.0.1:3000/competitors
curl -I http://127.0.0.1:3000/alerts
```

Expected:
```bash
HTTP/1.1 200 OK
```

---

## Current status summary
DTF Radar now has:
- successful production build
- successful production start
- successful local HTTP verification
- working PostgreSQL-backed runtime
- migration history
- seed data

That means the project is now ready for the next layer of server hardening and deployment polish.

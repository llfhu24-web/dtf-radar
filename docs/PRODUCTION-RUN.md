# Production Run Guide

This guide covers the current server-side deployment path for DTF Radar.

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

### Mode B: Production-style run
Use this when you want a more realistic deployment check:

```bash
npm run build
npm run start
```

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
NEXT_PUBLIC_APP_URL="http://SERVER_IP"
NODE_ENV="production"
```

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

To view pages from your laptop/browser, use one of these:

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
Recommended for cleaner deployment on port 80/443.

---

## Nginx reverse proxy example
Assume:
- domain: `dtf.example.com`
- app listens on `127.0.0.1:3000`

Example Nginx server block:

```nginx
server {
    listen 80;
    server_name dtf.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Typical Ubuntu path:

```bash
/etc/nginx/sites-available/dtf-radar
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/dtf-radar /etc/nginx/sites-enabled/dtf-radar
sudo nginx -t
sudo systemctl reload nginx
```

### HTTPS later
Once DNS is pointed correctly, you can attach HTTPS with Certbot.

---

## PM2 run option
PM2 is easier for quick Node app process management.

### Install PM2
```bash
sudo npm install -g pm2
```

### Start app with PM2
```bash
cd /root/github/dtf-radar
pm2 start npm --name dtf-radar -- start
```

### Useful PM2 commands
```bash
pm2 status
pm2 logs dtf-radar
pm2 restart dtf-radar
pm2 stop dtf-radar
pm2 save
pm2 startup
```

Recommended after confirming it runs:

```bash
pm2 save
pm2 startup
```

---

## systemd run option
systemd is better when you want a more standard Linux service setup.

Example unit file:

```ini
[Unit]
Description=DTF Radar Next.js App
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/root/github/dtf-radar
Environment=NODE_ENV=production
Environment=NEXT_PUBLIC_APP_URL=http://SERVER_IP
Environment=DATABASE_URL=postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

Suggested path:

```bash
/etc/systemd/system/dtf-radar.service
```

Commands:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dtf-radar
sudo systemctl status dtf-radar
sudo journalctl -u dtf-radar -f
```

---

## Which one should you choose?

### Choose PM2 if:
- you want the fastest path
- you are still iterating quickly
- you want simpler logs and restarts

### Choose systemd if:
- you want a more standard Linux service
- you prefer OS-level service management
- you want to integrate cleanly with other system services

For the current stage of this project, **PM2 is the fastest practical choice**.

---

## Recommended next productionization steps
1. Start app with PM2 or systemd
2. Put Nginx in front of port 3000
3. Point domain to server
4. Add HTTPS
5. Stop exposing 3000 publicly

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
- Nginx deployment guidance
- PM2 / systemd run options

That means the project is now ready for the next layer of server hardening and deployment polish.

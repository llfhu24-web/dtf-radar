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

### PM2 persistent run
Verified successfully on the server:

```bash
npm install -g pm2
pm2 start npm --name dtf-radar -- start
pm2 save
pm2 startup
```

Result:
- `dtf-radar` is managed by PM2
- PM2 process list was saved
- systemd startup for PM2 was enabled

### Nginx reverse proxy
Verified successfully on the server:
- Nginx installed
- site config created
- port 80 proxying to `127.0.0.1:3000`
- local curl checks passed
- external browser access via `http://SERVER_IP/dashboard` succeeded after Tencent Cloud port 80 was opened

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

### Mode C: Persistent process with PM2
Use this when you want the app to keep running after terminal exit or server reboot:

```bash
pm2 start npm --name dtf-radar -- start
pm2 save
pm2 startup
```

### Mode D: Public access through Nginx
Use this when you want to expose the app on port 80:

```bash
Nginx :80 -> 127.0.0.1:3000 -> PM2 -> Next.js
```

### Mode E: Domain + HTTPS
Use this when you want a cleaner public URL and browser-trusted TLS:

```bash
https://your-domain.com -> Nginx :443 -> 127.0.0.1:3000 -> PM2 -> Next.js
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

### 6. Hand off process control to PM2
```bash
pm2 start npm --name dtf-radar -- start
pm2 save
pm2 startup
```

### 7. Put Nginx in front
```bash
sudo apt-get update && sudo apt-get install -y nginx
sudo systemctl enable --now nginx
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

This option has already been validated on the current server.

---

## Nginx reverse proxy example
Current validated site config pattern:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

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

Suggested path:

```bash
/etc/nginx/sites-available/dtf-radar
```

Enable it:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/dtf-radar /etc/nginx/sites-enabled/dtf-radar
sudo /usr/sbin/nginx -t
sudo systemctl reload nginx
```

Verification:

```bash
curl -I http://127.0.0.1/dashboard
curl -I http://127.0.0.1/competitors
curl -I http://127.0.0.1/alerts
```

Expected:
- `HTTP/1.1 200 OK`
- `X-Powered-By: Next.js`

### Tencent Cloud note
If external access still fails after Nginx is correct, check Tencent Cloud inbound rules and allow:
- TCP 80
- source `0.0.0.0/0` (or your own IP range)

This has already been validated for the current server.

---

## Domain setup checklist
Before attaching HTTPS, make sure all of the following are ready:

1. You own a domain name
2. You have a DNS record pointing to the server public IP
3. Tencent Cloud inbound rules allow:
   - TCP 80
   - TCP 443
4. Nginx is already serving the app on port 80

### Example DNS records
For root domain:
- type: `A`
- host: `@`
- value: `SERVER_IP`

For subdomain:
- type: `A`
- host: `app`
- value: `SERVER_IP`

Example final URLs:
- `http://your-domain.com/dashboard`
- `https://your-domain.com/dashboard`
- `https://app.your-domain.com/dashboard`

### DNS validation tip
After updating DNS, verify resolution from your own machine:

```bash
dig your-domain.com +short
nslookup your-domain.com
```

Both should resolve to the server public IP before requesting certificates.

---

## HTTPS with Certbot
Once DNS is correct, the simplest path is Nginx + Certbot.

### Install Certbot
Ubuntu example:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

### Request certificate
For apex domain:

```bash
sudo certbot --nginx -d your-domain.com
```

For apex + www:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

For subdomain:

```bash
sudo certbot --nginx -d app.your-domain.com
```

Certbot will usually:
- issue the certificate
- patch Nginx config automatically
- optionally add HTTP -> HTTPS redirect

### Recommended Certbot choices
When prompted, choose:
- keep redirect from HTTP to HTTPS: **yes**
- use valid email for expiry reminders: **yes**

### Test renewal
After issuance, test auto-renewal:

```bash
sudo certbot renew --dry-run
```

---

## Example domain-based Nginx config
If you want to prepare a domain-based config before or after Certbot, use a pattern like this:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

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

After Certbot, Nginx will typically add a `listen 443 ssl` block automatically.

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
pm2 delete dtf-radar
pm2 save
pm2 startup
```

### Current server status
This project has already been started successfully with PM2 on the current server.

That means:
- PM2 is installed
- `dtf-radar` is running under PM2
- PM2 startup has been enabled via systemd

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

For the current stage of this project, **PM2 + Nginx is now the validated practical path on the current server**.

---

## Recommended next productionization steps
1. Point a domain to the server
2. Open TCP 443 in Tencent Cloud
3. Install Certbot
4. Issue HTTPS certificate
5. Redirect HTTP to HTTPS
6. Stop exposing 3000 publicly
7. Optionally replace PM2 with a dedicated systemd app service later
8. Add deployment rollback / restart notes

---

## Quick verification commands

### Check PM2 process
```bash
pm2 status
pm2 logs dtf-radar --lines 50
```

### Check Nginx
```bash
sudo /usr/sbin/nginx -t
systemctl status nginx --no-pager
```

### Check local HTTP response on server
```bash
curl -I http://127.0.0.1/dashboard
curl -I http://127.0.0.1/competitors
curl -I http://127.0.0.1/alerts
```

### Check public HTTP response
```bash
curl -I http://your-domain.com/dashboard
```

### Check public HTTPS response
```bash
curl -I https://your-domain.com/dashboard
```

Expected:
```bash
HTTP/1.1 200 OK
X-Powered-By: Next.js
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
- PM2 already installed and enabled on the current server
- Nginx reverse proxy already installed and validated on the current server
- Tencent Cloud port 80 access already validated

That means the project is now ready for domain and HTTPS setup.

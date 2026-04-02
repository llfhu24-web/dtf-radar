# Operations Runbook

This is the minimum day-2 operations guide for DTF Radar on the current cloud server.

Current runtime shape:
- Next.js app
- PM2 process manager
- Nginx reverse proxy
- PostgreSQL database

Current deployment chain:

```bash
Browser -> Nginx :80 -> 127.0.0.1:3000 -> PM2 -> Next.js -> PostgreSQL
```

---

## 1. Daily quick checks

### Check PM2 app status
```bash
pm2 status
```

Expected:
- app name: `dtf-radar`
- status: `online`

### Check recent PM2 logs
```bash
pm2 logs dtf-radar --lines 50
```

### Check Nginx status
```bash
systemctl status nginx --no-pager
```

### Check local HTTP response
```bash
curl -I http://127.0.0.1/dashboard
```

Expected:
- `HTTP/1.1 200 OK`
- `X-Powered-By: Next.js`

### Check PostgreSQL is reachable
```bash
pg_isready -h localhost -p 5432
```

---

## 2. Standard deploy flow
Use this after code changes have been pushed to GitHub.

### Step 1: enter project
```bash
cd /root/github/dtf-radar
```

### Step 2: pull latest code
```bash
git pull
```

### Step 3: install dependencies if package changes exist
```bash
npm install
```

### Step 4: run migrations if Prisma schema changed
```bash
DATABASE_URL="postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public" npx prisma migrate dev
```

### Step 5: rebuild app
```bash
npm run build
```

### Step 6: restart PM2 process
```bash
pm2 restart dtf-radar
```

### Step 7: verify app
```bash
pm2 status
curl -I http://127.0.0.1/dashboard
```

If everything is good, external access through Nginx should also be good.

---

## 3. Fast restart flow
Use this when you did not change dependencies or database schema.

```bash
cd /root/github/dtf-radar
git pull
npm run build
pm2 restart dtf-radar
```

Verification:

```bash
pm2 status
curl -I http://127.0.0.1/dashboard
```

---

## 4. Logs and troubleshooting

### PM2 logs
```bash
pm2 logs dtf-radar
```

### Nginx error log
```bash
tail -n 100 /var/log/nginx/error.log
```

### Nginx access log
```bash
tail -n 100 /var/log/nginx/access.log
```

### systemd service state for Nginx
```bash
systemctl status nginx --no-pager
```

### Check which process owns port 3000
```bash
ss -ltnp | grep ':3000'
```

### Check which process owns port 80
```bash
ss -ltnp | grep ':80'
```

---

## 5. Common operational commands

### Restart app only
```bash
pm2 restart dtf-radar
```

### Stop app
```bash
pm2 stop dtf-radar
```

### Start app again if stopped
```bash
cd /root/github/dtf-radar
pm2 start npm --name dtf-radar -- start
pm2 save
```

### Reload Nginx after config change
```bash
sudo /usr/sbin/nginx -t
sudo systemctl reload nginx
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Check PM2 startup persistence
```bash
pm2 save
pm2 startup
```

---

## 6. Rollback flow
Use this when the newest deploy is broken.

### Step 1: inspect recent commits
```bash
git log --oneline -n 10
```

### Step 2: pick the last known good commit
Example:
```bash
git checkout 185bc9a
```

Or reset current branch hard only if you are sure:
```bash
git reset --hard <good_commit_sha>
```

### Step 3: rebuild
```bash
npm install
npm run build
```

### Step 4: restart app
```bash
pm2 restart dtf-radar
```

### Step 5: verify recovery
```bash
curl -I http://127.0.0.1/dashboard
pm2 logs dtf-radar --lines 50
```

### Safer Git rollback advice
If you already pushed a bad commit and want to preserve history, prefer:
```bash
git revert <bad_commit_sha>
```

Then redeploy normally.

---

## 7. Database operations

### Run migration
```bash
DATABASE_URL="postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public" npx prisma migrate dev
```

### Regenerate Prisma client
```bash
DATABASE_URL="postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar?schema=public" npx prisma generate
```

### Reseed demo data
```bash
npx tsx prisma/seed.ts
```

### Postgres shell
```bash
sudo -u postgres psql
```

### Connect to app database directly
```bash
psql "postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar"
```

---

## 8. Nginx config reference
Current validated Nginx site file:

```bash
/etc/nginx/sites-available/dtf-radar
```

Current pattern:

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

After any Nginx edit:

```bash
sudo /usr/sbin/nginx -t
sudo systemctl reload nginx
```

---

## 9. What to check when the site is down
Start with this order:

### A. Is PM2 app online?
```bash
pm2 status
```

### B. Is port 3000 responding?
```bash
curl -I http://127.0.0.1:3000/dashboard
```

### C. Is Nginx healthy?
```bash
sudo /usr/sbin/nginx -t
systemctl status nginx --no-pager
```

### D. Is port 80 responding locally?
```bash
curl -I http://127.0.0.1/dashboard
```

### E. Is Tencent Cloud ingress open?
Check cloud firewall/security group for:
- TCP 80
- later TCP 443

If local works but external does not, it is usually cloud ingress.

---

## 10. Backup suggestions
This project currently needs at least two kinds of backup attention:

### Code
Push commits to GitHub regularly.

### Database
At minimum, periodically dump PostgreSQL:

```bash
pg_dump "postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar" > dtf_radar_backup.sql
```

For restore later:

```bash
psql "postgresql://dtf_radar:dtf_radar_dev@localhost:5432/dtf_radar" < dtf_radar_backup.sql
```

---

## 11. Automated crawl scheduling
DTF Radar now supports a global crawl endpoint:

```bash
POST /api/crawl/run-all
```

It also exposes a status endpoint:

```bash
GET /api/crawl/status
```

### Recommended minimal production scheduler: cron + curl
Use the public Nginx URL on the same host so the scheduler exercises the deployed app path.

Example every 2 hours:

```bash
0 */2 * * * curl -fsS -X POST http://127.0.0.1/api/crawl/run-all >/tmp/dtf-radar-crawl.log 2>&1
```

Example every hour:

```bash
0 * * * * curl -fsS -X POST http://127.0.0.1/api/crawl/run-all >/tmp/dtf-radar-crawl.log 2>&1
```

### Edit crontab
```bash
crontab -e
```

Then add one of the schedules above.

### Verify cron is installed and running
```bash
systemctl status cron --no-pager
```

If missing on Ubuntu:
```bash
sudo apt-get update && sudo apt-get install -y cron
sudo systemctl enable --now cron
```

### Verify scheduled crawl status later
```bash
curl http://127.0.0.1/api/crawl/status
```

Or inspect the dashboard panel in the app.

### If you want timestamps in logs
```bash
0 */2 * * * date >> /tmp/dtf-radar-crawl.log && curl -fsS -X POST http://127.0.0.1/api/crawl/run-all >> /tmp/dtf-radar-crawl.log 2>&1
```

---

## 12. Recommended next ops improvements
When you want to harden this setup further, add:
1. domain + HTTPS
2. TCP 443 ingress
3. regular database backups
4. deploy checklist before restart
5. optional non-root app user
6. optional dedicated systemd app service instead of PM2
7. cron monitoring / alerting for scheduled crawl failures

---

## 13. Minimum healthy-state checklist
A healthy DTF Radar server currently means:
- `pm2 status` shows `dtf-radar` as `online`
- `systemctl status nginx` is healthy
- `curl -I http://127.0.0.1/dashboard` returns `200 OK`
- external browser access works on port 80
- PostgreSQL is reachable
- latest code is committed and pushed
- scheduled crawl endpoint is reachable if cron is enabled

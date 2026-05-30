# 🚀 FITCORN E-COMMERCE — PRODUCTION DEPLOYMENT GUIDE
**Target Environment:** Ubuntu 22.04 LTS + Nginx + PM2 + MySQL 8 + Redis

---

## 📌 1. Server Prerequisites & Installation

Connect to your clean Ubuntu server and execute the following installation commands:

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (v22 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2 Process Manager globally
```bash
sudo npm install pm2 -g
```

### Install MySQL Server 8
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```
*Note: Create a dedicated database named `fitcorn_web` and setup user credentials.*

### Install Redis Server
```bash
sudo apt install redis-server -y
sudo systemctl enable redis-server.service
```

### Install Nginx & Certbot (SSL)
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

---

## ⚙️ 2. PM2 Cluster Configuration (`ecosystem.config.js`)

Create the PM2 deployment descriptor in the root directory: `d:\Apps\Nest\2026\fitcorn\ecosystem.config.js`.

```javascript
module.exports = {
  apps: [
    {
      name: 'fitcorn-api',
      script: 'dist/main.js',
      cwd: '/var/www/fitcorn/fitcorn-api',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'fitcorn-web',
      script: 'dist/fitcorn-web/server/server.mjs',
      cwd: '/var/www/fitcorn/fitcorn-web',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
```

---

## 🛜 3. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/fitcorn.id` and symlink it to `sites-enabled`:

```nginx
server {
    listen 80;
    server_name fitcorn.id www.fitcorn.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fitcorn.id www.fitcorn.id;

    # SSL Certs (Managed by Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/fitcorn.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fitcorn.id/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Dynamic Angular SSR Frontend
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # NestJS API Backend Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static Assets Caching Optimization
    location /assets/ {
        proxy_pass http://localhost:4000/assets/;
        expires 30d;
        add_header Cache-Control "public, no-transform, immutable";
        access_log off;
    }

    # Multer Uploads Folder Caching
    location /uploads/ {
        root /var/www/fitcorn/fitcorn-api;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
}
```

---

## 🔑 4. Production Environment Setup

### NestJS Backend `.env` (`fitcorn-api/.env`)
```ini
NODE_ENV=production
PORT=3000

# Database Settings
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=fitcorn_admin
DB_PASSWORD=SecurePassword2026!
DB_DATABASE=fitcorn_web
DB_SYNCHRONIZE=false

# JWT Secret keys
JWT_SECRET=SuperSecureJWTSecretPhrase2026!!!
JWT_REFRESH_SECRET=SuperSecureJWTRefreshSecretPhrase2026!!!
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Payment Gateways (Midtrans Sandbox / Production)
MIDTRANS_SERVER_KEY=Mid-server-YOUR_LIVE_OR_SANDBOX_KEY
MIDTRANS_IS_PRODUCTION=false

# Shipping Gateway (RajaOngkir Starter / Pro)
RAJAONGKIR_API_KEY=rajaongkir-api-key-here
RAJAONGKIR_API_TYPE=starter

# Redis parameters for Queue & Cron Tasks
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# WA Gateway (Fonnte)
FONNTE_TOKEN=your-fonnte-token-here

# Email SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=marketing@fitcorn.id
SMTP_PASS=app-password-gmail-here
SMTP_FROM_NAME="Fitcorn Popcorn"
SMTP_FROM_EMAIL=no-reply@fitcorn.id
```

---

## 🏁 5. Deployment Step-by-Step

Execute this pipeline for initial deploy and subsequent updates:

### Step 1: Clone and set directory permissions
```bash
git clone https://github.com/wahyudi-komite/fitcorn-id.git /var/www/fitcorn
cd /var/www/fitcorn
```

### Step 2: Build Backend API (`fitcorn-api`)
```bash
cd /var/www/fitcorn/fitcorn-api
npm install
npm run build
```

### Step 3: Run Database Migrations
```bash
npm run typeorm migration:run
```

### Step 4: Build Frontend Angular SSR (`fitcorn-web`)
```bash
cd /var/www/fitcorn/fitcorn-web
npm install
npm run build
```

### Step 5: Start Process Management
```bash
cd /var/www/fitcorn
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🛠️ 6. Maintenance & Monitoring

* **View running processes logs:**
  ```bash
  pm2 logs
  ```
* **Monitor real-time system performance:**
  ```bash
  pm2 monit
  ```
* **Hot-reload applications without downtime:**
  ```bash
  pm2 reload all
  ```

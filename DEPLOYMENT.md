# Deployment Guide

This guide explains how to deploy the splUSD Distribution Dashboard to various hosting platforms.

## Quick Deploy Options

### 1. Vercel (Recommended)

Vercel offers the easiest deployment with automatic CI/CD.

**Option A: Deploy via CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Option B: Deploy via GitHub**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Vite settings
6. Click "Deploy"

**Configuration** (vercel.json):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite"
}
```

---

### 2. Netlify

**Option A: Drag and Drop**

```bash
# Build the project
npm run build

# Drag the 'dist' folder to Netlify dashboard
```

**Option B: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**Configuration** (netlify.toml):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

**Step 1: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/splusd-dashboard/', // Replace with your repo name
})
```

**Step 2: Add deployment script to package.json**

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Step 3: Install gh-pages**

```bash
npm install --save-dev gh-pages
```

**Step 4: Deploy**

```bash
npm run deploy
```

**Step 5: Enable GitHub Pages**
1. Go to repository Settings
2. Navigate to Pages
3. Select `gh-pages` branch
4. Save

---

### 4. AWS S3 + CloudFront

**Build the project:**
```bash
npm run build
```

**Upload to S3:**
```bash
# Install AWS CLI
# Configure: aws configure

# Create S3 bucket
aws s3 mb s3://splusd-dashboard

# Upload files
aws s3 sync dist/ s3://splusd-dashboard --delete

# Enable static website hosting
aws s3 website s3://splusd-dashboard --index-document index.html --error-document index.html
```

**Configure CloudFront** (optional, for CDN):
1. Create CloudFront distribution
2. Set origin to S3 bucket
3. Configure custom error responses (404 → /index.html)

---

### 5. DigitalOcean App Platform

**Option A: Via Dashboard**
1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy

**Option B: Via doctl**
```bash
# Install doctl
snap install doctl

# Authenticate
doctl auth init

# Create app
doctl apps create --spec app.yaml
```

**app.yaml:**
```yaml
name: splusd-dashboard
static_sites:
  - name: web
    github:
      repo: yourusername/splusd-dashboard
      branch: main
    build_command: npm run build
    output_dir: dist
    routes:
      - path: /
```

---

### 6. Docker Deployment

**Create Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Create nginx.conf:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and run:**

```bash
# Build image
docker build -t splusd-dashboard .

# Run container
docker run -p 8080:80 splusd-dashboard
```

---

### 7. Self-Hosted (VPS)

**For Ubuntu/Debian servers:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install nginx

# Clone repository
git clone https://github.com/yourusername/splusd-dashboard.git
cd splusd-dashboard

# Install dependencies
npm install

# Build
npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/html/

# Configure Nginx
sudo nano /etc/nginx/sites-available/splusd-dashboard
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/splusd-dashboard /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## Environment Variables

For production deployments, you may want to use environment variables for RPC endpoints.

**Create .env:**
```
VITE_PLASMA_RPC_URL=https://plasma.drpc.org
VITE_FALLBACK_RPC_URL=https://rpc.plasma.to
```

**Update src/config.ts:**
```typescript
export const PLASMA_RPC_URL = import.meta.env.VITE_PLASMA_RPC_URL || 'https://plasma.drpc.org';
export const PLASMA_FALLBACK_RPC = import.meta.env.VITE_FALLBACK_RPC_URL || 'https://rpc.plasma.to';
```

**Platform-specific environment variable setup:**

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **GitHub Pages**: Use GitHub Secrets
- **Docker**: Pass via `-e` flag or docker-compose

---

## Performance Optimization

### 1. Enable Gzip Compression

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

**Vercel/Netlify:** Automatically enabled

### 2. Set Cache Headers

Already configured in the Docker nginx.conf above.

### 3. Use a CDN

- Vercel and Netlify provide CDN automatically
- For S3: Use CloudFront
- For self-hosted: Use Cloudflare

### 4. Optimize Build

```bash
# Analyze bundle size
npm run build -- --mode production

# Check build output
ls -lh dist/assets/
```

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

### Cloudflare (Universal)
1. Add site to Cloudflare
2. Update nameservers
3. Add DNS record pointing to your host

---

## SSL/HTTPS

- **Vercel/Netlify**: Automatic SSL via Let's Encrypt
- **GitHub Pages**: Automatic HTTPS
- **Self-hosted**: Use Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (cron job)
sudo certbot renew --dry-run
```

---

## Monitoring & Analytics

### Add Google Analytics

```typescript
// src/main.tsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

// Track page views
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
```

### Add Sentry for Error Tracking

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

---

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### 404 errors after deployment
- Ensure SPA redirect rules are configured
- Check base URL in vite.config.ts

### RPC connection issues
- Verify RPC endpoints are accessible from your hosting
- Consider using environment variables for different environments

---

## Post-Deployment Checklist

- [ ] Site is accessible via HTTPS
- [ ] All assets load correctly (no 404s)
- [ ] RPC connection works
- [ ] Charts display properly
- [ ] Export functions work
- [ ] Mobile responsive design verified
- [ ] Page load time < 3 seconds
- [ ] Set up monitoring/analytics
- [ ] Configure automatic deployments
- [ ] Add custom domain (if applicable)

---

## Support

If you encounter deployment issues:
1. Check platform-specific documentation
2. Review build logs for errors
3. Verify all environment variables are set
4. Test locally with `npm run build && npm run preview`

---

Last Updated: October 18, 2025

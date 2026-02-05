# Vansutracrafts - B2B Handmade E-commerce

A B2B e-commerce platform for authentic Indian handicrafts, built with modern web technologies.

## Tech Stack

- **Frontend**: React, Vite
- **Backend API**: Node.js, Express
- **Database**: SQLite (with Prisma ORM)
- **Styling**: CSS Modules / Standard CSS
- **Proxy**: Nginx (Production), Vite Proxy (Development)

## Getting Started (Local Development)

Follow these steps to run the project locally.

### 1. Install Dependencies
```bash
npm install
cd server && npm install && cd ..
```

### 2. Setup Database
Initialize the SQLite database with Prisma:
```bash
npm run server:setup
# Or manually:
# npx prisma generate --schema=server/prisma/schema.prisma
# npx prisma db push --schema=server/prisma/schema.prisma
```
*(Note: Ensure `server/.env` has `DATABASE_URL="file:./dev.db"`)*

### 3. Start Development Servers
You need to run both the backend and frontend.

**Backend (Port 5000):**
```bash
npm run server
```

**Frontend (Port 5173):**
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

---

## Production Setup

For production deployment (e.g., on a VPS), we use **Vite build** for the frontend, **PM2** for the backend process, and **Nginx** as a reverse proxy.

### 1. Build Frontend
```bash
npm run build
```
This serves the application to the `dist/` folder.

### 2. Configure Backend (PM2)
Use PM2 to keep the API server running.
```bash
npm install -g pm2
pm2 start index.js --name vansutra-api --cwd ./server
pm2 save
pm2 startup
```

### 3. Configure Nginx
Use Nginx to serve the static files and proxy API requests.

1.  Copy the example config:
    ```bash
    sudo cp nginx.conf.example /etc/nginx/sites-available/vansutracrafts
    ```
2.  Edit the config to set your domain:
    ```bash
    sudo nano /etc/nginx/sites-available/vansutracrafts
    ```
3.  Enable the site:
    ```bash
    sudo ln -sf /etc/nginx/sites-available/vansutracrafts /etc/nginx/sites-enabled/
    ```
4.  Test and Reload:
    ```bash
    sudo nginx -t
    sudo systemctl reload nginx
    ```

For more detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

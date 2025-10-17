* **Next.js (Admin frontend)** running on **PM2**, and
* **Laravel (API backend)** running inside **Docker**,


```markdown
# African Market Hub — Monorepo

This repository contains both the **Laravel API** and the **Next.js Admin Dashboard** for the African Market Hub platform.

---

## 📦 Project Structure

```

hubs/
├── api/            # Laravel API (Dockerized)
├── admin/          # Next.js Admin (runs with PM2)
└── README.md

````

---

## 🚀 Deployment Guide

### 1. Laravel API — Docker Setup

#### Build and Run Containers
```bash
cd api

# Copy environment file and update credentials
cp .env.example .env

# Build and start Docker containers
docker compose up -d --build

# Run initial setup inside the container
docker exec -it api-app bash
composer install
php artisan key:generate
php artisan migrate --seed
exit
````

#### Common Docker Commands

```bash
# Stop containers
docker compose down

# Restart containers
docker compose restart

# View logs
docker compose logs -f
```

---

### 2. Next.js Admin — PM2 Setup

#### Install dependencies

```bash
cd admin
npm install
```

#### Build and Start the App

```bash
# Build the Next.js project
npm run build

# Start with PM2
pm2 start npm --name "admin-app" -- run start
```

#### PM2 Management Commands

```bash
# View running apps
pm2 list

# View logs
pm2 logs admin-app

# Restart the app
pm2 restart admin-app

# Stop the app
pm2 stop admin-app

# Save PM2 process list for auto restart on reboot
pm2 save
```

#### (Optional) Auto-start on Server Boot

```bash
pm2 startup
# Follow the instructions printed to enable auto-start
```

---

## 💻 Local Development (after cloning)

After cloning the repo:

```bash
git clone https://github.com/the-africanmarkethub/africanmarkethub.ca.git
cd africanmarkethub.ca
```

### 🧩 Setup Laravel API

```bash
cd api
cp .env.example .env
composer install
php artisan key:generate

# If using local PHP/MySQL:
php artisan migrate --seed
php artisan serve
```

The Laravel API will be available at:

> [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### 🧩 Setup Next.js Admin

```bash
cd admin
npm install
npm run dev
```

The Next.js Admin app will be available at:

> [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Configuration

| App           | File               | Example                                         |
| ------------- | ------------------ | ----------------------------------------------- |
| Laravel API   | `api/.env`         | `APP_URL=http://localhost:8000`                 |
| Next.js Admin | `admin/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8000/api` |

---

## 🧰 Useful Tips

* **Rebuild Docker** when you change PHP dependencies:

  ```bash
  docker compose build --no-cache
  ```

* **Clear Laravel caches**:

  ```bash
  docker exec -it api-app bash
  php artisan optimize:clear
  exit
  ```

* **Update frontend environment variables** and rebuild:

  ```bash
  cd admin
  npm run build
  pm2 restart admin-app
  ```

---

## 📄 License

This project is licensed under the MIT License.
(c) 2025 African Market Hub.

---

## 💬 Maintainers

* **Backend (Laravel):** [@afolabi.marcus](https://github.com/afolabi.marcus)
* **Frontend (Next.js):** [@arfolabi](https://github.com/arfolabi)
* **Organization:** [African Market Hub](https://github.com/the-africanmarkethub)



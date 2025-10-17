#!/bin/bash

# === CONFIG ===
APP_DIR="/var/www/hubs/api"
BRANCH="main"

echo "🔄 Starting deployment for Laravel API (Dockerized)..."

# 1️⃣ Navigate to app directory
cd $APP_DIR || {
    echo "❌ Directory not found: $APP_DIR"
    exit 1
}

# 2️⃣ Pull latest changes
echo "📥 Pulling latest changes from $BRANCH..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

# 3️⃣ Clean up old containers and images
echo "🧹 Removing old and orphaned Docker resources..."
docker compose down --remove-orphans

# 4️⃣ Rebuild and start containers
echo "🚀 Building and starting containers..."
docker compose up -d --build

# 5️⃣ Clean up dangling Docker images (optional but recommended)
echo "🧽 Cleaning up unused Docker images..."
docker image prune -af > /dev/null 2>&1

# 6️⃣ Check container status
echo "✅ Deployment complete. Active containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "🎉 Done!"

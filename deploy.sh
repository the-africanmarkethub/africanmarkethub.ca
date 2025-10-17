#!/bin/bash
set -e

# === CONFIG ===
APP_DIR="/var/www/hubs/api"
BRANCH="laravel_api"
APP_NAME="African Market Hub API"
BACKUP_IMAGE="africanmarkethub-api-backup:latest"

# === EMAIL CONFIG ===
RESEND_API_KEY="re_aEnobdkh_L1GGJwSruAvfq2fVy38LWVQM"
MAIL_FROM="support@apiamh.crosshubdigital.com"
MAIL_TO="theafricanmarkethub@gmail.com"
MAIL_SUBJECT_SUCCESS="✅ ${APP_NAME} Deployed Successfully"
MAIL_SUBJECT_FAIL="❌ ${APP_NAME} Deployment Failed"

send_email() {
  SUBJECT="$1"
  MESSAGE="$2"
  curl -s -X POST "https://api.resend.com/emails" \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"from\": \"${MAIL_FROM}\",
      \"to\": [\"${MAIL_TO}\"],
      \"subject\": \"${SUBJECT}\",
      \"html\": \"${MESSAGE}\"
    }" > /dev/null 2>&1
}

echo "🔄 Starting smart deployment for $APP_NAME..."

cd "$APP_DIR" || {
    echo "❌ Directory not found: $APP_DIR"
    send_email "$MAIL_SUBJECT_FAIL" "<p>Directory not found: ${APP_DIR}</p>"
    exit 1
}

# 1️⃣ Pull latest code
echo "📥 Fetching latest changes..."
git fetch origin $BRANCH
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse origin/$BRANCH)

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
    echo "✅ Already up to date. Nothing to deploy."
    exit 0
fi

git reset --hard origin/$BRANCH

# 2️⃣ Detect if rebuild is needed
if git diff --name-only HEAD@{1} HEAD | grep -E '(^Dockerfile|docker-compose\.yml|\.env|\.env\.docker|composer\.json|package\.json|package-lock\.json)'; then
    REBUILD_REQUIRED=true
else
    REBUILD_REQUIRED=false
fi

# 3️⃣ Backup current running image
echo "📦 Backing up current image..."
docker commit api-app $BACKUP_IMAGE >/dev/null 2>&1 || true

# 4️⃣ Bring down old containers
echo "🧹 Shutting down old containers..."
docker compose down --remove-orphans

# 5️⃣ Build or restart as needed
if [ "$REBUILD_REQUIRED" = true ]; then
    echo "🛠️ Detected Docker/config changes — rebuilding..."
    docker compose up -d --build
else
    echo "♻️ Restarting containers without rebuild..."
    docker compose up -d
fi

# 6️⃣ Health check
echo "🔍 Checking container health..."
sleep 20

FAILED_CONTAINERS=$(docker ps -a --filter "status=exited" --format "{{.Names}} ({{.Status}})")
HEALTHY_CONTAINERS=$(docker ps --filter "status=running" --format "{{.Names}}")

if [ -n "$FAILED_CONTAINERS" ]; then
    echo "❌ One or more containers failed:"
    echo "$FAILED_CONTAINERS"
    echo "🪵 Gathering logs..."

    # Collect logs for failed containers
    LOGS_OUTPUT=""
    for container in $(echo "$FAILED_CONTAINERS" | awk '{print $1}'); do
        LOGS=$(docker logs --tail 20 "$container" 2>&1 | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/<br>/g')
        LOGS_OUTPUT+="<p><b>${container}</b> logs:<br><pre>${LOGS}</pre></p>"
    done

    # Rollback
    echo "⚙️ Rolling back to previous working version..."
    docker compose down
    docker run -d --name api-app-rollback $BACKUP_IMAGE

    send_email "$MAIL_SUBJECT_FAIL" "<p>Deployment failed for <b>${APP_NAME}</b> on <b>$(hostname)</b>.<br><br>Failed containers:<br><pre>${FAILED_CONTAINERS}</pre><br>${LOGS_OUTPUT}</p>"
    exit 1
else
    echo "✅ All containers healthy:"
    echo "$HEALTHY_CONTAINERS"
fi


# 7️⃣ Cleanup unused images
echo "🧽 Cleaning up unused Docker images..."
docker image prune -af > /dev/null 2>&1

# 8️⃣ Send success email
send_email "$MAIL_SUBJECT_SUCCESS" "<p><b>${APP_NAME}</b> deployed successfully on <b>$(hostname)</b>.</p>"

echo "✅ Deployment complete!"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

#!/usr/bin/env bash
#
# ORION X - Startet Backend + Frontend dauerhaft im Hintergrund (ohne systemd)
# Nutzung:  bash scripts/start.sh
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

export DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/orionx?schema=public}"
export NODE_ENV=production
export PORT=3000

echo "==> Starte ORION X Backend (Port 4000)..."
nohup npm run start:backend > "$APP_DIR/backend.log" 2>&1 &
echo "   Backend PID: $!"

echo "==> Starte ORION X Frontend (Port 3000)..."
cd "$APP_DIR/frontend"
nohup npm run start > "$APP_DIR/frontend.log" 2>&1 &
echo "   Frontend PID: $!"

echo "==> Logs: backend.log / frontend.log"
echo "==> Erreichbar ueber Reverse-Proxy auf http://77.90.30.250:25558"

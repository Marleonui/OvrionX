#!/usr/bin/env bash
#
# ORION X - Einfaches Deployment-Skript für eigenen VPS/Server
# Nutzung (als root oder sudo):  bash scripts/deploy.sh
#
# Das Skript übernimmt alles automatisch:
#   1. Abhaengigkeiten installieren
#   2. Datenbank-Migration ausfuehren
#   3. (optional) Demo-Daten seeden
#   4. Frontend + Backend bauen
#   5. systemd-Services einrichten -> App startet automatisch & ueberlebt Reboots
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "==> ORION X Deployment in: $APP_DIR"

# 1) Node-Module installieren (Workspace-Root)
echo "==> Installiere Abhaengigkeiten..."
npm install

# 2) Datenbank vorbereiten (setzt laufendes PostgreSQL voraus)
echo "==> Migriere Datenbank..."
npm run db:migrate
echo "==> Seede Demo-Daten (ueberspringbar mit SKIP_SEED=1)..."
if [ "${SKIP_SEED:-0}" != "1" ]; then
  npm run db:seed || echo "   (Seed optional - uebersprungen bei Fehler)"
fi

# 3) Build
echo "==> Baue Frontend + Backend..."
npm run build

# 4) systemd-Service einrichten (nur wenn systemd vorhanden ist)
if command -v systemctl >/dev/null 2>&1; then
  echo "==> Richte systemd-Services ein..."
  cp "$APP_DIR/scripts/orionx-backend.service"  /etc/systemd/system/orionx-backend.service
  cp "$APP_DIR/scripts/orionx-frontend.service" /etc/systemd/system/orionx-frontend.service

  # Pfade im Service anpassen
  sed -i "s|/opt/orionx|$APP_DIR|g" /etc/systemd/system/orionx-backend.service
  sed -i "s|/opt/orionx|$APP_DIR|g" /etc/systemd/system/orionx-frontend.service

  systemctl daemon-reload
  systemctl enable --now orionx-backend.service
  systemctl enable --now orionx-frontend.service

  echo "==> Status:"
  systemctl status orionx-backend.service --no-pager || true
  systemctl status orionx-frontend.service --no-pager || true
else
  echo "==> Kein systemd gefunden - starte manuell im Hintergrund..."
  bash "$APP_DIR/scripts/start.sh"
fi

echo ""
echo "==> Fertig. Frontend+Backend laufen auf http://77.90.30.250:25558"
echo "==> (Stelle sicher, dass nginx/Caddy Port 25558 auf 3000/4000 proxyed - siehe DEPLOY.md)"

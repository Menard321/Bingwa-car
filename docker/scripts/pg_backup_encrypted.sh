#!/usr/bin/env bash
# PHASE 8: Automated Daily Encrypted PostgreSQL 16 Backup Script (Dar es Salaam EAT)
set -euo pipefail

TIMESTAMP=$(TZ="Africa/Dar_es_Salaam" date +"%Y%m%d_%H%M%S_EAT")
BACKUP_DIR="/var/backups/bingwa_postgres"
mkdir -p "${BACKUP_DIR}"

ARCHIVE_FILE="${BACKUP_DIR}/bingwa_cars_prod_${TIMESTAMP}.sql.gz.enc"

echo "[BINGWA-BACKUP] Starting encrypted pg_dump at ${TIMESTAMP}..."

pg_dump -h "${DB_HOST:-postgres-primary}" -U "${DB_USER:-bingwa_enterprise}" -d "${DB_NAME:-bingwa_cars_prod}" \
  | gzip -9 \
  | openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:BACKUP_ENCRYPTION_KEY -out "${ARCHIVE_FILE}"

echo "[BINGWA-BACKUP] Completed encrypted backup: ${ARCHIVE_FILE}"


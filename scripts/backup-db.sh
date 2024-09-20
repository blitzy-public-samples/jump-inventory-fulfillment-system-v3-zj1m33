#!/bin/bash

# Human tasks:
# - Review and test the script in a staging environment before deploying to production
# - Set up a cron job or AWS CloudWatch Events to schedule regular backups
# - Implement monitoring and alerting for backup failures

# Load environment variables
source /path/to/.env

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/path/to/backups"
BACKUP_FILE="${BACKUP_DIR}/db_backup_${TIMESTAMP}.sql.gz"
LOG_FILE="${BACKUP_DIR}/backup_log_${TIMESTAMP}.log"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Perform database backup
echo "Starting database backup at $(date)" >> "${LOG_FILE}"
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" | gzip > "${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully at $(date)" >> "${LOG_FILE}"
    # Upload to AWS S3
    aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/database-backups/"
    if [ $? -eq 0 ]; then
        echo "Backup uploaded to S3 successfully" >> "${LOG_FILE}"
    else
        echo "Failed to upload backup to S3" >> "${LOG_FILE}"
    fi
else
    echo "Backup failed at $(date)" >> "${LOG_FILE}"
fi

# Cleanup old backups (keep last 7 days)
find "${BACKUP_DIR}" -name "db_backup_*.sql.gz" -mtime +7 -delete
find "${BACKUP_DIR}" -name "backup_log_*.log" -mtime +7 -delete

# Send notification (replace with your preferred notification method)
# Example: sending an email
mail -s "Database Backup Status" "admin@example.com" < "${LOG_FILE}"
#!/bin/bash

# Environment variables
DB_NAME="inventory_db"
DB_USER="postgres"
BACKUP_DIR="/path/to/backup/directory"
S3_BUCKET="your-s3-bucket-name"
RETENTION_DAYS=30

# Function to create a backup of the PostgreSQL database
create_backup() {
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_file="${BACKUP_DIR}/${DB_NAME}_${timestamp}.sql.gz"
    
    pg_dump -U ${DB_USER} ${DB_NAME} | gzip > ${backup_file}
    
    if [ $? -eq 0 ]; then
        echo "Backup created successfully: ${backup_file}"
        return ${backup_file}
    else
        echo "Error creating backup"
        exit 1
    fi
}

# Function to upload the backup file to S3
upload_to_s3() {
    local backup_file=$1
    
    aws s3 cp ${backup_file} s3://${S3_BUCKET}/
    
    if [ $? -eq 0 ]; then
        echo "Backup uploaded successfully to S3: ${S3_BUCKET}"
    else
        echo "Error uploading backup to S3"
        exit 1
    fi
}

# Function to clean up old local backup files
cleanup() {
    find ${BACKUP_DIR} -type f -name "${DB_NAME}_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    deleted_count=$?
    echo "Deleted ${deleted_count} old backup files"
}

# Main function to orchestrate the backup process
main() {
    echo "Starting database backup process..."
    
    backup_file=$(create_backup)
    upload_to_s3 ${backup_file}
    cleanup
    
    echo "Backup process completed successfully"
}

# Run the main function
main
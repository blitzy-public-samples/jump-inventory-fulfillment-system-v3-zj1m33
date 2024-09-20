#!/bin/bash

# Set environment variables
DB_NAME="${DB_NAME}"
DB_USER="${DB_USER}"
DB_HOST="${DB_HOST}"
S3_BUCKET="${S3_BUCKET}"
BACKUP_FILE="${BACKUP_FILE}"

# Function to check if required tools are installed
check_dependencies() {
    # Check if PostgreSQL client (psql) is installed
    if ! command -v psql &> /dev/null; then
        echo "Error: PostgreSQL client (psql) is not installed."
        exit 1
    fi

    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        echo "Error: AWS CLI is not installed."
        exit 1
    fi
}

# Function to download the latest backup file from S3
download_backup() {
    local temp_file="/tmp/${BACKUP_FILE}"
    
    # Use AWS CLI to download the latest backup file from S3
    if aws s3 cp "s3://${S3_BUCKET}/${BACKUP_FILE}" "${temp_file}"; then
        echo "${temp_file}"
    else
        echo "Error: Failed to download backup file from S3."
        exit 1
    fi
}

# Function to restore the database from the downloaded backup file
restore_database() {
    local backup_file="$1"

    # Drop existing database if it exists
    psql -h "${DB_HOST}" -U "${DB_USER}" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"

    # Create a new database
    psql -h "${DB_HOST}" -U "${DB_USER}" -d postgres -c "CREATE DATABASE ${DB_NAME};"

    # Use pg_restore to restore the database from the backup file
    if pg_restore -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" "${backup_file}"; then
        echo "Database restoration successful."
    else
        echo "Error: Database restoration failed."
        exit 1
    fi
}

# Function to remove the downloaded backup file
cleanup() {
    local backup_file="$1"
    rm -f "${backup_file}"
}

# Main function to orchestrate the database restoration process
main() {
    # Call check_dependencies function
    check_dependencies

    # Call download_backup function and store the result
    local backup_file=$(download_backup)

    # Call restore_database function with the downloaded backup file
    restore_database "${backup_file}"

    # Call cleanup function to remove the temporary backup file
    cleanup "${backup_file}"

    # Print final success message
    echo "Database restoration process completed successfully."
}

# Execute the main function
main

# Human tasks:
# - Review and test the script in a staging environment before using in production
# - Ensure proper AWS IAM permissions are set up for S3 access
# - Set up appropriate database connection details in the environment variables
# - Consider implementing additional error handling and logging
# - Add a mechanism to verify the integrity of the backup file before restoration
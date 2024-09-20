#!/bin/bash

# Deployment script for Inventory Management and Fulfillment Application

# Function to check if required environment variables are set
check_environment() {
    local required_vars=("DEPLOY_SERVER" "DEPLOY_USER" "DEPLOY_PATH" "GITHUB_REPO")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "Error: $var is not set"
            exit 1
        fi
    done
    echo "Environment check passed"
}

# Function to pull the latest code from GitHub
pull_latest_code() {
    echo "Pulling latest code from GitHub..."
    cd "$DEPLOY_PATH" || exit 1
    git fetch origin
    git reset --hard origin/main
    echo "Latest code pulled successfully"
}

# Function to build the application
build_application() {
    echo "Building application..."
    npm ci
    npm run build
    if [ $? -eq 0 ]; then
        echo "Application built successfully"
    else
        echo "Error: Application build failed"
        exit 1
    fi
}

# Function to run database migrations
run_database_migrations() {
    echo "Running database migrations..."
    npm run migrate
    if [ $? -eq 0 ]; then
        echo "Database migrations completed successfully"
    else
        echo "Error: Database migrations failed"
        exit 1
    fi
}

# Function to restart the application
restart_application() {
    echo "Restarting application..."
    pm2 restart inventory-app
    if [ $? -eq 0 ]; then
        echo "Application restarted successfully"
    else
        echo "Error: Failed to restart application"
        exit 1
    fi
}

# Main function to orchestrate the deployment process
main() {
    echo "Starting deployment process..."
    check_environment
    pull_latest_code
    build_application
    run_database_migrations
    restart_application
    echo "Deployment completed successfully"
}

# Run the main function
main
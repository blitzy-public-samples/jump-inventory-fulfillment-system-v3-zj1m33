#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Setting up the Inventory Management and Fulfillment Application..."

# Check for required system dependencies
command -v curl >/dev/null 2>&1 || { echo >&2 "curl is required but not installed. Aborting."; exit 1; }

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Redis
sudo apt-get install -y redis-server

# Clone the project repository
git clone https://github.com/your-repo/inventory-management.git
cd inventory-management

# Install project dependencies
npm install

# Set up the database
sudo -u postgres psql -c "CREATE DATABASE inventory_management;"
sudo -u postgres psql -c "CREATE USER app_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_management TO app_user;"

# Run database migrations
npm run migrate

# Configure environment variables
cp .env.example .env
echo "Please update the .env file with your specific configuration."

# Set up AWS CLI and configure credentials
sudo apt-get install -y awscli
aws configure

# Install and configure Docker (optional)
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Run initial build and tests
npm run build
npm test

echo "Setup complete! Please review the .env file and make any necessary changes."
echo "You may need to log out and log back in for some changes to take effect."

# Human tasks:
# TODO: Review and adjust environment-specific variables
# TODO: Test the script in a clean environment to ensure all dependencies are correctly installed
# TODO: Add any additional project-specific setup steps as needed
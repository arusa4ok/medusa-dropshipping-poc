#!/bin/bash

# VPS Setup Script
# Run this script on your VPS to set up the environment

set -e

echo "🔧 Setting up VPS for Medusa deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20+
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install Redis
echo "📦 Installing Redis..."
sudo apt install -y redis-server

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Configure PostgreSQL
echo "🔧 Configuring PostgreSQL..."
sudo -u postgres psql << EOF
CREATE DATABASE medusa_db;
CREATE USER medusa WITH PASSWORD 'change_this_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa;
\q
EOF

# Start and enable services
echo "🚀 Starting services..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start redis-server
sudo systemctl enable redis-server
sudo systemctl start nginx
sudo systemctl enable nginx

# Create app directory
echo "📁 Creating application directory..."
mkdir -p ~/apps/medusa-dropshipping

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ VPS setup completed!"
echo ""
echo "Next steps:"
echo "1. Clone your repository to ~/apps/medusa-dropshipping"
echo "2. Create .env.production files with your settings"
echo "3. Run the deploy script"
echo ""
echo "⚠️  Don't forget to:"
echo "  - Change PostgreSQL password"
echo "  - Configure Nginx for your domain"
echo "  - Set up SSL with Let's Encrypt"

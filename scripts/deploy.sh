#!/bin/bash

# Deploy script for VPS
# This script should be run on the VPS server

set -e

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/apps/medusa-dropshipping

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install --production

# Build backend
echo "🔨 Building backend..."
npm run build

# Install storefront dependencies
echo "📦 Installing storefront dependencies..."
cd storefront
npm install --production

# Build storefront
echo "🔨 Building storefront..."
npm run build
cd ..

# Restart services with PM2
echo "🔄 Restarting services..."
pm2 restart ecosystem.config.js

# Show status
echo "✅ Deployment completed!"
pm2 status

echo ""
echo "🌐 Your application should be running at:"
echo "  - Backend: http://your-domain.com:9000"
echo "  - Storefront: http://your-domain.com:8001"

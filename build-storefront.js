const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🏗️  Building Secrets Shop for deployment...')

// 1. Install dependencies
console.log('\n📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed')
} catch (error) {
  console.log('⚠️ npm install failed, trying with existing deps...')
}

// 2. Update environment for production
console.log('\n🔧 Setting up production environment...')
const envContent = `
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_975846c59f822a8c2931d467b542e6496b1c767a3bdc840bab09e7357830a953
NODE_ENV=production
`

fs.writeFileSync('.env.local', envContent)
console.log('✅ Environment configured')

// 3. Build the application
console.log('\n🔨 Building Next.js application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// 4. Start production server
console.log('\n🚀 Starting production server on port 8001...')
try {
  execSync('npm run start', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Failed to start server:', error.message)
}

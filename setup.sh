set -e  # Exit on any error
echo "🚀 Setting up Book Manager..."

# Install dependencies
echo "📦 Installing dependencies for server and client..."
npm run deps

# Create default environment variables
echo "🔧 Creating default environment variables..."
npm run envs -- -default

# Start Postgres via Docker
echo "🐘 Starting Postgres via Docker..."
npm run db:up

# Wait a moment for the database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 3

echo "✅ Setup complete!"

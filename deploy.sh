#!/bin/bash

# TeamTask Deployment Script
echo "🚀 Starting TeamTask deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your preferred values!"
    echo "   Default values will work for development."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to initialize..."
timeout=60
counter=0
until docker compose exec -T mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo "❌ MongoDB failed to start within $timeout seconds"
        docker compose logs mongo
        exit 1
    fi
    echo "   ... still waiting for MongoDB ($counter/$timeout seconds)"
done

echo "✅ MongoDB is ready!"

# Wait a bit more for backend to connect
echo "⏳ Waiting for backend to connect..."
sleep 5

# Check service status
echo "📊 Service status:"
docker compose ps

echo ""
echo "✅ Deployment complete!"
echo "🌐 Frontend: http://localhost"
echo "🔧 Backend API: http://localhost/api"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker compose logs -f"
echo "  View specific service: docker compose logs -f [mongo|backend|frontend|nginx]"
echo "  Stop services: docker compose down"
echo "  Restart: docker compose restart"
echo "  Rebuild: docker compose up --build -d"
echo ""
echo "🔧 Troubleshooting:"
echo "  If MongoDB auth fails: docker compose down -v && docker compose up --build -d"
echo "  If backend won't start: docker compose logs backend"
echo "  If frontend is blank: docker compose logs nginx"
echo ""
echo "🎯 Ready to use TeamTask!"

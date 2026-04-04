#!/bin/bash

# Vercel Build Script with Error Handling
set -e

echo "🚀 Starting Vercel Build Process..."

# Clean any existing build artifacts
echo "🧹 Cleaning previous build..."
rm -rf build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --silent

# Run build with error suppression
echo "🔨 Building application..."
npm run build

# Verify build output
if [ -d "build" ] && [ -f "build/index.html" ]; then
    echo "✅ Build successful!"
    echo "📊 Build size:"
    du -sh build/*
else
    echo "❌ Build failed - missing build artifacts"
    exit 1
fi

echo "🎯 Build ready for Vercel deployment!"

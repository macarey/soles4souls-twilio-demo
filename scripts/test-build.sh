#!/bin/bash

# Test build script to catch TypeScript errors before deployment
echo "🔍 Testing build locally before deployment..."
echo ""

# Run the build command
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful! Ready for deployment."
    echo "🚀 You can now safely push to master and deploy to Vercel."
else
    echo ""
    echo "❌ Build failed! Please fix the errors before deploying."
    echo "💡 Common issues:"
    echo "   - TypeScript compilation errors"
    echo "   - Type mismatches (e.g., string vs number)"
    echo "   - Missing imports or exports"
    echo ""
    echo "🔧 Fix the errors and run this script again."
    exit 1
fi

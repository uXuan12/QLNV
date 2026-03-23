#!/bin/bash

echo "🔍 Testing EMS API Endpoints..."
echo "================================="

# Test Certificates API
echo ""
echo "📜 Testing Certificates API..."
echo "GET http://localhost:8080/api/certificates"
curl -s -H "Accept: application/json" http://localhost:8080/api/certificates | jq '.' 2>/dev/null || curl -s http://localhost:8080/api/certificates

# Test Languages API
echo ""
echo "🌐 Testing Languages API..."
echo "GET http://localhost:8080/api/languages"
curl -s -H "Accept: application/json" http://localhost:8080/api/languages | jq '.' 2>/dev/null || curl -s http://localhost:8080/api/languages

# Test Employees API (requires authentication)
echo ""
echo "👥 Testing Employees API (requires login)..."
echo "GET http://localhost:8080/api/employees"
curl -s -H "Accept: application/json" http://localhost:8080/api/employees | jq '.' 2>/dev/null || curl -s http://localhost:8080/api/employees

echo ""
echo "✅ API Testing Complete!"
echo "Note: Employees API requires authentication. Use login endpoint first."
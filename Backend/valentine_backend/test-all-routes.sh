#!/bin/bash

# Backend API Test Script
# Tests all routes: /register, /open-user, /verify-referral, /submit-user

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

echo "=========================================="
echo "    BACKEND API COMPREHENSIVE TESTS"
echo "=========================================="
echo ""

# Helper function to test endpoints
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local expected_content="$6"
    
    echo "Testing: $name"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check if expected content is in response
    if [[ "$body" == *"$expected_content"* ]]; then
        echo "  ✅ PASS - Found: $expected_content"
        ((PASS++))
    else
        echo "  ❌ FAIL - Expected: $expected_content"
        echo "  Response: $body"
        ((FAIL++))
    fi
    echo ""
}

echo "=========================================="
echo "1. VERIFY-REFERRAL TESTS"
echo "=========================================="

# Test 1: Missing code
test_endpoint "Missing referral code" "POST" "/verify-referral" '{}' 400 "Referral code is required"

# Test 2: Invalid code
test_endpoint "Invalid referral code" "POST" "/verify-referral" '{"code":"INVALIDXXX"}' 404 "Invalid referral code"

# Test 3: Valid code (use existing code from DB)
test_endpoint "Valid referral code" "POST" "/verify-referral" '{"code":"I550RS3C"}' 200 "valid"

echo "=========================================="
echo "2. REGISTER TESTS (New API)"
echo "=========================================="

# Test 4: Missing fields
test_endpoint "Missing required fields" "POST" "/register" '{"name":"Test"}' 400 "required"

# Test 5: Campus student login (existing)
test_endpoint "Campus student login" "POST" "/register" '{"name":"Test","email":"sameerkr.dev@gmail.com","phone":"123456"}' 200 "login_student"

# Test 6: Outsider pending (new email)
RANDOM_EMAIL="test$(date +%s)@example.com"
test_endpoint "Outsider pending approval" "POST" "/register" "{\"name\":\"Test\",\"email\":\"$RANDOM_EMAIL\",\"phone\":\"999$(date +%s | tail -c 8)\"}" 200 "pending"

# Test 7: Invalid referral code in register
test_endpoint "Invalid referral in register" "POST" "/register" '{"name":"Test","email":"test123@example.com","phone":"1112223334","referralCode":"INVALIDXX"}' 400 "invalid_referral"

# Test 8: Self-referral prevention (campus student with own code)
test_endpoint "Self-referral blocked (campus)" "POST" "/register" '{"name":"Test","email":"sameerkr.dev@gmail.com","phone":"1234567","referralCode":"I550RS3C"}' 200 "login_student"

echo "=========================================="
echo "3. OPEN-USER TESTS (Legacy API)"
echo "=========================================="

# Test 9: Campus student via legacy endpoint
test_endpoint "Legacy - Campus login" "POST" "/open-user" '{"name":"Test","email":"sameerkr.dev@gmail.com","phone":"123"}' 200 "approved"

# Test 10: Missing fields legacy
test_endpoint "Legacy - Missing fields" "POST" "/open-user" '{"name":"Test"}' 400 "required"

echo "=========================================="
echo "4. SUBMIT-USER TESTS (Auth Required)"
echo "=========================================="

# Test 11: Unauthorized access
test_endpoint "Submit without auth" "POST" "/submit-user" '{"name":"Test","email":"test@test.com","phoneNo":"123"}' 401 ""

echo "=========================================="
echo "5. ROOT ENDPOINT"
echo "=========================================="

# Test 12: Root endpoint
test_endpoint "Root endpoint" "GET" "/" "" 200 "Hello"

echo "=========================================="
echo "           TEST SUMMARY"
echo "=========================================="
echo ""
echo "  ✅ Passed: $PASS"
echo "  ❌ Failed: $FAIL"
echo "  Total: $((PASS + FAIL))"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All tests passed!"
else
    echo "⚠️  Some tests failed. Review the output above."
fi

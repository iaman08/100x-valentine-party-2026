#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)
CAMPUS_EMAIL="sameerkr.dev@gmail.com" # From student.txt

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 Starting Automated API Tests..."
echo "--------------------------------"

# Function to check result
check_result() {
  if [[ $1 == *"true"* ]] || [[ $1 == *"Awaiting approval"* ]] || [[ $1 == *"valid"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
  else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $1"
  fi
}

# 1. Test Campus Student (Auto-Approve)
# Note: Using a real campus email from student.txt, might fail if already exists.
# We'll rely on the manual delete or just see if it handles 'already registered' gracefully for this script
echo -n "1. Testing Campus Student Registration... "
RESPONSE=$(curl -s -X POST "$API_URL/open-user" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Auto Test Campus\", \"email\": \"$CAMPUS_EMAIL\", \"phone\": \"+9199$TIMESTAMP\"}")

if [[ $RESPONSE == *"User already registered"* ]]; then
     echo -e "${GREEN}✅ PASS (User already exists logic working)${NC}"
else
    # Should be approved
    if [[ $RESPONSE == *"approved"* ]]; then
        echo -e "${GREEN}✅ PASS (Auto-approved)${NC}"
    else 
        echo -e "${RED}❌ FAIL${NC} - $RESPONSE"
    fi
fi

# 2. Test Non-Campus (Manual Approval)
echo -n "2. Testing Manual Approval Flow... "
RESPONSE=$(curl -s -X POST "$API_URL/open-user" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Auto Test Manual\", \"email\": \"manual$TIMESTAMP@test.com\", \"phone\": \"+9188$TIMESTAMP\"}")
check_result "$RESPONSE"

# 3. Test Invalid Referral Code
echo -n "3. Testing Invalid Referral Code... "
RESPONSE=$(curl -s -X POST "$API_URL/open-user" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Auto Test Invalid\", \"email\": \"invalid$TIMESTAMP@test.com\", \"phone\": \"+9177$TIMESTAMP\", \"referralCode\": \"INVALID_CODE\"}")

if [[ $RESPONSE == *"Invalid/exhausted"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC} - $RESPONSE"
fi

# 4. Verify Referral Code Endpoint
echo -n "4. Testing /verify-referral (Invalid Code)... "
RESPONSE=$(curl -s -X POST "$API_URL/verify-referral" \
  -H "Content-Type: application/json" \
  -d "{\"code\": \"INVALID\"}")

if [[ $RESPONSE == *"false"* ]]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC} - $RESPONSE"
fi

echo "--------------------------------"
echo "Tests Completed!"

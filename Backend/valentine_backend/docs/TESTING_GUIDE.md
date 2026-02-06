# API Testing Guide

## All Available Routes

| Route | Method | Authentication | Purpose |
|-------|--------|----------------|---------|
| `/` | GET | None | Health check |
| `/open-user` | POST | None | User registration with campus/referral logic |
| `/approve-telegram` | POST | None | Manual approval endpoint |
| `/telegram-webhook` | POST | None | Telegram button callbacks |
| `/verify-referral` | POST | None | Validate referral codes |
| `/submit-user` | POST | Token Required | Register user with referral (legacy) |

---

## Test Commands

### 1. Health Check
```bash
curl http://localhost:3000/
# Expected: "Hello via Bun + Express!"
```

---

### 2. Campus Student Registration (Auto-Approval)
```bash
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Campus User",
    "email": "sameerkr.dev@gmail.com",
    "phone": "+919001234567"
  }'
```
**Expected Response:**
```json
{
  "message": "Campus student approved! Check your email.",
  "referralCode": "XXXXXXXX",
  "approved": true
}
```

---

### 3. Non-Campus with Valid Referral Code (Auto-Approval)
```bash
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Referred User",
    "email": "referred@example.com",
    "phone": "+919002234567",
    "referralCode": "I550RS3C"
  }'
```
**Expected (if code valid and count < 5):**
```json
{
  "message": "Approved via referral code! Check your email.",
  "approved": true
}
```

---

### 4. Non-Campus without Referral Code (Manual Approval)
```bash
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Regular User",
    "email": "regular@example.com",
    "phone": "+919003234567"
  }'
```
**Expected:**
```json
{"message": "Awaiting approval"}
```

---

### 5. Invalid/Exhausted Referral Code
```bash
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Code User",
    "email": "invalid@example.com",
    "phone": "+919004234567",
    "referralCode": "INVALID123"
  }'
```
**Expected:**
```json
{"message": "Invalid/exhausted referral code. Awaiting manual approval."}
```

---

### 6. Verify Referral Code
```bash
# Valid code
curl -X POST http://localhost:3000/verify-referral \
  -H "Content-Type: application/json" \
  -d '{"code": "I550RS3C"}'
# Expected: {"valid":true,"message":"Referral code valid"}

# Invalid code
curl -X POST http://localhost:3000/verify-referral \
  -H "Content-Type: application/json" \
  -d '{"code": "INVALID"}'
# Expected: {"valid":false,"message":"Invalid referral code"}
```

---

### 7. Test Validation Errors
```bash
# Missing required fields
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'
# Expected: {"error":"Name, email, and phone are required"}

# Duplicate user
curl -X POST http://localhost:3000/open-user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate",
    "email": "sameerkr.dev@gmail.com",
    "phone": "+919999999999"
  }'
# Expected: {"error":"User already registered"}
```

---

### 8. Test Protected Route
```bash
curl -X POST http://localhost:3000/submit-user \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@test.com", "phoneNo": "+919999999999"}'
# Expected: {"error":"Access token required"}
```

---

## Test Results Summary

| Test | Route | Result |
|------|-------|--------|
| Health Check | `GET /` | ✅ Pass |
| Campus Student Auto-Approval | `POST /open-user` | ✅ Pass |
| Valid Referral Auto-Approval | `POST /open-user` | ✅ Pass |
| No Referral Manual Approval | `POST /open-user` | ✅ Pass |
| Invalid Referral Manual Approval | `POST /open-user` | ✅ Pass |
| Verify Valid Referral | `POST /verify-referral` | ✅ Pass |
| Verify Invalid Referral | `POST /verify-referral` | ✅ Pass |
| Missing Fields Validation | `POST /open-user` | ✅ Pass |
| Protected Route Auth Check | `POST /submit-user` | ✅ Pass |

---

## Testing Telegram Webhook

The webhook is triggered automatically when you click Accept/Reject in Telegram.

**Check webhook status:**
```bash
curl "https://api.telegram.org/bot8498021966:AAHIAVULO_-trKgKs5Y9hQ8QI3cfNf9FuKs/getWebhookInfo"
```

**Reset webhook (if needed):**
```bash
curl -X POST "https://api.telegram.org/bot8498021966:AAHIAVULO_-trKgKs5Y9hQ8QI3cfNf9FuKs/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://YOUR_NGROK_URL/telegram-webhook"}'
```

---

## Database Verification

**Check database entries:**
```bash
bun run test-db.ts
```

**Direct Prisma Studio (visual):**
```bash
bunx prisma studio
```

---

## Notes

- Email errors are expected until SMTP is configured (users are still approved)
- Each referral code has max 5 uses
- Campus emails are defined in `student.txt`
- Google Sheet updates require the updated Apps Script


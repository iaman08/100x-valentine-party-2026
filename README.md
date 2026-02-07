# 100xValentine - Advanced Event Platform

A production-grade event management and ticketing platform (Luma-style) featuring robust security, atomic capacity enforcement, and a modern UI.

## 🚀 Key Features (Branch: `advfeature`)

### 🛡️ Database Hardening & Integrity
- **Atomic Capacity Enforcement**: Uses raw SQL updates with conditional increments to prevent race conditions during high-concurrency ticket bookings.
- **Waitlist System**: Automatically moves users to a waitlist when events reach peak capacity.
- **Soft Deletes**: Implemented `deletedAt` for Users and Events to prevent accidental data loss.
- **Optimized Indexing**: Comprehensive indexing on frequently searched fields (email, phone, codes, event dates) for high-performance reads.
- **Strict Constraints**: Unique constraints on tickets (one per user per event) and referral links.

### 🏗️ Backend Architecture
- **Professional Refactor**: Moved from a flat structure to a clean `src/` hierarchy:
  - `controllers/`: Business logic separation.
  - `routes/`: API endpoint definitions with role-based protection.
  - `middleware/`: Authentication, Error Handling, and Rate Limiting.
  - `utils/`: Schema validation (Zod) and external service integrations.
- **Authentication**: JWT-based session management stored in `HttpOnly` cookies for XSS protection.

### 🎨 Frontend Modernization
- **Modern UI**: Completely redesigned using **React**, **Tailwind CSS**, and **Shadcn UI**.
- **Global Auth State**: Centralized `AuthContext` for seamless session management.
- **Admin Dashboard**: Dedicated portal for event creation, deletion, and attendee management.
- **User Dashboard**: personalized view for ticket history and referral code management.

---

## 🛠️ Tech Stack
- **Runtime**: [Bun](https://bun.sh/)
- **Backend Framework**: Express.js
- **ORM**: Prisma (with PostgreSQL on Neon)
- **Frontend**: React (Vite)
- **UI Library**: Shadcn UI + Lucide React
- **Validation**: Zod

---

## 🏃 Getting Started

### Prerequisites
- [Bun installed](https://bun.sh/docs/installation)
- A PostgreSQL database (e.g., [Neon](https://neon.tech/))

### 1. Backend Setup
```bash
cd Backend/valentine_backend
bun install

# Configure Environment
# Create a .env file based on the keys below:
# DATABASE_URL=...
# JWT_SECRET=...
# FRONTEND_URL=http://localhost:5173

# Push Database Schema
bunx prisma migrate dev --name init

# Start Server
bun run start
```

### 2. Frontend Setup
```bash
cd Frontend/valentine_frontend
npm install

# Start Dev Server
npm run dev
```

---

## 👮 Admin Access
To promote a user to the Admin role, use the following backend script:
```bash
cd Backend/valentine_backend
bun run scripts/makeAdmin.ts <user-email>
```

---

## 📜 License
Private Project - 100xValentine.

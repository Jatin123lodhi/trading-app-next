# Trading App

A Next.js trading application.

## Setup

1. Start Docker locally and run the database:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
npm i
```

3. Run the development server:
```bash
npm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)


# 🚀 Day 1: Full-Stack Trading App Foundation - Authentication & Database Setup

Set up the complete backend infrastructure for a Next.js trading application with production-ready patterns:

### ✅ Completed Features
- **Project Initialization**: Bootstrapped Next.js 14+ app with TypeScript, MongoDB integration, and Docker containerization
- **Authentication System**: Implemented secure user registration and login API routes with JWT-based authentication
- **MongoDB Integration**: Configured local MongoDB instance using Docker Compose with replica set support
- **Connection Optimization**: Implemented MongoDB connection caching to prevent connection exhaustion in development mode
- **API Testing**: Validated all authentication endpoints using Postman with successful user registration, login, and token verification flows

### 🛠️ Tech Stack
- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Dockerized)
- **Authentication**: JWT
- **Validation**: Zod schemas
- **Tools**: Docker, Postman

### 📝 Key Learnings
- Proper MongoDB connection pooling in serverless environments
- Securing API routes with middleware authentication
- Docker Compose for consistent local development environments
- RESTful API design patterns for financial applications

# 🎯 Day 2: Market Creation & Role-Based Access Control

### ✅ Completed Features

**Market Creation System**: Built a secure admin-only API endpoint for creating prediction markets with comprehensive validation layers.

The challenge? Handling multiple validation checks to ensure data integrity:
- **Admin Authorization**: Role-based middleware restricting market creation to admins only
- **Input Validation**: Zod schemas validating market data (title, description, category, end date)
- **Uniqueness Checks**: Ensured unique market titles to prevent duplicates
- **Query System**: Added pagination and filtering by category and status

### 🔥 Technical Challenge

Market creation required orchestrating multiple validation layers in sequence: JWT verification → Role authorization → Schema validation → Database uniqueness checks. Getting the order right was crucial for both security and performance.

### 📚 Key Learnings
- Role-based access control patterns in Next.js API routes
- Mongoose schema design for marketplace applications
- RESTful query parameter handling for filtering and pagination

---
*Day 2 complete - Markets are live! 🎪*


# 💰 Day 3: Order Placement System with Wallet Integration

### ✅ Completed Features

**Order Placement with Transactions**: Implemented a complex order placement system that integrates user wallets with market trades using MongoDB transactions to ensure data consistency.

**Wallet Management**: Built user wallet system supporting multiple currencies (INR, USD) with balance tracking and locking mechanisms.

Key implementations:
- **Wallet Creation**: User-specific wallets with currency validation and duplicate prevention
- **Balance Locking**: Implemented `lockedBalance` field to reserve funds for pending orders
- **Transaction-Based Orders**: Used MongoDB sessions for atomic operations across multiple collections
- **Multi-Step Validation**: Market existence → Market status → Wallet verification → Balance check
- **Order Lifecycle**: Created status system (locked, won, lost, cancelled) for tracking order states

### 🔥 Technical Challenge

Order placement was the most complex endpoint yet - required MongoDB transactions to maintain ACID properties across wallet and order collections. The flow: start session → validate market → check balance → lock funds → create order → commit/abort transaction.

If any validation fails, the entire transaction rolls back automatically, preventing inconsistent states like locked funds without an order.

### 📚 Key Learnings
- MongoDB transactions for multi-document ACID operations
- Balance locking patterns for financial applications
- Session management with proper cleanup (try-catch-finally)
- Atomic operations using `$inc` for concurrent updates
- Composite indexes for user-currency wallet lookups

---
*Day 3 complete - Money in motion! 💸*


# 🏆 Day 4: Market Settlement & Order Management

### ✅ Completed Features

**Market Settlement Engine**: Admin endpoint to settle markets, determine winners, and distribute payouts using pool-based calculations with MongoDB transactions.

**Order Lifecycle**: Implemented order cancellation with balance restoration and individual order retrieval with ownership validation.

**Wallet Deposits**: Added balance top-up functionality with transaction tracking.

Key implementations:
- **Order Cancellation**: Atomic wallet unlock on order cancellation
- **Settlement Algorithm**: Pool-based payout distribution across winners
- **Bulk Operations**: Mass order/wallet updates using `bulkWrite` 
- **Dynamic Routes**: GET `/api/market/[id]` and `/api/orders/[id]` endpoints

### 🔥 Technical Challenge

Orchestrating atomic updates across Markets, Orders, and Wallets in a single transaction - calculate pools, update statuses, distribute winnings, all with rollback safety.

### 📚 Key Learnings
- Pool-based payout algorithms
- MongoDB bulk operations with sessions
- Financial state management patterns

---
*Day 4 complete - Markets settled, winners paid! 💰*


# 🎨 Day 5: Frontend Integration - Minimal UI

### ✅ Completed Features

**UI Implementation**: Connected backend APIs with a clean, minimal interface using shadcn/ui components and Tailwind CSS.

Built pages:
- **Login/Register**: Form-based authentication with JWT token storage
- **Dashboard**: User profile, wallet balances, and markets list with click-through navigation
- **Market Page**: Individual market details with interactive trading panel

**Trading Panel Component**: 
- Wallet selection dropdown
- Amount input with YES/NO outcome buttons
- Real-time order placement via `/api/orders`
- Toast notifications for feedback

### 🔥 Technical Challenge

Implementing Next.js hybrid rendering - Server Components for data fetching, Client Components for interactivity (forms, trading). Handled JWT auth state with localStorage while leveraging server-side rendering benefits.

### 📚 Key Learnings
- Next.js Server/Client Component patterns
- JWT token management in browser storage
- Component composition in App Router
- shadcn/ui integration

### 📸 Screenshots
*(Screenshots will be added)*

<img width="1461" height="880" alt="image" src="https://github.com/user-attachments/assets/748b56c2-dedc-4ada-a840-f4c51864be31" />
<img width="1461" height="880" alt="image" src="https://github.com/user-attachments/assets/b9ba4a39-5f8a-4a71-b747-b1da6f5cfa03" />

---
*Day 5 complete - Backend meets Frontend! 🎨*
*Building in public - One day at a time 💪*

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
- **Dynamic Routes**: GET `/api/markets/[id]` and `/api/orders/[id]` endpoints

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


# 🔧 Day 6: Fixes & Improvements

### ✅ Completed Features

**Settlement Engine Fix**: Fixed critical transaction bugs - wallets now properly update on market settlement with correct payout calculations.

**Wallet Management UI**: Added wallet creation and balance top-up interface directly in dashboard.

**Smart UX Enhancements**:
- Order list auto-refreshes after placement
- Bet buttons disabled until wallet selected
- Validation errors display as readable toast messages

### 🔥 Technical Challenge

Settlement was silently failing - wallet updates weren't part of the transaction. Added missing session parameters and fixed the payout math (winners get bet + share of losing pool).

### 📚 Key Learnings
- MongoDB transaction session propagation
- React refresh patterns with prop triggers
- Zod error formatting for better UX

---
*Day 6 complete - Production-ready! 🎯*

# 🔐 Day 7: Middleware & Route Protection

### ✅ Completed Features

**Authentication Middleware**: Implemented Next.js middleware for automatic route protection and authentication state management with Edge Runtime compatibility.

**Cookie-Based Auth**: Migrated from localStorage-only to httpOnly cookies for enhanced security against XSS attacks.

**Logout System**: Built server-side logout endpoint to properly clear httpOnly cookies.

Key implementations:
- **Route Protection**: Middleware automatically redirects unauthenticated users from protected routes (`/dashboard`, `/create-market`, `/market/*`) to login page
- **Auth Route Guards**: Logged-in users automatically redirected from `/login` and `/register` to dashboard
- **Redirect Preservation**: Saves intended destination in query params (`?redirect=/dashboard`) to redirect users after login
- **Edge Runtime**: Used `jose` library instead of `jsonwebtoken` for Edge Runtime compatibility
- **Security Hardening**: 
  - httpOnly cookies prevent JavaScript access
  - Conditional `secure` flag based on environment (HTTPS in production)
  - `sameSite: strict` for CSRF protection

### 🔥 Technical Challenge

Next.js middleware runs in Edge Runtime, which doesn't support Node.js-specific libraries like `jsonwebtoken`. Had to switch to `jose` library and convert JWT verification to work with Web Crypto APIs. Also discovered that httpOnly cookies require server-side deletion, necessitating a logout API endpoint.

### 📚 Key Learnings
- Edge Runtime vs Node.js runtime differences
- httpOnly cookie security patterns
- Next.js middleware execution model and config matchers
- JWT verification with `jose` library (Web Crypto API)
- Redirect flow patterns with query parameters
- Open redirect vulnerability prevention

### 🔒 Security Improvements
- Tokens stored in httpOnly cookies (not accessible via JavaScript)
- Environment-aware secure flag for HTTPS
- Validation of redirect URLs to prevent open redirect attacks
- Automatic token verification on every protected route

---
*Day 7 complete - Secure by default! 🔐*

# ✨ Day 8: Testing & Micro Interactions

### ✅ Completed Features

**Test Coverage**: Added unit tests for components to ensure reliability and catch regressions early.

**Micro Interactions**: Polished UI with smooth, delightful interactions:
- Hover effects on login button
- Shimmer skeleton loaders for card components
- Icon loading states for async actions
- Animated heading transitions

### 📚 Key Learnings
- Component testing with Jest and React Testing Library
- CSS animations for better perceived performance
- Skeleton loaders improve UX during data fetching
- Small interactions create big impacts on user experience

---
*Day 8 complete - Details matter! ✨*

# 🌃 Day 9: 3D Landing Page with Three.js

### ✅ Completed Features

**Cyberpunk City Background**: Integrated Three.js (via CDN) to create an immersive 3D animated cityscape on landing pages.

**Interactive 3D Scene**:
- Mouse/touch-responsive camera rotation
- Animated buildings with particle effects and dynamic lighting
- Conditional rendering (landing, login, register pages only)
- Glassmorphism UI overlay with backdrop blur

### 🔥 Technical Challenge

Loading Three.js from CDN with Next.js `Script` component while managing React strict mode double-mounting. Implemented proper cleanup with `useRef` to prevent memory leaks and duplicate scene initialization.

### 📚 Key Learnings
- Three.js integration in Next.js App Router
- CDN-based library loading for reduced bundle size
- Animation frame management and scene cleanup
- Combining 3D backgrounds with modern UI patterns
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/9cd0d3cf-1775-493c-8c67-52b95e1587fe" />

---
*Day 9 complete - Visual impact unlocked! 🌃*

# 📊 Day 10: Real-Time Market Updates with Smart Polling

### ✅ Completed Features

**Real-Time Data Sync**: Implemented automatic market updates to display live bet amounts and probability percentages as users place orders across the platform.

**Smart Polling Strategy**: Dashboard automatically refreshes market data every 5 seconds without disrupting the user experience.

### 🔥 Technical Challenge

**SSE vs Polling Decision**: Initially explored Server-Sent Events (SSE) for real-time updates, but discovered Vercel's serverless architecture has critical limitations:

**Vercel Constraints**:
- Function timeout: 10s (Hobby) / 60s (Pro) / 5min (Enterprise max)
- Each SSE connection blocks a serverless execution slot
- Connections forcibly closed after timeout
- Not designed for persistent connections

**Why SSE Doesn't Scale on Vercel**:
```
❌ 10k users with SSE = 10k blocked serverless executions
❌ Connections die after 60 seconds max
❌ Cost: Extremely expensive (pay per execution time)
```

---
*Day 10 complete - Real-time data without the real-time server! 📊*

# 🔄 Day 11: TanStack Query Migration - Professional Data Management

### ✅ Completed Features

**TanStack Query Integration**: Migrated entire dashboard from manual fetch/useState patterns to TanStack Query for declarative, cache-first data management.

**Query & Mutation Implementation**:
- **Markets Query**: Automatic polling (5s intervals) with smart caching
- **Wallets Query**: Cached fetching with conditional execution
- **Create Wallet Mutation**: Optimistic updates with automatic cache invalidation
- **Add Balance Mutation**: Transactional updates with rollback safety

**State Management Elimination**:
- Removed 100+ lines of manual state management boilerplate
- Eliminated all manual `useState` for loading states
- Replaced manual `useEffect` polling with declarative `refetchInterval`
- Automatic error handling via mutation callbacks

### 🔥 Technical Challenge

Dashboard had grown complex with manual fetch logic, loading states, polling intervals, and manual refetch calls scattered everywhere. The challenge: migrate to TanStack Query without breaking existing functionality while maintaining type safety.

**Before (Manual Pattern)**:
```javascript
const [markets, setMarkets] = useState([]);
const [loading, setLoading] = useState(true);
useEffect(() => { fetchMarkets() }, [user]);
useEffect(() => { setInterval(() => fetchMarkets(), 5000) }, []);
// Manual cleanup, manual refetch after mutations...
```

**After (TanStack Query)**:
```javascript
const { data: markets = [], isLoading } = useQuery({
  queryKey: ['markets'],
  queryFn: fetchMarkets,
  refetchInterval: 5000,
  enabled: !!user
});
// Automatic cleanup, automatic caching, automatic refetching!
```

### 🎯 Impact Summary

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lines of Code | ~180 | ~80 | 🔥 55% reduction |
| Manual useState | 8 hooks | 3 hooks | ⚡ 62% reduction |
| useEffect hooks | 4 hooks | 0 hooks | ✨ 100% elimination |
| Loading states | Manual | Automatic | 🤖 Fully automated |
| Cache management | None | Built-in | 🚀 Free performance |

---
*Day 11 complete - Data fetching, elevated! 🔄*

# 🎨 Day 12: UI Polish & UX Refinements

### ✅ Completed Features

**Landing Page Redesign**: Overhauled the landing page with enhanced visual hierarchy and modern design patterns for better first impressions.

**Profile Dropdown**: Added user profile dropdown component with quick access to account actions and navigation.

**Live Price Animations**: Implemented micro-interactions showing real-time price updates with smooth transitions and visual feedback.

**Market Details Improvements**: Enhanced the market page with better layout, clearer information architecture, and improved trading interface.

**Route Fixes**: Resolved navigation issues in market routing for smoother page transitions.

**Flash of Red Elimination**: Fixed the jarring red flash that appeared on initial page load by optimizing CSS loading order and component initialization.

### 🔥 Technical Challenge

Eliminating the red flash required tracing CSS cascade issues and component mount timing. The flash occurred due to Tailwind styles loading after initial paint, causing layout shifts with default browser styling showing first.

### 📚 Key Learnings
- CSS-in-JS loading optimization strategies
- Dropdown component patterns with proper focus management
- Animation frame timing for smooth price transitions
- Layout shift prevention techniques

---
*Day 12 complete - Polished to perfection! ✨*

# 🚀 Day 13: Guest Access & Authentication

### ✅ Features Added
- **Guest Login**: Users can explore without registration
- **Enhanced Auth Flow**: Improved login/register UX

### 🔥 Challenge
Implementing secure guest access while maintaining proper authentication state management.

---
*Day 13 complete - Welcome guests aboard! 🎉*

# 🎨 Day 14: Dashboard Redesign & Portfolio

### ✅ Features Added
- **Dashboard Overhaul**: New color scheme, spacing, and visual hierarchy
- **Trending Carousel**: Interactive carousel for trending markets
- **Portfolio Enhancement**: Better layout and data visualization
- **Design System**: Unified card design with consistent styling

### 🎯 Key Improvements
- Background: White → Soft gray for easier viewing
- Stats Cards: Gray → Color-coded gradients for visual hierarchy
- Trending: Static grid → Interactive carousel
- Layout: Variable heights → Fixed, consistent spacing

---
*Day 14 complete - Dashboard transformed! ✨*

# 📊 Day 15: Real Volume Analytics

### ✅ Features Added
- **Volume Trends Graph**: Replaced mock data with real trading volume using MongoDB aggregation
- **Analytics API**: `/api/analytics/weekly-volume` endpoint aggregates last 7 days of order data
- **Smart Fallbacks**: Shows real data when available, mock data otherwise

### 🔥 Technical Challenge
MongoDB aggregation pipeline to group orders by date, sum daily volumes, and fill missing days with zeros for consistent 7-day visualization.

**Impact**: Chart now shows actual daily trading volume (₹3,500, ₹18,200, ₹0...) instead of fake patterns, providing real business insights.

---
*Day 15 complete - Real data, real insights! 📊*
*Building in public - One day at a time 💪*

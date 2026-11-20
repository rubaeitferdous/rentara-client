# Rentara — Premium Equipment Rental Marketplace (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-MongoDB%20Adapter-orange.svg)](https://better-auth.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.11-22c55e.svg)](https://recharts.org/)

**Rentara** is a bespoke, full-stack equipment rental marketplace connecting industrial contractors, media producers, and event organizers with verified equipment owners. Designed with a custom **"Warm Luxury"** aesthetic (warm alabaster, rich espresso, burnt amber `#D97706`, and golden honey `#F59E0B`), Rentara delivers seamless search, transparent rental schedules, and Stripe-powered checkout transactions.

---

## 🌟 Key Architecture & Features

### 1. Bespoke Warm Luxury Aesthetic
- Built on a handcrafted design system in `app/globals.css`.
- Light & dark mode persistence (`components/ThemeToggle.tsx`) without hydration mismatch.
- Modern **X** rebrand logo and Framer Motion micro-interactions.

### 2. Authentication & Session Resilience
- Powered by **BetterAuth** with MongoDB adapter and Google OAuth integration.
- Native Next.js 16 App Router server component guards (`lib/session.ts` -> `requireUser()` & `requireRole()`).
- **Zero-flash page refreshes:** Logged-in users never experience a redirect flicker to `/login` when reloading private routes.
- Next.js JWT Bridge route (`/api/token`) that seamlessly exchanges BetterAuth session cookies for cryptographically signed RS256/HS256 JWT tokens accepted by Express API middlewares.

### 3. Marketplace & Discovery
- **Dynamic Hero Banner:** Animated headline, value proposition metrics, and quick search.
- **Featured Equipment:** 6 curated items fetched with MongoDB native limit.
- **Equipment Catalog (`/equipment`):**
  - **Challenge 1:** Full server-side search by keyword and location.
  - Multi-criteria filtering by category, rental horizon (Daily, Weekly, Monthly), price range bounds, and live stock availability.
  - Dynamic sorting (Price Low-to-High, Price High-to-Low, Newest).
  - Server-side pagination controls with active page states.

### 4. Booking & Stripe Checkout Flow
- **Private Equipment Details (`/equipment/[id]`):** Technical specs, owner verification badges, live availability calendar, and saved favorites toggle.
- **Interactive Booking Modal (`components/BookingModal.tsx`):** Real-time rental duration counter and dynamic pricing calculator.
- **Stripe Checkout:** Direct redirect to Stripe-hosted checkout and automated confirmation handling (`/payment/success`).

### 5. Role-Based Dashboards
- **Customer Portal:**
  - `My Rentals`: Comprehensive rental ledger with scheduled dates, duration, total costs, and live status badges (`paid`, `confirmed`, `completed`).
  - `Saved Favorites`: Saved gear catalog with instant removal via SweetAlert2 confirmation.
- **Owner Enterprise Portal:**
  - **Challenge 3 Analytics:** 4 key performance cards (Listed Fleet, Orders Received, Completed Rentals, Gross Earnings) + dynamic Recharts monthly earnings and volume visualization.
  - `My Equipment`: Fleet inventory table with status indicators (`pending`, `approved`, `rejected`), edit drawer, and delete confirmation.
  - `Add & Edit Equipment`: 13-field form with ImgBB cloud image upload and URL fallback.
  - `Rental Orders`: Inbound rental order fulfillment ledger with customer contact details.
- **Platform Administrator Portal:**
  - **Challenge 3 Analytics:** 6 system health cards (Users, Equipment, Bookings, Pending, Completed, Gross Volume) + dynamic Recharts platform turnover visualizer.
  - `User Governance`: Table of registered users with role modifier dropdown (`customer`, `owner`, `admin`) and account deletion.
  - `Catalog Moderation`: Review queue with one-click **Approve** and **Reject** controls.
  - `Platform Ledger`: Global audit trail of all transactions and equipment exchanges.
- **Universal Profile Management:**
  - Update personal details (Name, Contact Phone, Delivery Address, Profile Avatar with ImgBB upload).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.4.5 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4, DaisyUI Warm Theme, PostCSS
- **Authentication:** BetterAuth 1.7 + MongoDB Native Adapter
- **Charts & Visualization:** Recharts 3.11
- **Icons & Animations:** Lucide React, Framer Motion
- **Alerts & Toasts:** SweetAlert2, React Hot Toast
- **Payment Processing:** Stripe Checkout API
- **Image Hosting:** ImgBB Cloud API

---

## 🚀 Getting Started

### Prerequisites
- Node.js $\ge 20$ (Tested on Node v26.13)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
cd rentara-client
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root of `rentara-client`:

```env
# Client Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Express API Backend Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# MongoDB Atlas Connection (Shared with BetterAuth)
MONGODB_URI=your_mongodb_connection_string

# BetterAuth Secret & Cryptographic JWT Bridge Key
BETTER_AUTH_SECRET=your_better_auth_secret_key
JWT_SECRET=your_synchronized_jwt_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB Cloud Upload API Key
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run typecheck
npm run build
npm run start
```

---

## 📁 Project Structure

```
rentara-client/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/    # BetterAuth endpoints
│   │   └── token/            # Next.js JWT Bridge
│   ├── dashboard/
│   │   ├── admin/            # Admin analytics, users, equipment, rentals
│   │   ├── customer/         # Customer rentals and favorites
│   │   ├── owner/            # Owner analytics, fleet management, add/edit
│   │   ├── profile/          # Universal profile settings
│   │   ├── layout.tsx        # Server-guarded dashboard shell
│   │   └── page.tsx          # Dynamic role router
│   ├── equipment/
│   │   ├── [id]/             # Private equipment details & booking
│   │   └── page.tsx          # Public equipment catalog (search/filter/sort)
│   ├── login/                # Credentials + Google OAuth login
│   ├── payment/success/      # Stripe payment confirmation
│   ├── register/             # User registration with password validation
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Home landing page with all 7 sections
│   ├── loading.tsx           # Global warm skeleton loader
│   ├── not-found.tsx         # Custom 404 page
│   └── error.tsx             # Global error boundary
├── components/
│   ├── dashboard/            # DashboardShell, DataTable, StatCard, StatusBadge, Pagination
│   ├── home/                 # Banner, Featured, Categories, WhyChooseUs, Reviews, HowItWorks, OwnerCTA
│   ├── BookingModal.tsx      # Rental pricing calculator & Stripe launcher
│   ├── EquipmentCard.tsx     # Reusable responsive equipment card
│   ├── EquipmentForm.tsx     # Unified add/edit equipment component
│   ├── Footer.tsx            # Modern footer with X logo
│   ├── Navbar.tsx            # Responsive navigation with role drawer
│   └── ThemeToggle.tsx       # Light/Dark mode switcher
├── hooks/
│   └── useApi.ts             # Authenticated SWR-style data fetcher
├── lib/
│   ├── api.ts                # Client API wrapper with JWT attachment
│   ├── auth.ts               # BetterAuth server instance
│   ├── auth-client.ts        # BetterAuth client hooks
│   ├── constants.ts          # Categories, rental types, design presets
│   ├── imgbb.ts              # ImgBB upload utility
│   └── session.ts            # Server Component session & role guards
└── types/
    └── index.ts              # TypeScript domain interfaces
```

---

## 🔒 Security & Best Practices
- **Server Guard Enforcement:** All protected dashboard and details pages enforce session validity on the server via `requireUser()` and `requireRole()`, preventing unauthorized client hydration.
- **Role Verification:** Express API verifies JWT signatures and re-verifies user roles directly against MongoDB for real-time privilege updates.
- **Sensitive Credentials Protected:** All secrets and API keys are managed strictly via environment variables and excluded from Git.

---

## 📄 License
Created for **Programming Hero Batch 14 - Assignment 9 (Category 003)**.

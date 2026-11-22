# Rentara — Premium Equipment Rental Marketplace (Frontend)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-MongoDB%20Adapter-orange.svg)](https://better-auth.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3.11-22c55e.svg)](https://recharts.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout%20Escrow-635bff.svg?logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg?logo=vercel)](https://rentara-client.vercel.app/)

**Rentara** is a bespoke, full-stack equipment rental marketplace connecting industrial contractors, media producers, agricultural operators, and event organizers with verified equipment owners. Designed with a custom **"Warm Luxury"** aesthetic (warm alabaster, rich espresso, burnt amber `#D97706`, and golden honey `#F59E0B`), Rentara delivers seamless search, transparent rental horizons, role-governed portals, and Stripe-powered checkout escrow transactions.

---

## 🔗 Project Links

| Resource | URL |
| :--- | :--- |
| 🌐 **Live Site Link** | [https://rentara-client.vercel.app/](https://rentara-client.vercel.app/) |
| 🔗 **Live Server API** | [https://rentara-server.vercel.app/](https://rentara-server.vercel.app/) |
| 💻 **GitHub Repository (Client)** | [https://github.com/rubaeitferdous/rentara-client](https://github.com/rubaeitferdous/rentara-client) |
| ⚙️ **GitHub Repository (Server)** | [https://github.com/rubaeitferdous/rentata-server](https://github.com/rubaeitferdous/rentata-server) |

---

## 🔑 Submission & Evaluation Credentials

To test and review the role-based features across the platform, use the following pre-configured credentials:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@rentara.com` | `AdminPassword123` | Full Admin Console, User Role Governance, Catalog Moderation (Approve/Reject), Platform Turnover Analytics, Global Rental Ledger |
| **Equipment Owner** | `owner@rentara.com` | `OwnerPassword123` | Add & Edit Equipment (ImgBB integration), My Fleet Inventory Management, Incoming Rental Order Fulfillment, Monthly Revenue Analytics |
| **Customer / Renter**| `customer@rentara.com`| `CustomerPassword123`| Public Catalog Browsing, Equipment Booking & Availability Check, Stripe Escrow Checkout, Saved Favorites Wishlist, Rental Receipts |

---

## 🌟 Key Architecture & Features

### 1. Bespoke Warm Luxury Aesthetic & Responsive Design
- Handcrafted design system in `app/globals.css` using amber accents, subtle borders, and warm neutral backgrounds.
- Persistent light & dark mode toggle (`components/ThemeToggle.tsx`) without hydration flash.
- Modern **X** rebrand icon in the footer and smooth micro-interactions via Framer Motion.
- Fully responsive across desktop, tablet, and mobile screens with custom slide-over navigation drawers.

### 2. Authentication & Session Resilience
- Powered by **BetterAuth** with MongoDB adapter and Google OAuth 2.0 integration.
- Native Next.js 16 App Router server component guards (`lib/session.ts` -> `requireUser()` & `requireRole()`).
- **Zero-flash page refreshes:** Logged-in users never experience a redirect flicker to `/login` when reloading private routes.
- Next.js JWT Bridge route (`/api/token`) that seamlessly exchanges BetterAuth session cookies for cryptographically signed JWT tokens accepted by Express API middlewares.

### 3. Marketplace & Discovery
- **Dynamic Hero Banner:** Animated headline, value proposition counters, and quick search bar.
- **Featured Equipment Section:** 6 curated items fetched from MongoDB using server-side limits.
- **Category Showcase:** 6 major equipment categories with direct filtered navigation.
- **Why Choose Us:** 4 highlighted pillars of trust, speed, verified owners, and insurance.
- **How It Works:** 3-step interactive rental guide from selection to return.
- **Customer Reviews:** Testimonial carousel featuring authentic community ratings.
- **Owner CTA:** High-conversion invitation banner for gear owners to list inventory.

### 4. Advanced Equipment Catalog (`/equipment`) — *Challenge 1*
- **Server-Side Full-Text Search:** Real-time search matching equipment titles, descriptions, and location with debounce.
- **Multi-Criteria Filtering:** Filter by category, rental horizon (Daily, Weekly, Monthly), price range bounds (Min/Max), and live stock availability.
- **Dynamic Sorting:** Instant re-ordering by Price: Low to High, Price: High to Low, and Newest additions.
- **Server-Side Pagination:** Interactive page controls with dynamic URL synchronization.

### 5. Private Equipment Details & Stripe Checkout (`/equipment/[id]`)
- **Server-Guarded View:** Requires user authentication before viewing equipment specifications, owner credentials, and booking controls.
- **Interactive Booking Modal:** Live date-range picker calculating duration and dynamic rental cost in real time.
- **Stripe Checkout Escrow:** Seamless redirect to Stripe-hosted payment gateway with automated return and confirmation handling (`/payment/success`).
- **Wishlist Toggle:** One-click favorite save/remove integrated with the Express API.

### 6. Role-Based Dashboards & Analytics — *Challenge 2 & 3*

#### 👤 Customer Portal (`/dashboard/customer`)
- **My Rentals Ledger:** Complete history of rented equipment with dates, duration, total paid, and status badges (`paid`, `confirmed`, `completed`).
- **Saved Favorites:** Grid of saved equipment items with instant removal via SweetAlert2 confirmation.

#### 🚜 Equipment Owner Portal (`/dashboard/owner`)
- **Business Performance Analytics:** 4 KPI overview cards (Listed Fleet, Orders Received, Completed Rentals, Gross Earnings) + dynamic Recharts monthly revenue and volume chart.
- **My Equipment Fleet:** Tabular inventory management with moderation status badges (`pending`, `approved`, `rejected`), edit modal, and delete actions.
- **Add & Edit Equipment:** 13-field validated form with direct ImgBB cloud image upload and manual URL fallback.
- **Order Fulfillment Ledger:** Real-time inbound rental requests with customer contact info and rental periods.

#### 🛡️ Platform Administrator Portal (`/dashboard/admin`)
- **Platform Analytics Engine:** 6 system health cards (Total Users, Total Equipment, Total Bookings, Pending Approvals, Completed Rentals, Gross Platform Turnover) + dynamic Recharts monthly volume visualizer.
- **User Governance:** Searchable table of registered accounts with dynamic role modification (`customer`, `owner`, `admin`) and account deletion.
- **Catalog Moderation Queue:** Review pending equipment submissions with one-click **Approve** and **Reject** controls.
- **Global Transaction Ledger:** Full audit log of all bookings across the platform.

#### ⚙️ Universal Profile Settings (`/dashboard/profile`)
- Update personal information (Full Name, Phone Number, Delivery Address, Profile Photo with ImgBB upload).

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Package | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.5 (App Router, Turbopack) | React full-stack framework with SSR and Server Components |
| **Language** | TypeScript 5 | End-to-end type safety and domain models |
| **Styling** | Tailwind CSS v4, PostCSS | Utility-first responsive design system |
| **Authentication**| BetterAuth 1.7.26 + MongoDB Adapter | Secure session management & Google OAuth 2.0 |
| **Database** | MongoDB Native Driver 7.9.1 | Session storage, caching, and direct database queries |
| **Data Viz** | Recharts 3.11.0 | Responsive analytics charts in Admin and Owner portals |
| **Icons & Motion** | Lucide React, Framer Motion | Modern UI icons and smooth page transitions |
| **Notifications** | SweetAlert2, React Hot Toast | Polished modal dialogs and toast alerts |
| **Payments** | Stripe (`@stripe/stripe-js`, `stripe`) | Secure payment processing and checkout sessions |
| **Image Hosting** | ImgBB Cloud API | Multi-part image uploading for equipment and profiles |
| **Themes** | `next-themes` | Persistent light/dark mode without hydration mismatch |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js:** $\ge 20$ (Tested on Node v20+ / v26)
- **npm** or **yarn**

### 1. Clone the Client Repository
```bash
git clone https://github.com/rubaeitferdous/rentara-client.git
cd rentara-client
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Client Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000

# Express Backend API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# MongoDB Atlas Connection (Shared with BetterAuth)
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=rentara_db

# BetterAuth Secret & Cryptographic JWT Bridge Secret
BETTER_AUTH_SECRET=your_better_auth_secret_key
JWT_SECRET=your_shared_jwt_secret_matching_server

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImgBB Cloud API Key
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
# Typecheck TypeScript files
npm run typecheck

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 📁 Project Directory Structure

```
rentara-client/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/        # BetterAuth handler endpoints
│   │   └── token/                # Next.js JWT Bridge route for Express API
│   ├── dashboard/
│   │   ├── admin/                # Admin analytics, users, equipment, rentals
│   │   ├── customer/             # Customer rentals and saved favorites
│   │   ├── owner/                # Owner analytics, equipment fleet, add/edit
│   │   ├── profile/              # Universal profile settings
│   │   ├── layout.tsx            # Server-guarded dashboard shell
│   │   └── page.tsx              # Dynamic role-based redirection
│   ├── equipment/
│   │   ├── [id]/                 # Private equipment details & booking modal
│   │   └── page.tsx              # Public equipment catalog (search/filter/sort)
│   ├── login/                    # Credentials + Google OAuth login
│   ├── payment/success/          # Stripe payment verification and receipt
│   ├── register/                 # User registration with password validation
│   ├── layout.tsx                # Root layout with theme provider & navbar/footer
│   ├── page.tsx                  # Home landing page with all 7 core sections
│   ├── loading.tsx               # Global warm luxury skeleton loader
│   ├── not-found.tsx             # Custom branded 404 page
│   └── error.tsx                 # Global error boundary
├── components/
│   ├── dashboard/                # DashboardShell, DataTable, StatCard, StatusBadge, Pagination
│   ├── home/                     # HeroBanner, FeaturedSection, CategorySection, WhyChooseUs, Reviews, HowItWorks, OwnerCTA
│   ├── BookingModal.tsx          # Rental duration calculator & Stripe launcher
│   ├── EquipmentCard.tsx         # Reusable equipment card with availability badges
│   ├── EquipmentForm.tsx         # Unified 13-field add/edit equipment component
│   ├── Footer.tsx                # Branded footer with X logo & developer link
│   ├── Navbar.tsx                # Responsive navigation with role-based avatar drawer
│   └── ThemeToggle.tsx           # Light/Dark mode switcher
├── hooks/
│   └── useApi.ts                 # Authenticated API fetch hook with JWT caching
├── lib/
│   ├── api.ts                    # Client API client with automatic JWT bearer attachment
│   ├── auth.ts                   # BetterAuth server configuration & cookie cache
│   ├── auth-client.ts            # BetterAuth client-side React hooks
│   ├── constants.ts              # Categories, rental types, design presets
│   ├── imgbb.ts                  # ImgBB image upload utility
│   └── session.ts                # Server Component session and role guards
└── types/
    └── index.ts                  # TypeScript domain models and interfaces
```

---

## 🛡️ Security & Best Practices

- **Zero-Flash Protected Routes:** Server components use `requireUser()` and `requireRole()` to evaluate sessions on the server before sending HTML, completely preventing redirect flicker.
- **HTTPS Cookie Support:** Configured BetterAuth with dynamic production origin detection and `cookieCache` for fast, secure cookie verification on Vercel.
- **Cryptographic JWT Bridge:** Automatically maps authenticated session tokens into verified JWTs for seamless cross-domain API communication with the Express server.
- **Strict Environment Isolation:** All secrets, database connection URIs, and API tokens are loaded via `.env.local` and never committed to source control.

---

## 👨‍💻 Author

**Rubaeit Ferdous Himel**  
- **GitHub:** [@rubaeitferdous](https://github.com/rubaeitferdous)  
- **Portfolio / Project:** [Rentara Client on Vercel](https://rentara-client.vercel.app/)

Created for **Programming Hero Batch 14 - Assignment 9 (Category 003)**.

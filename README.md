# CryptoTracker

A web application to track cryptocurrency wallets (Ethereum + Bitcoin) with transaction history and WhatsApp alerts.

## Features

- **Authentication**: Login/signup with NextAuth.js (credentials)
- **Dashboard**: Overview of wallets, balances, recent transactions
- **Wallet Management**: Add, view, delete ETH/BTC wallets
- **Transaction History**: Real-time transactions from Etherscan and Blockchain.com
- **WhatsApp Alerts**: Transaction notifications via WuzAPI
- **Cron Job**: Automatic transaction checking every 20 minutes (via cron-job.org)

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- Recharts (charts)

## Live Demo

**URL:** https://crypto-tracker-smoky-chi.vercel.app

## Getting Started (Local)

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run development server
npm run dev
```

## Environment Variables (.env.local)

```env
# Database
DATABASE_URL="postgresql://postgres:password@host:5432/crypto"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# APIs
ETHERSCAN_API_KEY="your-etherscan-key"

# WhatsApp (WuzAPI)
WUZAPI_URL="https://wapi.aiude.com.br"
WUZAPI_TOKEN="your-wuzapi-token"

# Cron Job (generate with: openssl rand -base64 32)
CRON_SECRET="your-cron-secret"
```

## Vercel Deployment

### 1. Environment Variables
Add these in Vercel → Project Settings → Environment Variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL (e.g., https://crypto-tracker-smoky-chi.vercel.app) |
| `ETHERSCAN_API_KEY` | Your Etherscan API key |
| `WUZAPI_URL` | `https://wapi.aiude.com.br` |
| `WUZAPI_TOKEN` | Your WuzAPI token |
| `CRON_SECRET` | Generate with: `openssl rand -base64 32` |

### 2. Deploy Steps
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `brazilmarcelo/crypto-tracker`
4. Click "Deploy"

## API Endpoints

### Public
- `POST /api/auth/register` - Create account
- `GET /api/auth/[...nextauth]` - Authentication

### Protected (requires auth)
- `GET /api/wallets` - List wallets with balance
- `POST /api/wallets` - Add wallet
- `GET /api/wallets/[id]/details` - Wallet details + stats + chart data
- `GET /api/transactions` - Transaction history (per wallet)
- `GET /api/transactions/all` - All transactions from all wallets
- `GET /api/alerts` - List alert rules
- `POST /api/alerts` - Create alert rule
- `PATCH /api/alerts/[id]` - Update alert
- `DELETE /api/alerts/[id]` - Delete alert
- `GET /api/user/profile` - User profile
- `PUT /api/user/phone` - Update phone number

### Cron (external service)
- `GET /api/cron/check?secret=CRON_SECRET` - Check transactions and send alerts

## Cron Job Setup

Use https://console.cron-job.org to trigger transaction checks:

**URL:**
```
https://crypto-tracker-smoky-chi.vercel.app/api/cron/check?secret=YOUR_CRON_SECRET
```

**Schedule:** Every 20 minutes (or 15 min, 30 min - choose available option)

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── wallets/           # Wallet management
│   │   ├── alerts/            # Alert rules
│   │   ├── notifications/     # Notification history
│   │   └── settings/          # User settings
│   ├── api/                   # API routes
│   │   ├── auth/              # NextAuth
│   │   ├── wallets/           # Wallet CRUD
│   │   ├── alerts/            # Alert CRUD
│   │   ├── transactions/      # Transaction queries
│   │   ├── user/              # User profile
│   │   └── cron/              # Cron job endpoint
│   ├── page.tsx               # Login/Signup
│   └── layout.tsx             # Root layout
├── components/                # React components
│   ├── ui/                    # UI primitives (Button, Card, Input)
│   ├── DashboardStats.tsx     # Dashboard stats
│   ├── WalletList.tsx         # Wallet list
│   ├── TransactionList.tsx    # Transaction list
│   └── Sidebar.tsx            # Navigation sidebar
├── lib/                       # Utilities
│   ├── auth.ts                # NextAuth config
│   ├── prisma.ts              # Prisma client
│   ├── etherscan.ts           # Etherscan API
│   ├── blockchain.ts          # Blockchain.com API
│   ├── whatsapp.ts            # WuzAPI integration
│   └── price.ts               # Price fetching
└── types/                     # TypeScript types
    └── next-auth.d.ts          # NextAuth types
```

## Database Schema

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  passwordHash  String
  phone         String?
  phoneVerified Boolean  @default(false)
  createdAt     DateTime @default(now())

  wallets       Wallet[]
  alertRules    AlertRule[]
  notifications Notification[]
}

model Wallet {
  id        String   @id @default(cuid())
  userId    String
  address   String
  chain     String          // ethereum, bitcoin
  label     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  transactions Transaction[]
  alertRules   AlertRule[]
}

model Transaction {
  id          String   @id @default(cuid())
  walletId    String
  hash        String
  type        String           // in, out
  value       String
  token       String           // ETH, BTC
  fee         String?
  timestamp   DateTime
  fromAddress String?
  toAddress   String?
}

model AlertRule {
  id            String   @id @default(cuid())
  userId        String
  walletId      String
  type          String           // in, out, both
  channel       String           // whatsapp, both
  threshold     String?
  thresholdType String   @default("eth")
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
}

model Notification {
  id            String   @id @default(cuid())
  userId        String
  alertRuleId   String?
  channel       String           // whatsapp
  message       String
  sentAt        DateTime @default(now())
}
```

## WhatsApp Integration

Uses WuzAPI (`https://wapi.aiude.com.br/chat/send/text`):

```json
// Request
{
  "Phone": "55...",
  "Body": "Transaction alert message"
}
// Header: token: WUZAPI_TOKEN
```

## GitHub Repository

https://github.com/brazilmarcelo/crypto-tracker

## Notes

- Cron job runs via external service (cron-job.org) since Vercel has serverless timeout limits
- Transaction data is fetched from Etherscan (ETH) and Blockchain.com (BTC) APIs
- Balances are fetched on-demand and cached in database during cron runs
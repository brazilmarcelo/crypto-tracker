# CryptoTracker

A web application to track cryptocurrency wallets (Ethereum + Bitcoin) with transaction history and WhatsApp alerts.

## Features

- **Authentication**: Login/signup with NextAuth.js (credentials)
- **Dashboard**: Overview of wallets, balances, recent transactions
- **Wallet Management**: Add, view, delete ETH/BTC wallets
- **Transaction History**: Real-time transactions from Etherscan and Blockchain.com
- **WhatsApp Alerts**: Transaction notifications via WuzAPI
- **Cron Job**: Automatic transaction checking every 20 minutes

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js
- Recharts (charts)

## Getting Started

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

```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
ETHERSCAN_API_KEY="..."
WUZAPI_URL="https://wapi.aiude.com.br"
WUZAPI_TOKEN="..."
```

## API Endpoints

- `GET /api/wallets` - List user wallets
- `POST /api/wallets` - Add wallet
- `GET /api/wallets/[id]/details` - Wallet details + stats + chart data
- `GET /api/transactions` - Transaction history
- `POST /api/auth/register` - Create account
- `GET /api/user/phone` - User phone settings

## Cron Job

```bash
# Run manually
npm run check:transactions

# Or configure crontab for every 20 minutes
*/20 * * * * cd /path/to/project && npm run check:transactions
```

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected pages
│   │   ├── dashboard/    # Main dashboard
│   │   ├── wallets/      # Wallet management
│   │   ├── alerts/      # Alert rules
│   │   └── settings/    # User settings
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities (auth, prisma, apis)
└── types/              # TypeScript types
```

## Database Schema

- **User**: id, email, passwordHash, phone, phoneVerified
- **Wallet**: id, address, chain (ethereum/bitcoin), label
- **Transaction**: hash, type, value, token, timestamp
- **AlertRule**: type (in/out/both), channel, threshold
- **Notification**: channel, message, sentAt

## WhatsApp Integration

Uses WuzAPI (`https://wapi.aiude.com.br/chat/send/text`):
```json
{
  "Phone": "55...",
  "Body": "Transaction alert message"
}
```
Header: `token: WUZAPI_TOKEN`
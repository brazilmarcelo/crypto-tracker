# Crypto Tracker MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build MVP of crypto wallet tracking app with authentication, wallet management, transaction listing, and basic alerts

**Architecture:** Next.js 14 fullstack with App Router, PostgreSQL for persistence, Redis for caching/queues, integration with Etherscan/Blockchair APIs

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, NextAuth.js, PostgreSQL (Vercel Postgres), Redis (Vercel KV)

---

## File Structure

```
/Users/marcelobrazil/dev/blockchain/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── wallets/route.ts
│   │   │   ├── transactions/route.ts
│   │   │   └── alerts/route.ts
│   │   ├── dashboard/page.tsx
│   │   ├── wallets/page.tsx
│   │   ├── wallets/[id]/page.tsx
│   │   ├── alerts/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing/login
│   ├── components/
│   │   ├── ui/                # Reusable components
│   │   ├── Dashboard.tsx
│   │   ├── WalletList.tsx
│   │   ├── TransactionList.tsx
│   │   └── AlertForm.tsx
│   ├── lib/
│   │   ├── prisma.ts          # DB client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── etherscan.ts       # API client
│   │   ├── blockchair.ts      # API client
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

### Task 1: Project Setup

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/package.json`
- Create: `/Users/marcelobrazil/dev/blockchain/tsconfig.json`
- Create: `/Users/marcelobrazil/dev/blockchain/next.config.js`
- Create: `/Users/marcelobrazil/dev/blockchain/tailwind.config.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/.env.local`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "crypto-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-auth": "^4.24.7",
    "@prisma/client": "^5.14.0",
    "@upstash/redis": "^1.28.4",
    "axios": "^1.6.8",
    "zod": "^3.23.8",
    "tailwind-merge": "^2.3.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.2.4",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.378.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "@types/node": "^20.12.12",
    "@types/react": "^18.3.2",
    "@types/react-dom": "^18.3.0",
    "prisma": "^5.14.0",
    "tailwindcss": "^3.4.3",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006D6A',
        'primary-light': '#008B85',
        accent: '#2FE6A6',
        warning: '#FFB545',
        dark: '#0F1724',
        'dark-light': '#1E293B',
        muted: '#E6EEF2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 5: Create .env.local**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crypto_tracker"

# Redis
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Auth
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# APIs
ETHERSCAN_API_KEY=""
BLOCKCHAIR_API_KEY=""

# Email (Resend)
RESEND_API_KEY=""
```

- [ ] **Step 6: Create postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: Package installation completes

- [ ] **Step 8: Commit**

```bash
git add package.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js .env.local
git commit -m "feat: initial Next.js project setup"
```

---

### Task 2: Database Schema (Prisma)

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/prisma/schema.prisma`

- [ ] **Step 1: Create Prisma schema**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String
  mfaSecret     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  wallets       Wallet[]
  alertRules    AlertRule[]
  notifications Notification[]
}

model Wallet {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  address     String
  chain       String   // ethereum, bitcoin
  label       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  transactions Transaction[]
  alertRules    AlertRule[]

  @@unique([userId, address, chain])
}

model Transaction {
  id            String   @id @default(cuid())
  walletId      String
  wallet        Wallet   @relation(fields: [walletId], references: [id], onDelete: Cascade)
  hash          String
  type          String   // in, out
  value         String   // wei/satoshi
  token         String   // ETH, BTC, USDT, etc.
  fee           String?
  timestamp     DateTime
  fromAddress   String?
  toAddress     String?
  createdAt     DateTime @default(now())

  notifications Notification[]

  @@unique([walletId, hash])
}

model AlertRule {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  walletId    String
  wallet      Wallet   @relation(fields: [walletId], references: [id], onDelete: Cascade)
  type        String   // in, out, both
  channel     String   // email, push
  threshold   String?  // minimum value in fiat
  token       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Notification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  alertRuleId String?
  alertRule   AlertRule? @relation(fields: [alertRuleId], references: [id], onDelete: SetNull)
  transactionId String?
  transaction Transaction? @relation(fields: [transactionId], references: [id], onDelete: SetNull)
  channel     String   // email, push
  message     String
  isRead      Boolean  @default(false)
  sentAt      DateTime @default(now())
  createdAt   DateTime @default(now())
}

model Label {
  id          String   @id @default(cuid())
  address     String
  chain       String
  name        String
  type        String   // exchange, wallet, contract
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@unique([address, chain])
}
```

- [ ] **Step 2: Generate Prisma client**

Run: `npx prisma generate`
Expected: Prisma client generated successfully

- [ ] **Step 3: Push database schema**

Run: `npx prisma db push`
Expected: Schema pushed to database

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma database schema"
```

---

### Task 3: Authentication Setup (NextAuth.js)

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/lib/prisma.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/lib/auth.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/api/auth/[...nextauth]/route.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/types/next-auth.d.ts`

- [ ] **Step 1: Create Prisma client singleton**

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 2: Create NextAuth configuration**

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
```

- [ ] **Step 3: Create NextAuth route handler**

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

- [ ] **Step 4: Create type definitions**

```typescript
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
```

- [ ] **Step 5: Add bcryptjs to dependencies**

Run: `npm install bcryptjs && npm install -D @types/bcryptjs`

- [ ] **Step 6: Commit**

```bash
git add src/lib/prisma.ts src/lib/auth.ts src/types/next-auth.d.ts src/app/api/auth/\[...nextauth\]/route.ts
git commit -m "feat: add NextAuth.js authentication setup"
```

---

### Task 4: Global Layout and UI Components

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/globals.css`
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/layout.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/ui/Button.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/ui/Input.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/ui/Card.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/Sidebar.tsx`

- [ ] **Step 1: Create global CSS with Tailwind**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary: 0 109 106;
    --accent: 47 230 166;
    --warning: 255 181 69;
  }
  
  body {
    @apply bg-dark text-white antialiased;
  }
}

@layer utilities {
  .font-mono {
    font-family: 'JetBrains Mono', monospace;
  }
}
```

- [ ] **Step 2: Create root layout**

```typescript
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crypto Tracker',
  description: 'Track your cryptocurrency wallets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create Providers component**

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

- [ ] **Step 4: Create Button component**

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'hover:translate-y-[-2px] hover:shadow-lg',
          'active:scale-[0.98]',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-light': variant === 'primary',
            'bg-dark-light text-white border border-muted': variant === 'secondary',
            'bg-transparent text-gray-400 hover:text-white': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

- [ ] **Step 5: Create Input component**

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
        )}
        <input
          ref={ref}
          className={twMerge(
            'w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
            'transition-colors',
            error && 'border-warning',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-warning">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

- [ ] **Step 6: Create Card component**

```typescript
import { HTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'bg-dark-light border border-muted rounded-xl p-5',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
```

- [ ] **Step 7: Create Sidebar component**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { LayoutDashboard, Wallet, Bell, Settings, Tag } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/wallets', label: 'Wallets', icon: Wallet },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/labels', label: 'Labels', icon: Tag },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-dark-light border-r border-muted min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary">CryptoTracker</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={twMerge(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ui/Button.tsx src/components/ui/Input.tsx src/components/ui/Card.tsx src/components/Sidebar.tsx src/components/Providers.tsx
git commit -m "feat: add global layout and UI components"
```

---

### Task 5: Landing Page with Login/Signup

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/page.tsx`
- Modify: `/Users/marcelobrazil/dev/blockchain/src/lib/auth.ts`

- [ ] **Step 1: Create login form component**

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setIsLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-warning/20 text-warning rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2: Create signup form component**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to register')
      }

      router.push('/?registered=true')
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-warning/20 text-warning rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        minLength={8}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create landing page**

```typescript
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { LoginForm } from '@/components/LoginForm'
import { SignupForm } from '@/components/SignupForm'

export default function HomePage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  return (
    <main className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">CryptoTracker</h1>
          <p className="text-gray-400">Track your cryptocurrency wallets</p>
        </div>

        <Card>
          {registered && (
            <div className="mb-4 p-3 bg-accent/20 text-accent rounded-lg text-sm">
              Account created! Please sign in.
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'login'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'login' ? <LoginForm /> : <SignupForm />}
        </Card>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Create register API endpoint**

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const passwordHash = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/api/auth/register/route.ts
git commit -m "feat: add landing page with login/signup"
```

---

### Task 6: Dashboard Page

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/dashboard/page.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/Dashboard.tsx`

- [ ] **Step 1: Create DashboardStats component**

```typescript
'use client'

import { Card } from '@/components/ui/Card'
import { Wallet, Bell, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  totalWallets: number
  recentAlerts: number
  lastActivity: string | null
}

export function DashboardStats({ totalWallets, recentAlerts, lastActivity }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="flex items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-lg">
          <Wallet className="text-primary" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Total Wallets</p>
          <p className="text-2xl font-bold">{totalWallets}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="p-3 bg-accent/20 rounded-lg">
          <Bell className="text-accent" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Recent Alerts</p>
          <p className="text-2xl font-bold">{recentAlerts}</p>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="p-3 bg-warning/20 rounded-lg">
          <TrendingUp className="text-warning" size={24} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">Last Activity</p>
          <p className="text-lg font-medium">{lastActivity || 'No activity'}</p>
        </div>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create Dashboard content component**

```typescript
'use client'

import { DashboardStats } from './DashboardStats'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/wallets">
          <Button>
            <Plus size={18} className="mr-2" />
            Add Wallet
          </Button>
        </Link>
      </div>

      <DashboardStats totalWallets={0} recentAlerts={0} lastActivity={null} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/wallets" className="block">
              <div className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-white/5 transition-colors">
                <span>Add a new wallet</span>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </Link>
            <Link href="/alerts" className="block">
              <div className="flex items-center justify-between p-3 bg-dark rounded-lg hover:bg-white/5 transition-colors">
                <span>Create an alert</span>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-400 text-center py-8">
            No recent activity. Add a wallet to start tracking!
          </p>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/page.tsx src/components/Dashboard.tsx
git commit -m "feat: add dashboard page"
```

---

### Task 7: Wallets Management (List and Add)

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/wallets/page.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/wallets/api/route.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/WalletList.tsx`

- [ ] **Step 1: Create WalletCard component**

```typescript
'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'

interface WalletCardProps {
  id: string
  label: string | null
  address: string
  chain: string
  onDelete?: (id: string) => void
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletCard({ id, label, address, chain, onDelete }: WalletCardProps) {
  const explorerUrl = chain === 'ethereum' 
    ? `https://etherscan.io/address/${address}`
    : `https://blockchain.info/address/${address}`

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="font-medium">{label || 'Unnamed Wallet'}</p>
        <p className="text-sm text-gray-400 font-mono">{shortenAddress(address)}</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
          {chain}
        </span>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(address)}>
          <Copy size={16} />
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
          </a>
        </Button>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
            <Trash2 size={16} className="text-warning" />
          </Button>
        )}
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Create WalletsPage**

```typescript
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { WalletCard } from '@/components/WalletList'

interface Wallet {
  id: string
  address: string
  chain: string
  label: string | null
}

export default function WalletsPage() {
  const { data: session } = useSession()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWallet, setNewWallet] = useState({ address: '', chain: 'ethereum', label: '' })
  const [isLoading, setIsLoading] = useState(false)

  const fetchWallets = async () => {
    if (!session?.user?.id) return
    const res = await fetch('/api/wallets')
    if (res.ok) {
      const data = await res.json()
      setWallets(data)
    }
  }

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const res = await fetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWallet),
    })

    if (res.ok) {
      setShowAddForm(false)
      setNewWallet({ address: '', chain: 'ethereum', label: '' })
      fetchWallets()
    }
    setIsLoading(false)
  }

  const handleDeleteWallet = async (id: string) => {
    await fetch(`/api/wallets/${id}`, { method: 'DELETE' })
    fetchWallets()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Wallets</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Wallet'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <form onSubmit={handleAddWallet} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Wallet Address"
                value={newWallet.address}
                onChange={(e) => setNewWallet({ ...newWallet, address: e.target.value })}
                placeholder="0x..."
                required
              />
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Blockchain</label>
                <select
                  value={newWallet.chain}
                  onChange={(e) => setNewWallet({ ...newWallet, chain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="bitcoin">Bitcoin</option>
                </select>
              </div>
            </div>
            <Input
              label="Label (optional)"
              value={newWallet.label}
              onChange={(e) => setNewWallet({ ...newWallet, label: e.target.value })}
              placeholder="My main wallet"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Wallet'}
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {wallets.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No wallets yet. Add your first wallet to start tracking!</p>
          </Card>
        ) : (
          wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              {...wallet}
              onDelete={handleDeleteWallet}
            />
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create Wallets API (GET/POST)**

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(wallets)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { address, chain, label } = await req.json()

  if (!address || !chain) {
    return NextResponse.json({ error: 'Address and chain are required' }, { status: 400 })
  }

  const wallet = await prisma.wallet.create({
    data: {
      userId: session.user.id,
      address: address.toLowerCase(),
      chain,
      label,
    },
  })

  return NextResponse.json(wallet)
}
```

- [ ] **Step 4: Create DELETE wallet API**

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.wallet.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/wallets/page.tsx src/app/api/wallets/route.ts src/components/WalletList.tsx
git commit -m "feat: add wallets management page"
```

---

### Task 8: Transaction List and Wallet Detail

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/wallets/[id]/page.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/components/TransactionList.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/api/transactions/route.ts`

- [ ] **Step 1: Create TransactionRow component**

```typescript
'use client'

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react'

interface Transaction {
  id: string
  hash: string
  type: 'in' | 'out'
  value: string
  token: string
  timestamp: string
  fromAddress?: string
  toAddress?: string
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function TransactionRow({ tx }: { tx: Transaction }) {
  const isIn = tx.type === 'in'
  const explorerUrl = `https://etherscan.io/tx/${tx.hash}`

  return (
    <div className="flex items-center justify-between p-4 bg-dark rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isIn ? 'bg-accent/20' : 'bg-warning/20'}`}>
          {isIn ? (
            <ArrowDownLeft className="text-accent" size={20} />
          ) : (
            <ArrowUpRight className="text-warning" size={20} />
          )}
        </div>
        <div>
          <p className="font-medium capitalize">{tx.type === 'in' ? 'Received' : 'Sent'}</p>
          <p className="text-sm text-gray-400 font-mono">{shortenHash(tx.hash)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono">
          {isIn ? '+' : '-'}{tx.value} {tx.token}
        </p>
        <p className="text-sm text-gray-400">
          {new Date(tx.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create WalletDetailPage**

```typescript
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TransactionRow } from '@/components/TransactionList'
import { Copy, ExternalLink, Download } from 'lucide-react'

export default function WalletDetailPage() {
  const params = useParams()
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')

  const filteredTxs = transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{wallet?.label || 'Wallet'}</h1>
            <p className="text-gray-400 font-mono text-sm">{wallet?.address}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Balance</p>
            <p className="text-2xl font-bold">Loading...</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(wallet?.address || '')}>
              <Copy size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink size={16} />
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 mb-4">
        {(['all', 'in', 'out'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-dark-light text-gray-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'in' ? 'Received' : 'Sent'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No transactions found. They will appear here once detected.</p>
          </Card>
        ) : (
          filteredTxs.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create transactions API**

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const walletId = searchParams.get('walletId')

  if (!walletId) {
    return NextResponse.json({ error: 'Wallet ID required' }, { status: 400 })
  }

  const transactions = await prisma.transaction.findMany({
    where: { walletId },
    orderBy: { timestamp: 'desc' },
    take: 100,
  })

  return NextResponse.json(transactions)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/wallets/\[id\]/page.tsx src/app/api/transactions/route.ts src/components/TransactionList.tsx
git commit -m "feat: add wallet detail and transaction list"
```

---

### Task 9: Alerts Management

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/alerts/page.tsx`
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/api/alerts/route.ts`

- [ ] **Step 1: Create AlertsPage**

```typescript
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Bell, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

interface AlertRule {
  id: string
  type: string
  channel: string
  threshold: string | null
  isActive: boolean
  wallet: { label: string; address: string }
}

export default function AlertsPage() {
  const { data: session } = useSession()
  const [alerts, setAlerts] = useState<AlertRule[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    walletId: '',
    type: 'both',
    channel: 'email',
    threshold: '',
  })

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    setShowForm(false)
    fetchAlerts()
  }

  const fetchAlerts = async () => {
    const res = await fetch('/api/alerts')
    if (res.ok) setAlerts(await res.json())
  }

  const toggleAlert = async (id: string, isActive: boolean) => {
    await fetch(`/api/alerts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchAlerts()
  }

  const deleteAlert = async (id: string) => {
    await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
    fetchAlerts()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Alerts</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Alert'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreateAlert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Wallet</label>
                <select
                  value={formData.walletId}
                  onChange={(e) => setFormData({ ...formData, walletId: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                  required
                >
                  <option value="">Select wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="both">Both (In & Out)</option>
                  <option value="in">Received</option>
                  <option value="out">Sent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  className="w-full px-4 py-2.5 bg-dark-light border border-muted rounded-lg text-white"
                >
                  <option value="email">Email</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
              <Input
                label="Threshold (USD) - optional"
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                placeholder="100"
              />
            </div>
            <Button type="submit">Create Alert</Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No alerts configured. Create one to get notified!</p>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bell size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{alert.wallet.label || 'Wallet Alert'}</p>
                  <p className="text-sm text-gray-400">
                    {alert.type === 'both' ? 'Any transaction' : alert.type === 'in' ? 'Received' : 'Sent'} 
                    {' via '}{alert.channel}
                    {alert.threshold && ` over $${alert.threshold}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleAlert(alert.id, alert.isActive)}>
                  {alert.isActive ? (
                    <ToggleRight size={24} className="text-accent" />
                  ) : (
                    <ToggleLeft size={24} className="text-gray-500" />
                  )}
                </button>
                <button onClick={() => deleteAlert(alert.id)}>
                  <Trash2 size={20} className="text-warning" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create Alerts API**

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const alerts = await prisma.alertRule.findMany({
    where: { userId: session.user.id },
    include: { wallet: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(alerts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { walletId, type, channel, threshold } = await req.json()

  if (!walletId || !type || !channel) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const alert = await prisma.alertRule.create({
    data: {
      userId: session.user.id,
      walletId,
      type,
      channel,
      threshold,
    },
  })

  return NextResponse.json(alert)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/alerts/page.tsx src/app/api/alerts/route.ts
git commit -m "feat: add alerts management page"
```

---

### Task 10: Notifications Center

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/notifications/page.tsx`
- Modify: `/Users/marcelobrazil/dev/blockchain/src/app/api/alerts/route.ts`

- [ ] **Step 1: Create NotificationsPage**

```typescript
'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Bell, Check, Trash2 } from 'lucide-react'

interface Notification {
  id: string
  message: string
  channel: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    return !n.isRead
  })

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-dark-light text-gray-400'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm ${
              filter === 'unread' ? 'bg-primary text-white' : 'bg-dark-light text-gray-400'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-400">No notifications yet.</p>
          </Card>
        ) : (
          filtered.map((notif) => (
            <Card
              key={notif.id}
              className={`flex items-center justify-between ${!notif.isRead ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Bell size={20} className="text-primary" />
                </div>
                <div>
                  <p className={notif.isRead ? 'text-gray-400' : 'text-white'}>
                    {notif.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!notif.isRead && (
                  <button onClick={() => markAsRead(notif.id)} className="p-2 hover:bg-white/5 rounded-lg">
                    <Check size={18} className="text-accent" />
                  </button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/notifications/page.tsx
git commit -m "feat: add notifications center page"
```

---

### Task 11: Settings Page

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/app/settings/page.tsx`

- [ ] **Step 1: Create SettingsPage**

```typescript
'use client'

import { useSession, signOut } from 'next-auth/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Lock, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <User size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Name"
              defaultValue={session?.user?.name || ''}
              placeholder="Your name"
            />
            <Input
              label="Email"
              defaultValue={session?.user?.email || ''}
              disabled
            />
            <Button variant="secondary">Save Changes</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark rounded-lg">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-400" />
                <span>Two-Factor Authentication</span>
              </div>
              <Button variant="secondary" size="sm">Enable</Button>
            </div>
            <Button variant="secondary">Change Password</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <span>Push notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-3 bg-dark rounded-lg cursor-pointer">
              <span>Hide values (privacy mode)</span>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-warning">Danger Zone</h2>
          <Button
            variant="secondary"
            className="border-warning text-warning hover:bg-warning/20"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            Sign Out
          </Button>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/settings/page.tsx
git commit -m "feat: add settings page"
```

---

### Task 12: Blockchain API Integrations

**Files:**
- Create: `/Users/marcelobrazil/dev/blockchain/src/lib/etherscan.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/lib/blockchair.ts`
- Create: `/Users/marcelobrazil/dev/blockchain/src/lib/price.ts`

- [ ] **Step 1: Create Etherscan client**

```typescript
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api'

interface EtherscanTx {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  timestamp: string
  isError: string
}

export async function getEthereumTransactions(address: string): Promise<EtherscanTx[]> {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY,
      },
    })

    if (response.data.status === '1') {
      return response.data.result
    }
    return []
  } catch (error) {
    console.error('Etherscan API error:', error)
    return []
  }
}

export async function getEthereumBalance(address: string): Promise<string> {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY,
      },
    })

    if (response.data.status === '1') {
      return response.data.result
    }
    return '0'
  } catch (error) {
    console.error('Etherscan balance error:', error)
    return '0'
  }
}

export function normalizeEtherscanTx(tx: EtherscanTx) {
  const isIn = tx.to.toLowerCase() === tx.from.toLowerCase() 
    ? false 
    : tx.to.toLowerCase() !== tx.from.toLowerCase()

  return {
    hash: tx.hash,
    type: isIn ? 'in' : 'out',
    value: (parseInt(tx.value) / 1e18).toString(),
    token: 'ETH',
    fee: ((parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18).toString(),
    timestamp: new Date(parseInt(tx.timestamp) * 1000).toISOString(),
    fromAddress: tx.from,
    toAddress: tx.to,
  }
}
```

- [ ] **Step 2: Create Blockchair client**

```typescript
import axios from 'axios'

const BLOCKCHAIR_API_KEY = process.env.BLOCKCHAIR_API_KEY || ''

interface BlockchairTx {
  hash: string
  time: number
  result: number
  fee: number
  inputs: { recipient: string }[]
  outputs: { recipient: string; value: number }[]
}

export async function getBitcoinTransactions(address: string): Promise<BlockchairTx[]> {
  try {
    const response = await axios.get(
      `https://api.blockchair.com/bitcoin/transactions`,
      {
        params: {
          address,
          limit: 100,
          key: BLOCKCHAIR_API_KEY,
        },
      }
    )

    return response.data?.data || []
  } catch (error) {
    console.error('Blockchair API error:', error)
    return []
  }
}

export async function getBitcoinBalance(address: string): Promise<number> {
  try {
    const response = await axios.get(
      `https://api.blockchair.com/bitcoin/address`,
      {
        params: {
          addresses: address,
          key: BLOCKCHAIR_API_KEY,
        },
      }
    )

    const data = response.data?.data?.[address]
    return data?.address?.balance || 0
  } catch (error) {
    console.error('Blockchair balance error:', error)
    return 0
  }
}

export function normalizeBlockchairTx(tx: BlockchairTx, address: string) {
  const inputAddresses = tx.inputs?.map(i => i.recipient) || []
  const outputAddresses = tx.outputs?.map(o => o.recipient) || []
  
  const isIn = outputAddresses.includes(address)

  return {
    hash: tx.hash,
    type: isIn ? 'in' : 'out',
    value: (tx.result / 1e8).toString(),
    token: 'BTC',
    fee: (tx.fee / 1e8).toString(),
    timestamp: new Date(tx.time * 1000).toISOString(),
    fromAddress: isIn ? inputAddresses[0] : address,
    toAddress: isIn ? address : outputAddresses[0],
  }
}
```

- [ ] **Step 3: Create price service**

```typescript
import axios from 'axios'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export async function getTokenPrice(tokenId: string, vsCurrency: string = 'usd'): Promise<number> {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: tokenId,
        vs_currencies: vsCurrency,
      },
    })

    return response.data?.[tokenId]?.[vsCurrency] || 0
  } catch (error) {
    console.error('CoinGecko API error:', error)
    return 0
  }
}

export async function getMultiplePrices(tokenIds: string[]): Promise<Record<string, number>> {
  try {
    const response = await axios.get(`${COINGECKO_API}/simple/price`, {
      params: {
        ids: tokenIds.join(','),
        vs_currencies: 'usd',
      },
    })

    const prices: Record<string, number> = {}
    for (const token of tokenIds) {
      prices[token] = response.data?.[token]?.usd || 0
    }
    return prices
  } catch (error) {
    console.error('CoinGecko API error:', error)
    return {}
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/etherscan.ts src/lib/blockchair.ts src/lib/price.ts
git commit -m "feat: add blockchain API integrations"
```

---

### Task 13: Run Build and Verify

- [ ] **Step 1: Run build**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete MVP implementation"
```

---

## Execution Choice

**Plan complete and saved to `docs/superpowers/plans/2026-04-18-crypto-tracker-mvp.md`. Two execution options:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
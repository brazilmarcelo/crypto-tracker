import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEthereumTransactions, normalizeEtherscanTx } from '@/lib/etherscan'
import { getBitcoinTransactions, normalizeBlockchainTx } from '@/lib/blockchain'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

const APP_URL = process.env.NEXTAUTH_URL || 'https://crypto-tracker.vercel.app'

function createTransactionAlertMessage(type: string, value: string, token: string, label: string, address: string, url: string) {
  const direction = type === 'in' ? 'received' : 'sent'
  return `🔔 *CryptoTracker Alert*\n\nYou ${direction} ${value} ${token}\n\nWallet: ${label}\n${address.slice(0, 6)}...${address.slice(-4)}\n\nView: ${url}/wallets`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (body.secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: { phone: { not: null } },
      include: {
        wallets: {
          where: { isActive: true },
          include: {
            alertRules: { where: { isActive: true } }
          }
        }
      }
    })

    let totalChecked = 0
    let totalAlerts = 0

    for (const user of users) {
      if (!user.phone || user.phone.length < 10) continue

      for (const wallet of user.wallets) {
        const activeAlerts = wallet.alertRules.filter((a: any) => 
          a.channel === 'whatsapp' || a.channel === 'both'
        )
        
        if (activeAlerts.length === 0) continue

        let txs: any[] = []
        
        if (wallet.chain === 'ethereum') {
          const apiTxs = await getEthereumTransactions(wallet.address)
          txs = apiTxs.map(normalizeEtherscanTx)
        } else if (wallet.chain === 'bitcoin') {
          const apiTxs = await getBitcoinTransactions(wallet.address)
          txs = apiTxs.map(tx => normalizeBlockchainTx(tx, wallet.address))
        }

        const lastTxInDb = await prisma.transaction.findFirst({
          where: { walletId: wallet.id },
          orderBy: { timestamp: 'desc' }
        })

        const newTxs = lastTxInDb 
          ? txs.filter((tx: any) => new Date(tx.timestamp) > new Date(lastTxInDb.timestamp))
          : txs.slice(0, 5)

        if (newTxs.length === 0) continue

        for (const tx of newTxs) {
          const shouldAlert = activeAlerts.some((alert: any) => {
            if (alert.type === 'both' || alert.type === tx.type) {
              if (alert.threshold) {
                return parseFloat(tx.value) >= parseFloat(alert.threshold)
              }
              return true
            }
            return false
          })

          if (shouldAlert) {
            const message = createTransactionAlertMessage(
              tx.type, tx.value, tx.token,
              wallet.label || 'Wallet', wallet.address, APP_URL
            )

            const sent = await sendWhatsAppMessage({ to: user.phone, body: message })
            
            if (sent) {
              await prisma.notification.create({
                data: {
                  userId: user.id,
                  alertRuleId: activeAlerts[0].id,
                  channel: 'whatsapp',
                  message,
                  sentAt: new Date()
                }
              })
              totalAlerts++
            }
          }
        }

        if (txs.length > 0) {
          for (const tx of txs) {
            const existing = await prisma.transaction.findFirst({
              where: { walletId: wallet.id, hash: tx.hash }
            })
            
            if (!existing) {
              await prisma.transaction.create({
                data: { 
                  ...tx, 
                  walletId: wallet.id, 
                  timestamp: new Date(tx.timestamp) 
                }
              })
            }
          }
        }

        totalChecked++
      }
    }

    return NextResponse.json({ 
      success: true, 
      checked: totalChecked, 
      alerts: totalAlerts 
    })

  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return POST(req)
}
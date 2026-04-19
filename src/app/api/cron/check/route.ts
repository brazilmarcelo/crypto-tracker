import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getEthereumTransactions, normalizeEtherscanTx } from '@/lib/etherscan'
import { getBitcoinTransactions, normalizeBlockchainTx } from '@/lib/blockchain'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

const APP_URL = process.env.NEXTAUTH_URL || 'https://crypto-tracker-smoky-chi.vercel.app'

function createTransactionAlertMessage(type: string, value: string, token: string, label: string, address: string, url: string) {
  const direction = type === 'in' ? 'received' : 'sent'
  return `🔔 *CryptoTracker Alert*\n\nYou ${direction} ${value} ${token}\n\nWallet: ${label}\n${address.slice(0, 6)}...${address.slice(-4)}\n\nView: ${url}/wallets`
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const users = await prisma.user.findMany({
      where: { 
        phone: { not: null },
        phoneVerified: false
      },
      include: {
        wallets: {
          where: { isActive: true },
          include: {
            alertRules: { where: { isActive: true } }
          }
        }
      }
    })

    console.log('Users found with phoneVerified:', users.length)
    console.log('Sample user:', users[0] ? { id: users[0].id, phone: users[0].phone, wallets: users[0].wallets.length } : 'none')

    let totalChecked = 0
    let totalAlerts = 0

    for (const user of users) {
      console.log('Processing user:', user.id, 'wallets:', user.wallets.length)
      
      if (!user.phone || user.phone.length < 10) continue

      for (const wallet of user.wallets) {
        console.log('Wallet:', wallet.address, 'alerts:', wallet.alertRules.length)
        
        const activeAlerts = wallet.alertRules.filter((a: any) => 
          a.channel === 'whatsapp' || a.channel === 'both'
        )
        
        if (activeAlerts.length === 0) {
          totalChecked++
          continue
        }

        let txs: any[] = []
        
        try {
          if (wallet.chain === 'ethereum') {
            const apiTxs = await getEthereumTransactions(wallet.address)
            txs = apiTxs.map(normalizeEtherscanTx)
          } else if (wallet.chain === 'bitcoin') {
            const apiTxs = await getBitcoinTransactions(wallet.address)
            txs = apiTxs.map(tx => normalizeBlockchainTx(tx, wallet.address))
          }
        } catch (e) {
          console.error(`Error fetching txs for ${wallet.address}:`, e)
        }

        const lastTxInDb = await prisma.transaction.findFirst({
          where: { walletId: wallet.id },
          orderBy: { timestamp: 'desc' }
        })

        const newTxs = lastTxInDb 
          ? txs.filter((tx: any) => new Date(tx.timestamp) > new Date(lastTxInDb.timestamp))
          : txs.slice(0, 5)

        console.log(`Wallet ${wallet.address}: ${txs.length} txs in API, ${newTxs.length} new txs, lastTxInDb: ${lastTxInDb?.timestamp || 'none'}`)

        if (newTxs.length === 0) {
          totalChecked++
          continue
        }

        for (const tx of newTxs) {
          console.log(`  New tx: ${tx.type} ${tx.value} ${tx.token}`)
          
          const shouldAlert = activeAlerts.some((alert: any) => {
            if (alert.type === 'both' || alert.type === tx.type) {
              if (alert.threshold) {
                return parseFloat(tx.value) >= parseFloat(alert.threshold)
              }
              return true
            }
            return false
          })

          console.log(`  Alert match: ${shouldAlert}, activeAlerts: ${activeAlerts.length}`)

          if (shouldAlert) {
            const message = createTransactionAlertMessage(
              tx.type, tx.value, tx.token,
              wallet.label || 'Wallet', wallet.address, APP_URL
            )

            console.log(`  Sending WhatsApp to ${user.phone}:`, message.substring(0, 50) + '...')
            
            try {
              const sent = await sendWhatsAppMessage({ to: user.phone, body: message })
              console.log(`  WhatsApp send result: ${sent}`)
              
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
            } catch (e) {
              console.error('Error sending WhatsApp:', e)
            }
          }
        }

        if (txs.length > 0) {
          for (const tx of txs) {
            try {
              const existing = await prisma.transaction.findFirst({
                where: { walletId: wallet.id, hash: tx.hash }
              })
              
              if (!existing) {
                await prisma.transaction.create({
                  data: { 
                    walletId: wallet.id,
                    hash: tx.hash,
                    type: tx.type,
                    value: tx.value,
                    token: tx.token,
                    fee: tx.fee || '0',
                    timestamp: new Date(tx.timestamp),
                    fromAddress: tx.fromAddress || null,
                    toAddress: tx.toAddress || null
                  }
                })
              }
            } catch (e) {
              console.error('Error saving tx:', e)
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
import { PrismaClient } from '@prisma/client'
import { getEthereumTransactions, normalizeEtherscanTx, EtherscanTx } from '../src/lib/etherscan'
import { getBitcoinTransactions, normalizeBlockchainTx } from '../src/lib/blockchain'
import { sendWhatsAppMessage, createTransactionAlertMessage } from '../src/lib/whatsapp'

const prisma = new PrismaClient()

const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

async function checkWallets() {
  console.log('🔄 Checking wallets for new transactions...')

  const wallets = await prisma.wallet.findMany({
    where: { isActive: true },
    include: {
      user: {
        include: {
          alertRules: {
            where: { isActive: true },
          },
        },
      },
    },
  })

  console.log(`Found ${wallets.length} wallets to check`)

  for (const wallet of wallets) {
    try {
      console.log(`Checking wallet: ${wallet.address} (${wallet.chain})`)

      let newTxs: any[] = []

      if (wallet.chain === 'ethereum') {
        const txs: EtherscanTx[] = await getEthereumTransactions(wallet.address)
        newTxs = txs.map(tx => normalizeEtherscanTx(tx, wallet.address))
      } else if (wallet.chain === 'bitcoin') {
        const txs = await getBitcoinTransactions(wallet.address)
        newTxs = txs.map(tx => normalizeBlockchainTx(tx, wallet.address))
      }

      if (newTxs.length === 0) {
        console.log(`No transactions found for ${wallet.address}`)
        continue
      }

      const existingHashes = await prisma.transaction.findMany({
        where: { walletId: wallet.id },
        select: { hash: true },
      })
      const existingHashSet = new Set(existingHashes.map(t => t.hash))

      const trulyNewTxs = newTxs.filter(tx => !existingHashSet.has(tx.hash))

      if (trulyNewTxs.length > 0) {
        console.log(`Found ${trulyNewTxs.length} new transactions!`)

        await prisma.transaction.createMany({
          data: trulyNewTxs.map(tx => ({
            walletId: wallet.id,
            hash: tx.hash,
            type: tx.type,
            value: tx.value,
            token: tx.token,
            fee: tx.fee,
            timestamp: new Date(tx.timestamp),
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
          })),
          skipDuplicates: true,
        })

        for (const tx of trulyNewTxs) {
          await sendAlert(wallet, tx)
        }
      }
    } catch (error) {
      console.error(`Error checking wallet ${wallet.address}:`, error)
    }
  }

  console.log('✅ Check complete')
  await prisma.$disconnect()
}

async function sendAlert(wallet: any, tx: any) {
  const user = wallet.user

  if (!user.phone) {
    console.log(`User ${user.id} has no phone number, skipping WhatsApp alert`)
    return
  }

  const activeAlerts = user.alertRules.filter((alert: any) => {
    if (alert.walletId !== wallet.id) return false
    if (alert.type !== 'both' && alert.type !== tx.type) return false
    
    if (alert.threshold) {
      const threshold = parseFloat(alert.threshold)
      if (parseFloat(tx.value) < threshold) return false
    }
    
    return true
  })

  if (activeAlerts.length === 0) {
    console.log(`No active alerts for wallet ${wallet.id}`)
    return
  }

  const shouldNotify = activeAlerts.some((alert: any) => 
    alert.channel === 'whatsapp' || alert.channel === 'both'
  )

  if (!shouldNotify) {
    return
  }

  const message = createTransactionAlertMessage(
    tx.type,
    tx.value,
    tx.token,
    wallet.label || 'Wallet',
    wallet.address,
    APP_URL
  )

  console.log(`Sending WhatsApp alert to ${user.phone}...`)
  
  const sent = await sendWhatsAppMessage({
    to: user.phone,
    body: message,
  })

  if (sent) {
    console.log(`✅ WhatsApp alert sent successfully!`)
    
    const firstAlertRule = activeAlerts[0]
    
    await prisma.notification.create({
      data: {
        userId: user.id,
        alertRuleId: firstAlertRule.id,
        channel: 'whatsapp',
        message,
        sentAt: new Date(),
      },
    })
  } else {
    console.log(`❌ Failed to send WhatsApp alert`)
  }
}

checkWallets()
  .catch(console.error)
  .finally(() => process.exit(0))
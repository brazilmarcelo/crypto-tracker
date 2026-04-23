import { NextResponse } from 'next/server'
import { getEthereumTransactions, normalizeEtherscanTx } from '@/lib/etherscan'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chainId = searchParams.get('chainId') || '1'
    const afterTimestamp = searchParams.get('afterTimestamp') // Unix timestamp in seconds

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const txs = await getEthereumTransactions(address, chainId)
    
    // Normalize transactions and keep only outgoing (where address is the sender)
    const addressLower = address.toLowerCase()
    let outgoingTxs = txs
      .map(normalizeEtherscanTx)
      .filter((tx) => tx.fromAddress?.toLowerCase() === addressLower)
      
    // If we only want to trace funds that moved AFTER a specific date
    if (afterTimestamp) {
      const minDate = parseInt(afterTimestamp)
      outgoingTxs = outgoingTxs.filter(tx => {
        const txDate = new Date(tx.timestamp).getTime() / 1000
        return txDate >= minDate
      })
    }
    
    // Sort from newest to oldest
    outgoingTxs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // Limit to reasonable number of out nodes per branch for a visual tracer
    outgoingTxs = outgoingTxs.slice(0, 100)

    return NextResponse.json({
      address,
      outgoingTxs,
    })
  } catch (error) {
    console.error('Tracer API Error:', error)
    return NextResponse.json(
      { error: 'Failed to trace address' },
      { status: 500 }
    )
  }
}

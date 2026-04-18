import axios from 'axios'

const BLOCKCHAIN_BASE_URL = 'https://blockchain.info'

interface BlockchainAddressTx {
  hash: string
  time: number
  result: number
  fee: number
  inputs: { prev_out: { addr: string; value: number }[] }[]
  out: { addr: string; value: number }[]
}

export async function getBitcoinTransactions(address: string, limit: number = 50): Promise<BlockchainAddressTx[]> {
  try {
    const response = await axios.get(`${BLOCKCHAIN_BASE_URL}/rawaddr/${address}`, {
      params: { limit },
    })
    return response.data.txs || []
  } catch (error) {
    console.error('Blockchain.com API error:', error)
    return []
  }
}

export async function getBitcoinBalance(address: string): Promise<number> {
  try {
    const response = await axios.get(`${BLOCKCHAIN_BASE_URL}/balance`, {
      params: { active: address },
    })
    const data = response.data[address]
    return data?.final_balance || 0
  } catch (error) {
    console.error('Blockchain.com balance error:', error)
    return 0
  }
}

export function normalizeBlockchainTx(tx: BlockchainAddressTx, address: string) {
  const inputs = tx.inputs?.flatMap(i => i.prev_out || []) || []
  const outputs = tx.out || []
  
  const receivedValue = outputs
    .filter(o => o.addr === address)
    .reduce((sum, o) => sum + o.value, 0)
  
  const sentValue = inputs
    .filter(i => i.addr === address)
    .reduce((sum, i) => sum + i.value, 0)
  
  const isIn = receivedValue > sentValue
  const netValue = isIn ? receivedValue - sentValue : sentValue - receivedValue

  return {
    hash: tx.hash,
    type: isIn ? 'in' : 'out',
    value: (netValue / 1e8).toString(),
    token: 'BTC',
    fee: (tx.fee / 1e8).toString(),
    timestamp: new Date(tx.time * 1000).toISOString(),
    fromAddress: isIn ? inputs[0]?.addr : address,
    toAddress: isIn ? address : outputs[0]?.addr,
  }
}
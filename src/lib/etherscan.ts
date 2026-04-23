import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api'

const CHAIN_IDS: Record<string, string> = {
  ethereum: '1',
  mainnet: '1',
  sepolia: '11155111',
  goerli: '5',
}

export interface EtherscanTx {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  gas: string
  timeStamp: string
  isError: string
  nonce: string
  blockNumber: string
  transactionIndex: string
  input: string
  cumulativeGasUsed: string
  confirmations: string
  contractAddress: string
}

export async function getEthereumTransactions(address: string, chainId: string = '1'): Promise<EtherscanTx[]> {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        apikey: ETHERSCAN_API_KEY,
        chainid: chainId,
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: 'desc',
      },
    })

    if (response.data.status === '1' && Array.isArray(response.data.result)) {
      return response.data.result
    }
    console.log('Etherscan response:', response.data)
    return []
  } catch (error) {
    console.error('Etherscan API error:', error)
    return []
  }
}

export async function getEthereumBalance(address: string, chainId: string = '1'): Promise<string> {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        apikey: ETHERSCAN_API_KEY,
        chainid: chainId,
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
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

export function normalizeEtherscanTx(tx: EtherscanTx, trackedAddress?: string) {
  const fromLower = tx.from?.toLowerCase() || ''
  const toLower = tx.to?.toLowerCase() || ''
  
  let isIn = true
  if (trackedAddress) {
    const trackedLower = trackedAddress.toLowerCase()
    // If the sender is the tracked address, it is an OUTBOUND transaction (isIn = false)
    isIn = fromLower !== trackedLower
  } else {
    // Fallback logic if trackedAddress is not provided
    isIn = toLower !== fromLower && toLower !== ''
  }

  return {
    hash: tx.hash,
    type: isIn ? 'in' : 'out',
    value: (parseInt(tx.value || '0') / 1e18).toString(),
    token: 'ETH',
    fee: tx.gasUsed && tx.gasPrice 
      ? (parseInt(tx.gasUsed) * parseInt(tx.gasPrice) / 1e18).toString()
      : '0',
    timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
    fromAddress: tx.from,
    toAddress: tx.to,
    blockNumber: tx.blockNumber,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    gas: tx.gas,
    nonce: tx.nonce,
    transactionIndex: tx.transactionIndex,
    input: tx.input,
    cumulativeGasUsed: tx.cumulativeGasUsed,
    confirmations: tx.confirmations,
    contractAddress: tx.contractAddress,
    isError: tx.isError,
  }
}
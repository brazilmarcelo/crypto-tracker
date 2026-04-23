export type EntityType = 'exchange' | 'contract' | 'private' | 'cold'

export interface EntityLabel {
  name: string
  type: EntityType
  tags?: string[]
}

// A static map of known prominent exchange hot wallets for demonstration and MVP purposes.
// In a full production system, this would be backed by a large database or a provider like Nansen.
const KNOWN_ENTITIES: Record<string, EntityLabel> = {
  // Binance
  '0x28c6c06298d514db089934071355e22af16148c9': { name: 'Binance (14)', type: 'exchange' },
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': { name: 'Binance (8)', type: 'exchange' },
  '0xdfd5293d8e347dfe59e90efd55b2956a1343963d': { name: 'Binance (15)', type: 'exchange' },
  '0x5a52e96bacd65b162377f7c4bc11dfde432ae385': { name: 'Binance (Cold Wallet)', type: 'exchange', tags: ['cold'] },
  '0x4e9ce36e442e55ecd9025b9a6e0d88485d628a67': { name: 'Binance (Cold Wallet 2)', type: 'exchange', tags: ['cold'] },

  // Coinbase
  '0x503828976d22510aad0201ac7ec88293211d23da': { name: 'Coinbase (1)', type: 'exchange' },
  '0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740': { name: 'Coinbase (2)', type: 'exchange' },
  '0x71660c4005ba85c37ccec55d0c4493e66fe775d3': { name: 'Coinbase (3)', type: 'exchange' },
  '0xaa7a9ca87d3694b5755f213b5d04094b8d0f0a6f': { name: 'Coinbase (Cold Wallet)', type: 'exchange', tags: ['cold'] },

  // Kraken
  '0x2910543af39aba0cd09dbb2d50200b3e800a63d2': { name: 'Kraken (1)', type: 'exchange' },
  '0xe853c56864a2ebe4576a807d26fdc4a0ada51919': { name: 'Kraken (2)', type: 'exchange' },
  
  // Kucoin
  '0x3cecc277fba530669d06bde0d9ce257f884260aa': { name: 'KuCoin', type: 'exchange' },
  
  // Tether Vault
  '0x028bfdfeb82110c7bf36f9cc03328ce786d3b45a': { name: 'Tether Treasury', type: 'contract' },
  
  // Example stablecoin contracts
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { name: 'Tether (USDT)', type: 'contract' },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': { name: 'USDC', type: 'contract' }
}

/**
 * Identifies the type of an address. Returns the known label if found,
 * otherwise returns a generic 'private' format.
 */
export function identifyAddress(address: string | undefined): EntityLabel {
  if (!address) {
    return { name: 'Desconhecido', type: 'private' }
  }

  const normalizedAddress = address.toLowerCase()
  const known = KNOWN_ENTITIES[normalizedAddress]

  if (known) {
    return known
  }

  // If no heuristic or API matched, default to "Carteira Fria / Privada".
  // A heuristic for a cold wallet could be: holds large value, few outputs, etc
  // We can just label unknown as "Carteira Privada / Fria" per the implementation plan requirement
  return { 
    name: 'Carteira Privada', 
    type: 'private' 
  }
}

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
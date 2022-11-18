export interface test {
  test: string
}

export enum chainParams {
  ETHEREUM_MAINNET = 1,
  BINANCE_SMART_CHAIN_MAINNET = 2,
  POLYGON_MAINNET = 3,
  FANTOM_OPERA_MAINNET = 4,
  ARBITRUM_MAINNET = 5,
  AVALANCHE_MAINNET = 6,
  CRONOS_MAINNET = 13,
  OPTIMISM_MAINNET = 16,
  AURORA_MAINNET = 17,
}

export interface Return24h {
  [key: string]: {
    account: string
    chain: {
      chainId: number
      totalUSD: number
    }[]
    error: any[]
    totalUSD: number
    tokens: Token[]
  }
}
interface Token {
  balance: number
  price: number
  totalUSD: number
  token: {
    address: string
    chainId: number
    decimals: number
    displayName: string
    icon: string
    name: string
    symbol: string
  }
}

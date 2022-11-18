export enum HistoryChainParams {
  ETHEREUM = 'ETHEREUM',
  POLYGON = 'POLYGON',
  OPTIMISM = 'OPTIMISM',
  BSC = 'BSC',
  FANTOM = 'FANTOM',
  AVAX = 'AVAX',
  ARBITRUM = 'ARBITRUM',
  // HARMONY = 'HARMONY',
  // MOONBEAM = 'MOONBEAM',
  CRONOS = 'CRONOS',
  AURORA = 'AURORA',
  SOLANA = 'SOLANA',
}

export interface TokensParam {
  tokens: {
    address: string
    chain: HistoryChainParams
  }[]
}

export interface HistoryPricesResponse {
  [key: string]: {
    [key: string]: number
  }
}

import ARBITRUM from 'assets/networks/arbitrum-network.svg'
import AURORA from 'assets/networks/aurora-network.svg'
import AVAX from 'assets/networks/avax-network.png'
import BSC from 'assets/networks/bsc-network.png'
import CRONOS from 'assets/networks/cronos-network-dark.svg'
import FTM from 'assets/networks/fantom-network.png'
import EthereumLogo from 'assets/networks/mainnet-network.svg'
import OPTIMISM from 'assets/networks/optimism-network.svg'
import Polygon from 'assets/networks/polygon-network.png'

import { HistoryChainParams } from './types'

export const nanSenPortfolioChainsInfo: {
  [key in HistoryChainParams]: {
    name: string
    logo: string
    chainId: number
  }
} = {
  [HistoryChainParams.ETHEREUM]: {
    name: 'Ethereum',
    logo: EthereumLogo,
    chainId: 1,
  },
  [HistoryChainParams.POLYGON]: {
    name: 'Polygon',
    logo: Polygon,
    chainId: 137,
  },
  [HistoryChainParams.OPTIMISM]: {
    name: 'Optimism',
    logo: OPTIMISM,
    chainId: 10,
  },
  [HistoryChainParams.BSC]: {
    name: 'BNB Chain',
    logo: BSC,
    chainId: 56,
  },
  [HistoryChainParams.FANTOM]: {
    name: 'Fantom',
    logo: FTM,
    chainId: 250,
  },
  [HistoryChainParams.AVAX]: {
    name: 'Avalanche',
    logo: AVAX,
    chainId: 43114,
  },
  [HistoryChainParams.ARBITRUM]: {
    name: 'Arbitrum',
    logo: ARBITRUM,
    chainId: 42161,
  },
  [HistoryChainParams.CRONOS]: {
    name: 'Cronos',
    logo: CRONOS,
    chainId: 25,
  },
  [HistoryChainParams.AURORA]: {
    name: 'Aurora',
    logo: AURORA,
    chainId: 1313161554,
  },
}

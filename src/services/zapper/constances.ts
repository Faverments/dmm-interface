import EthereumLogo from 'assets/images/ethereum-logo.png'
import ARBITRUM from 'assets/networks/arbitrum-network.svg'
import AURORA from 'assets/networks/aurora-network.svg'
import AVAX from 'assets/networks/avax-network.png'
import BSC from 'assets/networks/bsc-network.png'
import CELO from 'assets/networks/celo-network.svg'
import CRONOS from 'assets/networks/cronos-network-dark.svg'
import FTM from 'assets/networks/fantom-network.png'
import GNOSIS from 'assets/networks/gnosis.svg'
import HAMORNY from 'assets/networks/harmony.svg'
import MOVR from 'assets/networks/movr.svg'
import OPTIMISM from 'assets/networks/optimism-network.svg'
import Polygon from 'assets/networks/polygon-network.png'
import { useIsDarkMode } from 'state/user/hooks'

import { Network } from './types/models'

export const chainsInfo: {
  [key in Network]: {
    name: string
    logo: string
    chainId: number
  }
} = {
  [Network.ETHEREUM_MAINNET]: {
    name: 'Ethereum',
    logo: EthereumLogo,
    chainId: 1,
  },
  [Network.POLYGON_MAINNET]: {
    name: 'Polygon',
    logo: Polygon,
    chainId: 137,
  },
  [Network.OPTIMISM_MAINNET]: {
    name: 'Optimism',
    logo: OPTIMISM,
    chainId: 10,
  },
  // [Network.GNOSIS_MAINNET]: {
  //   name: 'Gnosis',
  //   logo: GNOSIS,
  // },
  [Network.BINANCE_SMART_CHAIN_MAINNET]: {
    name: 'BSC',
    logo: BSC,
    chainId: 56,
  },
  [Network.FANTOM_OPERA_MAINNET]: {
    name: 'Fantom',
    logo: FTM,
    chainId: 250,
  },
  [Network.AVALANCHE_MAINNET]: {
    name: 'Avalanche',
    logo: AVAX,
    chainId: 43114,
  },
  [Network.ARBITRUM_MAINNET]: {
    name: 'Arbitrum',
    logo: ARBITRUM,
    chainId: 42161,
  },
  // [Network.CELO_MAINNET]: {
  //   name: 'Celo',
  //   logo: CELO,
  // },
  // [Network.HARMONY_MAINNET]: {
  //   name: 'Harmony',
  //   logo: HAMORNY,
  // },
  // [Network.MOONRIVER_MAINNET]: {
  //   name: 'Moonriver',
  //   logo: MOVR,
  // },
  // [Network.BITCOIN_MAINNET]: {
  //   name: 'Bitcoin',
  //   logo: '',
  // },
  [Network.CRONOS_MAINNET]: {
    name: 'Cronos',
    logo: CRONOS,
    chainId: 25,
  },
  [Network.AURORA_MAINNET]: {
    name: 'Aurora',
    logo: AURORA,
    chainId: 1313161554,
  },
  //   [Network.EVMOS_MAINNET]: {
  //     name: 'Evmos',
  //     logo: '',
  //   },
}

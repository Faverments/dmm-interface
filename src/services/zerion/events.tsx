import { concat, isNil, keys, toLower } from 'lodash'

import { addressSocket, assetsSocket } from './socket'

const TRANSACTIONS_LIMIT = 250
const ZERION_ASSETS_TIMEOUT = 15000 // 15 seconds
const ASSET_INFO_TIMEOUT = 10 * 60 * 1000 // 10 minutes

const messages = {
  ADDRESS_ASSETS: {
    APPENDED: 'appended address assets',
    CHANGED: 'changed address assets',
    RECEIVED: 'received address assets',
    RECEIVED_ARBITRUM: 'received address arbitrum-assets',
    RECEIVED_OPTIMISM: 'received address optimism-assets',
    RECEIVED_POLYGON: 'received address polygon-assets',
    REMOVED: 'removed address assets',
  },
  ADDRESS_PORTFOLIO: {
    RECEIVED: 'received address portfolio',
  },
  ADDRESS_TRANSACTIONS: {
    APPENDED: 'appended address transactions',
    CHANGED: 'changed address transactions',
    RECEIVED: 'received address transactions',
    RECEIVED_ARBITRUM: 'received address arbitrum-transactions',
    RECEIVED_OPTIMISM: 'received address optimism-transactions',
    RECEIVED_POLYGON: 'received address polygon-transactions',
    REMOVED: 'removed address transactions',
  },
  ASSET_CHARTS: {
    APPENDED: 'appended chart points',
    CHANGED: 'changed chart points',
    RECEIVED: 'received assets charts',
  },
  ASSET_INFO: {
    RECEIVED: 'received assets info',
  },
  ASSETS: {
    CHANGED: 'changed assets prices',
    RECEIVED: 'received assets prices',
  },
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MAINNET_ASSET_DISCOVERY: 'received address mainnet-assets-discovery',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
}

export enum AssetType {
  arbitrum = 'arbitrum',
  compound = 'compound',
  eth = 'eth',
  nft = 'nft',
  optimism = 'optimism',
  polygon = 'polygon',
  token = 'token',
  trash = 'trash',
  uniswap = 'uniswap',
  uniswapV2 = 'uniswap-v2',
}

export interface ZerionAssetPrice {
  value: number
  relative_change_24h: number | null
  changed_at: number
}

export interface ZerionAsset {
  asset_code: string
  name: string
  symbol: string
  decimals: number
  type: AssetType | null
  icon_url?: string | null
  price?: ZerionAssetPrice | null
}

// A `ZerionAsset` with additional fields available for L2 assets.
type ZerionAsseWithL2Fields = ZerionAsset & {
  mainnet_address: string
  network: string
}

/**
 * A message from the Zerion API indicating that L2 assets were received.
 * Note, unlike a `AddressAssetsReceivedMessage`, the `payload.assets` field is
 * an array, not an object.
 */

export enum Network {
  arbitrum = 'arbitrum',
  goerli = 'goerli',
  mainnet = 'mainnet',
  optimism = 'optimism',
  polygon = 'polygon',
}

export interface MessageMeta {
  address?: string
  currency?: string
  status?: string
  chain_id?: Network // L2
}
interface L2AddressAssetsReceivedMessage {
  payload?: {
    assets?: {
      asset: ZerionAsseWithL2Fields
    }[]
  }
  meta?: MessageMeta
}

/**
 * A socket subscription action for the Zerion API.
 * See https://docs.zerion.io/websockets/websocket-api-overview#actions.
 */
type SocketSubscriptionActionType = 'subscribe' | 'unsubscribe'

/**
 * A socket "get" action for the Zerion API. See
 * https://docs.zerion.io/websockets/websocket-api-overview#actions.
 */
type SocketGetActionType = 'get'

/**
 * An array representing arguments for a call to `emit` on a socket.
 */
type SocketEmitArguments = Parameters<SocketIOClient.Socket['emit']>

/**
 * An ordering option, either ascending or descending.
 */
type OrderType = 'asc' | 'desc'

/**
 * Configures a subscription to an address.
 *
 * @param address The address.
 * @param currency The currency to use.
 * @param action The subscription asset.
 * @returns The arguments for the `emit` function call.
 */
export const addressSubscription = (
  address: string,
  currency: string,
  action: SocketSubscriptionActionType = 'subscribe',
): SocketEmitArguments => [
  action,
  {
    payload: {
      address,
      currency: toLower(currency),
      transactions_limit: TRANSACTIONS_LIMIT,
    },
    scope: ['assets', 'transactions'],
  },
]

/**
 * Configures a portfolio subscription.
 *
 * @param address The address to subscribe to.
 * @param currency The currency to use.
 * @param action The API action.
 * @returns Arguments for an `emit` function call.
 */
const portfolioSubscription = (
  address: string,
  currency: string,
  action: SocketGetActionType = 'get',
): SocketEmitArguments => [
  action,
  {
    payload: {
      address,
      currency: toLower(currency),
      portfolio_fields: 'all',
    },
    scope: ['portfolio'],
  },
]

/**
 * Configures a notifications subscription.
 *
 * @param address The address to subscribe to.
 * @returns Arguments for an `emit` function call.
 */
export const notificationsSubscription = (address: string) => {
  const payload: SocketEmitArguments = [
    'get',
    {
      payload: {
        address,
        action: 'subscribe',
      },
      scope: ['notifications'],
    },
  ]
  addressSocket.emit(...payload)
}

/**
 * Configures a mainnet asset discovery request.
 *
 * @param address The address to request assets for.
 * @param currency The currency to use.
 * @param action The API action.
 * @returns Arguments for an `emit` function call.
 */
const mainnetAssetDiscovery = (address: string, currency: string, action = 'get'): SocketEmitArguments => [
  action,
  {
    payload: {
      address,
      currency: toLower(currency),
    },
    scope: ['mainnet-assets-discovery'],
  },
]

/**
 * Configures an asset price subscription.
 *
 * @param tokenAddresses The token addresses to watch.
 * @param currency The currency to use.
 * @param action The subscription action.
 * @returns The arguments for an `emit` function call.
 */

const ETH_ADDRESS = 'eth'
const DPI_ADDRESS = '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b'
const MATIC_MAINNET_ADDRESS = '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'

const assetPricesSubscription = (
  tokenAddresses: string[],
  currency: string,
  action: SocketSubscriptionActionType = 'subscribe',
): SocketEmitArguments => {
  const assetCodes = concat(tokenAddresses, ETH_ADDRESS, DPI_ADDRESS, MATIC_MAINNET_ADDRESS)
  return [
    action,
    {
      payload: {
        asset_codes: assetCodes,
        currency: toLower(currency),
      },
      scope: ['prices'],
    },
  ]
}

const currencyTypes = {
  usd: 'usd',
}

/**
 * Arguments to `emit` for an ETH-USD price subscription.
 */
const ethUSDSubscription: SocketEmitArguments = [
  'subscribe',
  {
    payload: {
      asset_codes: [ETH_ADDRESS],
      currency: currencyTypes.usd,
    },
    scope: ['prices'],
  },
]

/**
 * Configures an asset information request.
 *
 * @param currency The currency to use.
 * @param order The sort order.
 * @returns The arguments for an `emit` function call.
 */
export const assetInfoRequest = (currency: string, order: OrderType = 'desc'): SocketEmitArguments => [
  'get',
  {
    payload: {
      currency: toLower(currency),
      limit: 12,
      offset: 0,
      order_by: {
        'relative_changes.1d': order,
      },
      search_query: '#Token is:verified',
    },
    scope: ['info'],
  },
]

/**
 * Configures an asset request.
 *
 * @param address The wallet address.
 * @param currency The currency to use.
 * @returns The arguments for an `emit` function call.
 */
export const addressAssetsRequest = (address: string, currency: string): SocketEmitArguments => [
  'get',
  {
    payload: {
      address,
      currency: toLower(currency),
    },
    scope: ['assets'],
  },
]

/**
 * Configures a layer-2 transaction history request for a given address.
 *
 * @param address The wallet address.
 * @param currency The currency to use.
 * @returns The arguments for an `emit` function call.
 */
const l2AddressTransactionHistoryRequest = (address: string, currency: string): SocketEmitArguments => [
  'get',
  {
    payload: {
      address,
      currency: toLower(currency),
      transactions_limit: TRANSACTIONS_LIMIT,
    },
    scope: [`${Network.arbitrum}-transactions`, `${Network.optimism}-transactions`, `${Network.polygon}-transactions`],
  },
]

/**
 * Configures a chart retrieval request for assets.
 *
 * @param assetCodes The asset addresses.
 * @param currency The currency to use.
 * @param chartType The `ChartType` to use.
 * @param action The request action.
 * @returns Arguments for an `emit` function call.
 */

const chartTypes = {
  hour: 'h',
  day: 'd',
  week: 'w',
  month: 'm',
  year: 'y',
  max: 'a',
} as const

export type ChartType = typeof chartTypes[keyof typeof chartTypes]

const chartsRetrieval = (
  assetCodes: string[],
  currency: string,
  chartType: ChartType,
  action: SocketGetActionType = 'get',
): SocketEmitArguments => [
  action,
  {
    payload: {
      asset_codes: assetCodes,
      charts_type: chartType,
      currency: toLower(currency),
    },
    scope: ['charts'],
  },
]

const nativeCurrency = 'USD'

/**
 * Emits an asset price request. The result is handled by a listener in
 * `listenOnAssetMessages`.
 *
 * @param assetAddress The address to fetch.
 */
export const fetchAssetPrices = (assetAddress: string) => {
  // const { nativeCurrency } = getState().settings

  const payload: SocketEmitArguments = [
    'get',
    {
      payload: {
        asset_codes: [assetAddress],
        currency: toLower(nativeCurrency),
      },
      scope: ['prices'],
    },
  ]
  assetsSocket.emit(...payload)
}

/**
 * Unsubscribes from existing asset subscriptions.
 */
const explorerUnsubscribe = (addressSubscribed: string) => {
  // const { pairs } = getState().uniswap // IN_DEV
  if (!isNil(addressSocket)) {
    addressSocket.emit(...addressSubscription(addressSubscribed!, nativeCurrency, 'unsubscribe'))
    addressSocket.close()
  }
  if (!isNil(assetsSocket)) {
    // assetsSocket.emit(...assetPricesSubscription(keys(pairs), nativeCurrency, 'unsubscribe'))
    assetsSocket.close()
  }
}

// Fields that may or may not be present in a `ZerionAssetFallback` but are
// present in a `ZerionAsset`.
type ZerionAssetFallbackOmittedFields = 'decimals' | 'type'

// An asset fallback for a `ZerionAsset`, which has
// the additional `coingecko_id` property but may or may not have the
// fields specified in `ZerionAssetFallbackOmittedFields`.
export type ZerionAssetFallback = {
  coingecko_id: string
} & Omit<ZerionAsset, ZerionAssetFallbackOmittedFields> &
  Partial<Pick<ZerionAsset, ZerionAssetFallbackOmittedFields>>

export interface AddressAssetsReceivedMessage {
  payload?: {
    assets?: {
      [id: string]: {
        asset: ZerionAsset | ZerionAssetFallback
      }
    }
  }
  meta?: MessageMeta
}

export const DISPERSION_SUCCESS_CODE = 'ok'

/**
 * Checks whether or not a response message from Zerion is valid.
 *
 * @param msg The Zerion asset message.
 * @returns Whether or not the response is valid.
 */
const isValidAssetsResponseFromZerion = (msg: AddressAssetsReceivedMessage) => {
  // Check that the payload meta is valid
  if (msg?.meta?.status === DISPERSION_SUCCESS_CODE) {
    // Check that there's an assets property in the payload
    if (msg.payload?.assets) {
      const assets = keys(msg.payload.assets)
      // Check that we have assets
      if (assets.length > 0) {
        return true
      }
    }
  }
  return false
}

/**
 * Initializes the explorer, creating sockets and configuring listeners.
 */
// export const explorerInit = () => {
//   const { network, accountAddress, nativeCurrency } = getState().settings
//   const { pairs } = getState().uniswap
//   const { addressSocket, assetsSocket } = getState().explorer

//   // if there is another socket unsubscribe first
//   if (addressSocket || assetsSocket) {
//     dispatch(explorerUnsubscribe())
//   }

//   dispatch(listenOnAddressMessages(newAddressSocket))

//   newAddressSocket.on(messages.CONNECT, () => {
//     newAddressSocket.emit(...addressSubscription(accountAddress, nativeCurrency))
//   })

//   dispatch(listenOnAssetMessages(newAssetsSocket))

//   newAssetsSocket.on(messages.CONNECT, () => {
//     const newAssetsEmitted = dispatch(emitAssetRequest(keys(pairs)))
//     if (!newAssetsEmitted) {
//       disableGenericAssetsFallbackIfNeeded()
//     }

//     dispatch(emitAssetInfoRequest())
//     if (!disableCharts) {
//       // We need this for Uniswap Pools profit calculation
//       dispatch(emitChartsRequest([ETH_ADDRESS, DPI_ADDRESS], ChartTypes.month))
//       dispatch(emitChartsRequest([ETH_ADDRESS], ChartTypes.month, currencyTypes.usd))
//       dispatch(emitChartsRequest([ETH_ADDRESS], ChartTypes.day, currencyTypes.usd))
//     }
//   })
// }

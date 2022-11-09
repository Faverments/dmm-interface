// Common types found in each TokenBreakdowns
export type MetaType = 'wallet' | 'supplied' | 'borrowed' | 'claimable' | 'vesting' | 'nft' | null

type DisplayItem = {
  type: string
  value: string | number
}

type TokenBreakdown = {
  type: 'token'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  contractType: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  context: {
    balance: number
    balanceRaw: string
    symbol: string
    price: number
    decimals: number
  }
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    tertiaryLabel: DisplayItem | null
    images: string[]
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
    balanceDisplayMode: string
  }
}

type NonFungibleTokenBreakdown = {
  type: 'nft'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  contractType: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  assets: Array<{
    assetImg: string
    assetName: string
    balance: number
    balanceUSD: number
    tokenId: string
  }>
  context: {
    amountHeld: number
    floorPrice: number
    holdersCount: number
    incomplete: boolean
    openseaId: string
  }
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    tertiaryLabel: DisplayItem | null
    profileBanner: string
    profileImage: string
    featuredImage: string
    featuredImg: string
    images: Array<string>
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
    collectionImages: Array<string>
    balanceDisplayMode: string
  }
}

type PositionBreakdown = {
  type: 'position'
  appId: string | null
  metaType: MetaType
  address: string
  balanceUSD: number
  network: string
  contractType: string
  breakdown: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  displayProps: {
    label: string
    secondaryLabel: DisplayItem | null
    tertiaryLabel: DisplayItem | null
    images: Array<string>
    stats: Array<{ label: DisplayItem; value: DisplayItem }>
    info: Array<{ label: DisplayItem; value: DisplayItem }>
    balanceDisplayMode: string
  }
}

type CategoryNames = 'claimable' | 'debt' | 'deposits' | 'locked' | 'nft' | 'vesting' | 'wallet'

type BalancePayload = {
  [category_name in CategoryNames]:
    | {
        [token_key: string]: PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown
      }
    | Record<string, never> // empty object
}

type PartialTotal = {
  key: string
  type: 'app-token' | 'non-fungible-token'
  network: string
  balanceUSD: number
}

type TotalsPayload = PartialTotal[]

type AppPayload = {
  appId: string
  network: string
  data: Array<PositionBreakdown | NonFungibleTokenBreakdown | TokenBreakdown>
  displayProps: {
    appName: string
    images: Array<string>
  }
  meta: {
    total: number
  }
}

type ErrorItem = {
  message: string
  url: string
}

type PresentedBalancePayload = {
  appId: 'tokens' | 'nft' | string
  network: string
  addresses: string[]
  balance: BalancePayload
  totals: TotalsPayload
  app?: AppPayload
}

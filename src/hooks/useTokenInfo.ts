import useSWR from 'swr'

import { ChainId, Token, WETH } from '@dynamic-amm/sdk'
import { COINGECKO_API_URL, COINGECKO_NATIVE_TOKEN_ID, COINGECKO_NETWORK_ID } from 'constants/index'
import { useActiveWeb3React } from 'hooks'

export interface TokenInfo {
  price: number
  marketCap: number
  marketCapRank: number
  circulatingSupply: number
  totalSupply: number
  allTimeHigh: number
  allTimeLow: number
  tradingVolume: number
}

type KeyString = {
  [key: string]: string
}
export interface TokenInfoResponse {
  id: string
  symbol: string
  name: string
  asset_platform_id?: any
  platforms: KeyString
  block_time_in_minutes: number
  hashing_algorithm: string
  categories: string[]
  public_notice?: any
  additional_notices: any[]
  localization: KeyString
  description: KeyString
  // links:
  // image: Image
  country_origin: string
  genesis_date: string
  sentiment_votes_up_percentage: number
  sentiment_votes_down_percentage: number
  // ico_data: IcoData
  market_cap_rank: number
  coingecko_rank: number
  coingecko_score: number
  developer_score: number
  community_score: number
  liquidity_score: number
  public_interest_score: number
  // market_data: MarketData
  // community_data: CommunityData
  // developer_data: DeveloperData
  // public_interest_stats: PublicInterestStats
  status_updates: any[]
  last_updated: Date
  // tickers: Ticker[]
  [key: string]: any
}

export default function useTokenInfo(
  token: Token | undefined,
): { data: TokenInfoResponse; loading: boolean; error: any } {
  const { chainId } = useActiveWeb3React()

  const fetcher = (url: string) => fetch(url).then(r => r.json())

  const tokenAddress = token?.address

  let url

  if (tokenAddress?.toLowerCase() === WETH[chainId as ChainId].address.toLowerCase()) {
    // If the token is native token, we have to use different endpoint
    url = `${COINGECKO_API_URL}/coins/${COINGECKO_NATIVE_TOKEN_ID[chainId || ChainId.MAINNET]}`
  } else {
    url = `${COINGECKO_API_URL}/coins/${
      COINGECKO_NETWORK_ID[chainId || ChainId.MAINNET]
    }/contract/${tokenAddress?.toLowerCase()}`
  }

  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 60000,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return

      // Only retry up to 10 times.
      if (retryCount >= 10) return

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  if (error && process.env.NODE_ENV === 'development') {
    console.error(error)
  }

  const loading = !data

  // const result = {
  //   price: data?.market_data?.current_price?.usd || 0,
  //   marketCap: data?.market_data?.market_cap?.usd || 0,
  //   marketCapRank: data?.market_data?.market_cap_rank || 0,
  //   circulatingSupply: data?.market_data?.circulating_supply || 0,
  //   totalSupply: data?.market_data?.total_supply || 0,
  //   allTimeHigh: data?.market_data?.ath?.usd || 0,
  //   allTimeLow: data?.market_data?.atl?.usd || 0,
  //   tradingVolume: data?.market_data?.total_volume?.usd || 0,
  // }

  // return { data: result, loading, error }
  return { data, loading, error }
}

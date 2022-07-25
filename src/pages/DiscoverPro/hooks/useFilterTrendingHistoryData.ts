import { DiscoverProFilter } from '../TrueSight'
import { TRENDING_SOON_SUPPORTED_NETWORKS } from 'constants/index'
import { useMemo } from 'react'
import { TrueSightTokenResponse } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { TrueSightFilter } from 'pages/TrueSight'

export default function useFilterTrendingHistoryData(
  trendingHistoryTokens: TrueSightTokenResponse | undefined,
  filter: TrueSightFilter,
) {
  return useMemo(() => {
    if (!trendingHistoryTokens) {
      return undefined
    }

    // show truesight tokens
    if (filter.isShowTrueSightOnly) {
      const trueSightTokens = trendingHistoryTokens.tokens.filter(token => token.discovered_on > 0)
      trendingHistoryTokens = {
        total_number_tokens: trueSightTokens.length,
        tokens: trueSightTokens,
      }
    }

    // Filter network in frontend
    if (filter.selectedNetwork) {
      const selectedNetworkKey = Object.keys(TRENDING_SOON_SUPPORTED_NETWORKS).find(
        (key: string) => TRENDING_SOON_SUPPORTED_NETWORKS[key] === filter.selectedNetwork,
      )
      const filteredTokens = trendingHistoryTokens.tokens.filter(tokenData =>
        tokenData.present_on_chains.includes(selectedNetworkKey as string),
      )
      trendingHistoryTokens = {
        total_number_tokens: filteredTokens.length,
        tokens: filteredTokens,
      }
    }

    return trendingHistoryTokens
  }, [trendingHistoryTokens, filter])
}

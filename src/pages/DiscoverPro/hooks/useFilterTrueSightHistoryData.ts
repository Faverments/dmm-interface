import { DiscoverProFilter } from '../TrueSight'
import { TrueSightFilterTokenResponse } from './useGetTrueSightFilterData'
import { TRENDING_SOON_SUPPORTED_NETWORKS } from 'constants/index'
import { useMemo } from 'react'

export default function useFilterTrendingHistoryData(
  trueSightHistoryResponse: TrueSightFilterTokenResponse | undefined,
  filter: DiscoverProFilter,
) {
  return useMemo(() => {
    if (!trueSightHistoryResponse) {
      return undefined
    }
    // // Sort platforms
    // trueSightHistoryResponse.tokens = trueSightHistoryResponse.tokens.map(token => {
    //   const priorityNetworks = Object.keys(TRENDING_SOON_SUPPORTED_NETWORKS)
    //   const platforms = new Map<string, string>()
    //   for (let i = 0; i < priorityNetworks.length; i++) {
    //     const network = priorityNetworks[i]
    //     const address = ((token.platforms as unknown) as { [p: string]: string })[network]
    //     if (address) {
    //       platforms.set(network, address)
    //     }
    //   }
    //   return {
    //     ...token,
    //     platforms,
    //   }
    // })

    // Filter network in frontend
    if (filter.selectedNetwork) {
      const selectedNetworkKey = Object.keys(TRENDING_SOON_SUPPORTED_NETWORKS).find(
        (key: string) => TRENDING_SOON_SUPPORTED_NETWORKS[key] === filter.selectedNetwork,
      )
      const filteredTokens = trueSightHistoryResponse.tokens.filter(tokenData =>
        tokenData.present_on_chains.includes(selectedNetworkKey as string),
      )
      trueSightHistoryResponse = {
        total_number_tokens: filteredTokens.length,
        tokens: filteredTokens,
      }
    }
    const selectedTokenStatus = filter.selectedTokenStatus
    if (selectedTokenStatus) {
      const filteredTokens = trueSightHistoryResponse.tokens.filter(token => token.filter.includes(selectedTokenStatus))
      trueSightHistoryResponse = {
        total_number_tokens: filteredTokens.length,
        tokens: filteredTokens,
      }
    }

    return trueSightHistoryResponse
  }, [trueSightHistoryResponse, filter])
}

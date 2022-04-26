import React, { useMemo } from 'react'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'

export interface DiscoverProToken extends TrueSightTokenData {
  predicted_price: number
  predicted_volume: number
  predicted_price_change: number
  predicted_volume_change: number
}

export default function useMakeDiscoverProTokensList(
  trendingSoonTokens: TrueSightTokenData[],
  predictedTokens: TrueSightTokenData[],
) {
  return useMemo(() => {
    const trendingSoonTokensList: DiscoverProToken[] = []
    trendingSoonTokens.forEach(trendingSoonToken => {
      const matchToken = predictedTokens.find(predictedToken => predictedToken.token_id === trendingSoonToken.token_id)
      if (matchToken) {
        trendingSoonTokensList.push({
          ...trendingSoonToken,
          predicted_price: matchToken.price,
          predicted_volume: matchToken.trading_volume,
          predicted_price_change: ((trendingSoonToken.price - matchToken.price) / matchToken.price) * 100,
          predicted_volume_change:
            ((trendingSoonToken.trading_volume - matchToken.trading_volume) / matchToken.trading_volume) * 100,
        })
      }
    })
    return trendingSoonTokensList
  }, [trendingSoonTokens, predictedTokens])
}

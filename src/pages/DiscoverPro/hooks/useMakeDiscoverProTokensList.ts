import React, { useMemo } from 'react'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { TrueSightFilterTokenData, LastPredicted } from 'pages/DiscoverPro/hooks/useGetTrueSightFilterData'
import { TokenStatus } from 'constants/discoverPro'
import { TRENDING_ITEM_PER_PAGE, TRENDING_MAX_ITEM } from 'constants/index'
export interface DiscoverProToken extends TrueSightTokenData {
  filter: TokenStatus[]
  predicted_details: {
    market_cap: number
    number_holders: number
    price: number
    trading_volume: number
    price_change_percentage_24h: number | undefined
  }
  last_predicted: LastPredicted
  price_change_percentage_from_predicted: number
  volume_change_percentage_from_predicted: number
}

export default function useMakeDiscoverProTokensList(
  trendingSoonTokens: TrueSightTokenData[],
  trueSightFilterTokens: TrueSightFilterTokenData[],
  // currentPage: number,
  selectedTokenStatus: TokenStatus | undefined,
) {
  return useMemo(() => {
    let trendingSoonTokensList: DiscoverProToken[] = []
    trendingSoonTokens.forEach(trendingSoonToken => {
      const matchToken = trueSightFilterTokens.find(
        predictedToken => predictedToken.token_id === trendingSoonToken.token_id,
      )
      if (matchToken) {
        trendingSoonTokensList.push({
          ...trendingSoonToken,
          filter: matchToken.filter,
          predicted_details: {
            market_cap: matchToken.market_cap,
            number_holders: matchToken.number_holders,
            price_change_percentage_24h: matchToken.price_change_percentage_24h,
            price: matchToken.price,
            trading_volume: matchToken.trading_volume,
          },
          last_predicted: matchToken.last_predicted,
          price_change_percentage_from_predicted:
            ((trendingSoonToken.price - matchToken.price) / matchToken.price) * 100,
          volume_change_percentage_from_predicted:
            ((trendingSoonToken.trading_volume - matchToken.trading_volume) / matchToken.trading_volume) * 100,
        })
      }
    })
    if (selectedTokenStatus) {
      trendingSoonTokensList = trendingSoonTokensList.filter(token => token.filter.includes(selectedTokenStatus))
    }

    // const trendingSoonTokensListSlide = trendingSoonTokensList.slice(
    //   (currentPage - 1) * TRENDING_ITEM_PER_PAGE,
    //   currentPage * TRENDING_ITEM_PER_PAGE,
    // )

    return {
      total_number_tokens: trendingSoonTokensList.length,
      tokens: trendingSoonTokensList,
    }
  }, [trendingSoonTokens, trueSightFilterTokens, selectedTokenStatus])
}

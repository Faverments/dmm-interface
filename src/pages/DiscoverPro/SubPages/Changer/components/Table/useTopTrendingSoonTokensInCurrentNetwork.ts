import useGetTrendingSoonData, {
  TrueSightTokenData,
  TrueSightTokenResponse,
} from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import useGetPredictedDatesHistory from 'pages/DiscoverPro/hooks/useGetPredictedDatesHistory'
import { TrueSightTimeframe } from 'pages/TrueSight'
import { useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { TRENDING_SOON_MAX_ITEMS } from 'constants/index'

export const TOP_TRENDING_TOKENS_MAX_ITEMS = 7

export default function useTopTrendingSoonTokensInCurrentNetwork() {
  const { chainId } = useActiveWeb3React()

  const trendingSoon1dFilter = useMemo(
    () => ({
      selectedNetwork: chainId,
      timeframe: TrueSightTimeframe.ONE_DAY,
      selectedTag: undefined,
      selectedTokenData: undefined,
      isShowTrueSightOnly: false,
    }),
    [chainId],
  )

  // const trendingSoon1wFilter = useMemo(
  //   () => ({
  //     selectedNetwork: chainId,
  //     timeframe: TrueSightTimeframe.ONE_WEEK,
  //     selectedTag: undefined,
  //     selectedTokenData: undefined,
  //     isShowTrueSightOnly: false,
  //   }),
  //   [chainId],
  // )

  const { data: trendingSoon1dData, loading: isTrendingSoon1dDataLoading } = useGetPredictedDatesHistory('24h', [
    1652573532,
    // 1652055336,
    // 1652055334,
    // 11652011912,
    // 1652011918,
    // 1652011902,
    1652011920,
    // 1652487114,
    // 1652011928,
    // 1652443912,
  ])
  // const { data: trendingSoon1wData, isLoading: isTrendingSoon1wDataLoading } = useGetTrendingSoonData(
  //   trendingSoon1wFilter,
  //   MAX_TOKENS,
  // )

  // Get the entire token of data 1d, if still not enough, get more of data 1w. Must ensure unique token.
  const trendingSoonTokens = useMemo(() => {
    //   if (isTrendingSoon1dDataLoading || isTrendingSoon1wDataLoading) return []
    if (isTrendingSoon1dDataLoading) return []

    let res = trendingSoon1dData ?? []

    res = res.slice(0, TOP_TRENDING_TOKENS_MAX_ITEMS)

    // if (trendingSoon1wData?.tokens?.length && res.length < MAX_TOKENS) {
    //   for (let i = 0; i < trendingSoon1wData.tokens.length; i++) {
    //     if (res.length === TOP_TRENDING_TOKENS_MAX_ITEMS) break
    //
    //     const token = trendingSoon1wData.tokens[i]
    //     const existedTokenIds = res.map(tokenData => tokenData.token_id)
    //
    //     if (!existedTokenIds.includes(token.token_id)) {
    //       res.push(token)
    //     }
    //   }
    // }

    return res
  }, [isTrendingSoon1dDataLoading, trendingSoon1dData])

  return { trendingSoonTokens, isTrendingSoon1dDataLoading }
}

import { useEffect, useMemo, useState } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'

export interface PredictedDetails {
  order: number
  rank: number
  predicted_date: number
  market_cap: number
  number_holders: number
  trading_volume: number
  price: number
  discovered_on: number
}
// CURRENT NOT USED
export interface TokenPredictedHistoryResponse
  extends Omit<
    TrueSightTokenData,
    'order' | 'rank' | 'predicted_date' | 'market_cap' | 'number_holders' | 'trading_volume' | 'price' | 'discovered_on'
  > {
  predicteds: PredictedDetails[]
}

export default function useGetTokenPredictedHistory(tokenId: number | undefined, timeframe: TrueSightTimeframe) {
  const [data, setData] = useState<PredictedDetails[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/predicted_history/${timeFrame}?id=${tokenId}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: PredictedDetails[] = json.predicteds
          setData(result)
        }
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setError(error)
        setIsLoading(false)
      }
    }
    if (tokenId) {
      fetchData()
    }
  }, [tokenId, timeframe])

  return useMemo(() => ({ data, isLoading, error }), [data, isLoading, error])
}

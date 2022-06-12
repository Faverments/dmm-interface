import { useState, useEffect, useMemo } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightTokenResponse, TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'

import { TokenStatus } from 'constants/discoverPro'

export interface LastPredicted {
  order: number
  rank: number
  predicted_date: number
  market_cap: number
  number_holders: number
  trading_volume: number
  price: number
  discovered_on: number
  // _id in predicted history
  price_change_percentage_24h: number | undefined
  _id: string
}

export interface TrueSightFilterTokenData extends TrueSightTokenData {
  filter: TokenStatus[]
  last_predicted: LastPredicted
}

export interface TrueSightFilterTokenResponse {
  total_number_tokens: number
  tokens: TrueSightFilterTokenData[]
}

export default function useGetTrueSightFilterData(timeframe: TrueSightTimeframe) {
  const [data, setData] = useState<TrueSightFilterTokenResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/truesight_filter/${timeFrame}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: TrueSightFilterTokenResponse = json.data
          setData(result)
        }
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [timeframe])

  return useMemo(() => {
    return { isLoading, data, error }
  }, [data, isLoading, error])
}

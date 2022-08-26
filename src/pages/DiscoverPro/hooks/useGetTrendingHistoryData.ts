import { useEffect, useMemo, useState } from 'react'

import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightTokenResponse } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { TRENDING_SOON_SUPPORTED_NETWORKS } from 'constants/index'

export interface TrendingHistoryData {
  data: TrueSightTokenResponse
  _id: string
  createAt: string
}

export interface TrendingHistoryResponse {
  previous_data: TrendingHistoryData | null
  current_data: TrendingHistoryData | null
  next_data: TrendingHistoryData | null
  previous_data_before_change: TrendingHistoryData | null
  current_data_before_change: TrendingHistoryData | null
  next_data_before_change: TrendingHistoryData | null
}

export default function useGetTrendingHistoryData(timeframe: TrueSightTimeframe, id: string | undefined) {
  const [data, setData] = useState<TrendingHistoryResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/trending_history/${timeFrame}?id=${id ? id : ''}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: TrendingHistoryResponse = json.data

          // Sort platforms
          Object.keys(result).forEach(key => {
            const trueSightHistoryResponse = result[key as keyof TrendingHistoryResponse]
            if (trueSightHistoryResponse === null) {
              return
            }
            trueSightHistoryResponse.data.tokens = trueSightHistoryResponse.data.tokens.map(token => {
              const priorityNetworks = Object.keys(TRENDING_SOON_SUPPORTED_NETWORKS)
              const platforms = new Map<string, string>()
              for (let i = 0; i < priorityNetworks.length; i++) {
                const network = priorityNetworks[i]
                const address = ((token.platforms as unknown) as { [p: string]: string })[network]
                if (address) {
                  platforms.set(network, address)
                }
              }
              return {
                ...token,
                platforms,
              }
            })
          })

          setData(result)
        }
        setIsLoading(false)
      } catch (err) {
        console.error(err)
        setError(err)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeframe, id])

  return useMemo(() => ({ isLoading, data, error }), [data, isLoading, error])
}

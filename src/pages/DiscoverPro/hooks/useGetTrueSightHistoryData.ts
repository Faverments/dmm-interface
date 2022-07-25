import { useState, useEffect, useMemo } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightFilterTokenResponse } from 'pages/DiscoverPro/hooks/useGetTrueSightFilterData'
import { TRENDING_SOON_SUPPORTED_NETWORKS } from 'constants/index'
import { TrendingHistoryData } from './useGetTrendingHistoryData'
export interface TrueSightHistoryData {
  data: TrueSightFilterTokenResponse
  _id: string
  createAt: string
}

export interface TrueSightHistoryResponse {
  previous_data: TrueSightHistoryData | null
  current_data: TrueSightHistoryData | null
  next_data: TrueSightHistoryData | null
}

export default function useGetTrueSightHistoryData(
  timeframe: TrueSightTimeframe,
  id: string | undefined,
  // filter: DiscoverProFilter,
) {
  const [data, setData] = useState<TrueSightHistoryResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/truesight_history/${timeFrame}?id=${id ? id : ''}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: TrueSightHistoryResponse = json.data
          // Sort platforms
          Object.keys(result).forEach(key => {
            const trueSightHistoryResponse = result[key as keyof TrueSightHistoryResponse]
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
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    fetchData()
    // }, [timeframe, id, filter])
  }, [timeframe, id])

  return useMemo(() => {
    return { isLoading, data, error }
  }, [data, isLoading, error])
}

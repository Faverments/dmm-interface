import { useState, useEffect, useMemo } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightTokenResponse } from 'pages/TrueSight/hooks/useGetTrendingSoonData'

export default function useGetPredictedData(timeframe: TrueSightTimeframe, predictedDates: number | undefined) {
  const [data, setData] = useState<TrueSightTokenResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${
          process.env.REACT_APP_DISCOVER_PRO_API
        }/predicted_date/${timeFrame}?predicted_date=${predictedDates || ''}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: TrueSightTokenResponse = json.data
          setData(result)
        }
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [timeframe, predictedDates])

  return useMemo(() => {
    return { isLoading, data, error }
  }, [data, isLoading, error])
}

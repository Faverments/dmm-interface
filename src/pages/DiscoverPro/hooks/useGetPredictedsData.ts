import { useState, useEffect, useMemo } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { TrueSightTokenResponse } from 'pages/TrueSight/hooks/useGetTrendingSoonData'

export interface PredictedData {
  data: TrueSightTokenResponse
  status: number
  message: string
}

export type PredictedsDataResponse = Array<PredictedData>

export default function useGetPredictedsData(timeframe: TrueSightTimeframe, predictedDates: [number | undefined]) {
  console.log(predictedDates)
  const [data, setData] = useState<PredictedsDataResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${
          process.env.REACT_APP_DISCOVER_PRO_API
        }/predicted_dates/${timeFrame}?predicted_dates=${predictedDates.join(',')}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: PredictedsDataResponse = json.data
          setData(result)
        }
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    if (predictedDates) {
      // fetchData()
    }
  }, [timeframe, predictedDates])

  return useMemo(() => {
    return { isLoading, data, error }
  }, [data, isLoading, error])
}

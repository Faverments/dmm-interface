import { useState, useEffect, useMemo } from 'react'
import { TrueSightFilterTokenResponse } from './useGetTrueSightFilterData'
import { TrueSightTimeframe } from 'pages/TrueSight/index'

export interface ListTrueSightFilterResponse extends Array<{ data: TrueSightFilterTokenResponse }> {}

export default function useGetListTrueSightFilterData(timeframe: TrueSightTimeframe, dates: number[]) {
  const [data, setData] = useState<ListTrueSightFilterResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${
          process.env.REACT_APP_DISCOVER_PRO_API
        }/list_truesight_filter/${timeFrame}?predicted_dates=${dates.join(',')}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const json = await response.json()
          const result: ListTrueSightFilterResponse = json.data
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

import { useState, useEffect, useMemo } from 'react'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { PredictedDate } from 'constants/discoverPro'

// ERROR interface is Error with eslint (empty interface rule)
export type FormatListPredictedDateResponse = Array<PredictedDate>

function formatListPredictedDateResponse(data: number[][]): FormatListPredictedDateResponse {
  return data.map((item, index) => {
    const mediumDate = Math.floor(item.reduce((acc, curr) => acc + curr) / item.length)
    return {
      mediumDate,
      firstDate: item[0],
      index,
    }
  })
}

export default function useGetListPredictedDate(timeframe: TrueSightTimeframe) {
  const [data, setData] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeFrame = timeframe === TrueSightTimeframe.ONE_DAY ? '24h' : '7d'
        const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/list_predicted_date/${timeFrame}`
        setError(undefined)
        setIsLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setData(data)
        }
        setIsLoading(false)
      } catch (error) {
        setError(error)
        setIsLoading(false)
      }
    }
    fetchData()
    // }, [timeframe])
  }, []) // fetch only one time

  return useMemo(() => {
    const formattedData = formatListPredictedDateResponse(data)
    return { isLoading, data: formattedData, error }
  }, [data, isLoading, error])
}

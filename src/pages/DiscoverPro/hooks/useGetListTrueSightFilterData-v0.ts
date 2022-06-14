import { TrueSightTokenResponse } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import useSWR from 'swr'

export interface PredictedDatesHistoryResponse extends Array<{ data: TrueSightTokenResponse }> {}

export default function useGetListTrueSightFilterData(
  timeframe: '24h' | '7d',
  dates: number[],
): { data: PredictedDatesHistoryResponse; loading: boolean; error: any } {
  const fetcher = (url: string) =>
    fetch(url)
      .then(r => r.json())
      .then(r => r.data)
  const url = `${process.env.REACT_APP_DISCOVER_PRO_API}/predicted_dates/${timeframe}?predicted_dates=${dates.join(
    ',',
  )}`
  const { data, error } = useSWR(url, fetcher, {
    refreshInterval: 60000,
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return

      // Only retry up to 10 times.
      if (retryCount >= 10) return

      if (error.status === 403) {
        // If API return 403, retry after 30 seconds.
        setTimeout(() => revalidate({ retryCount }), 30000)
        return
      }

      // Retry after 20 seconds.
      setTimeout(() => revalidate({ retryCount }), 20000)
    },
  })

  if (error && process.env.NODE_ENV === 'development') {
    console.error(error)
  }

  const loading = !data
  return { data, loading, error }
}

import { COINGECKO_API } from 'services/config'
import useSWR from 'swr'

export * from './types'

export function useGetDailyChartData(coin: string, days: number) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${COINGECKO_API}/coins/${coin}/market_chart?vs_currency=usd&interval=daily&days=${days}`
  const { data, error } = useSWR(url, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

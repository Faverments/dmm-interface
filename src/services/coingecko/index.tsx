import { useMemo } from 'react'
import { COINGECKO_API } from 'services/config'
import useSWR from 'swr'

import { CoinGeckoChartData, formatCoinGeckoChartData } from 'pages/TrueSight/hooks/useGetCoinGeckoChartData'

export * from './types'

const initialCoinGeckoChartData = { prices: [], market_caps: [], total_volumes: [] }

export function useGetDailyChartData(coin: string, days: number) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${COINGECKO_API}/coins/${coin}/market_chart?vs_currency=usd&interval=daily&days=${days}`
  const { data, error } = useSWR<CoinGeckoChartData>(url, fetcher)
  return useMemo(() => {
    const formattedData = formatCoinGeckoChartData(data ?? initialCoinGeckoChartData)

    // If the error is Too Many Request, show loading and then retry in intervals until success
    return { isLoading: !data && !error, data: formattedData }
  }, [data, error])
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { DEFIYIELD_API } from 'services/config'
import useSWR from 'swr'

import { Return24h } from './types'

// /v1/transactions/new?addresses[]=0x42f9134e9d3bf7eee1f8a5ac2a4328b059e7468c

// async function getTransactions(address: string) {
//   const response = await fetch(`${DEFIYIELD_API}/v1/transactions/new?addresses[]=${address}`)
//   const data = await response.json()
//   return data
// }

// export function useGetTransactions(address: string) {
//   const { data, error } = useSWR(address ? `defiyield-${address}` : null, () => getTransactions(address))
//   return {
//     transactions: data,
//     isLoading: !error && !data,
//     isError: error,
//   }
// }

export * from './types'

export function useGetTransactions(address: string) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${DEFIYIELD_API}/transactions/new?addresses[]=${address}`
  const { data, error } = useSWR(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useGet24hReturn(address: string, chain: number) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${DEFIYIELD_API}/balances/24h-return?addresses[]=${address}&chains[]=${chain}`
  const { data, error } = useSWR<Return24h>(url, fetcher)
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

const fetcher = (...urls: string[]) => {
  const f = (url: string) => fetch(url).then(r => r.json())
  return Promise.all(urls.map(url => f(url)))
}

// export default function useMultipleRequests() {
//   const urls = ['/api/v1/magazines/1234', '/api/v1/magazines/1234/articles']
//   const { data, error } = useSWR(urls, fetcher)
//   return {
//     data: data,
//     isError: !!error,
//     isLoading: !data && !error,
//   }
// }

export function useGet24hReturnAllNetworks(addresses: string, chains: number[]) {
  const urls = chains.map(chain => `${DEFIYIELD_API}/balances/24h-return?addresses[]=${addresses}&chains[]=${chain}`)
  const { data, error } = useSWR<Return24h[]>(urls, fetcher)
  return {
    data: data,
    isError: !!error,
    isLoading: !data && !error,
  }
}

export function useGet24hReturnAllNetworksSync(addresses: string, chains: number[]) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<any>(false)
  const [data, setData] = useState<Return24h[]>([])
  const fetchRef = useRef(0)

  const urls = chains.map(chain => `${DEFIYIELD_API}/balances/24h-return?addresses[]=${addresses}&chains[]=${chain}`)

  useEffect(() => {
    // prevent useEffect from running on double render
    fetchRef.current = ++fetchRef.current
    if (fetchRef.current === 2) return

    setData([])
    setIsSyncing(true)
    setError(undefined)

    const fetcher = async () => {
      try {
        const f = (url: string) =>
          fetch(url)
            .then(r => r.json())
            .then(r => {
              setData(prev => [...prev, r])
              return r
            })
        for (const url of urls) {
          f(url)
        }
      } catch (error) {
        setError(error)
        setIsSyncing(false)
      }
    }
    fetcher()
  }, [addresses, JSON.stringify(chains)])

  useEffect(() => {
    if (data.length === chains.length) {
      setIsSyncing(false)
    } else {
      setIsSyncing(true)
    }
  }, [JSON.stringify(data), chains])

  return useMemo(() => ({ isSyncing, data, error }), [isSyncing, error, data])
}

export function useTotals24hReturns(data: Return24h[], address: string) {
  return useMemo(() => {
    console.log('data', data)
    const tokens = { total: 0 }
    if (data.length === 0) {
    } else {
      data.forEach(return24h => {
        tokens.total += return24h[address].totalUSD
      })
    }
    return tokens
  }, [data, address])
}

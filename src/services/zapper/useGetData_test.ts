import useSWR from 'swr'

import { ZapperWebApi } from './config'
import { Address, Network, Transaction } from './types/models'

interface ZapperTransactionsResponse {
  data: Transaction[]
}

export function useGetZapperTransactions(address: Address, network: Network) {
  const fetcher = (url: string) =>
    fetch(url)
      .then(r => r.json())
      .then((r: ZapperTransactionsResponse) => r.data)
  const url = `${ZapperWebApi}/v2/transactions?addresses[]=${address}&network=${network}`
  const { data, error } = useSWR(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

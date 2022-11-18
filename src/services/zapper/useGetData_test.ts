import useSWR from 'swr'

import { ZAPPER_WEB_API } from '../config'
import { Address, Network, Transaction } from './types/models'

interface ZapperTransactionsResponse {
  data: Transaction[]
}

export function useGetZapperTransactions(address: Address, network: Network) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${ZAPPER_WEB_API}/v2/transactions?addresses[]=${address}&network=${network}`
  const { data, error } = useSWR<ZapperTransactionsResponse>(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

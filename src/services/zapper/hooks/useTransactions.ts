import Axios from 'axios'
import useSWR from 'swr'

import { ZAPPER_WEB_API } from '../../config'
import { TransactionsParam } from '../types/parameters/transactions'
import { TransactionResponse } from '../types/responses'

export function useGetTransactions({ network, address, addresses }: TransactionsParam) {
  const fetcher = (url: string) =>
    // Axios.get(url, {
    //   params: {
    //     address: address || null,
    //     addresses: addresses || null,
    //     network: network,
    //   },
    // }).then(res => res.data)
    fetch(url).then(r => r.json())
  const url = `${ZAPPER_WEB_API}/v2/transactions?addresses[]=${address}&network=${network}`
  const { data, error } = useSWR<TransactionResponse>(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

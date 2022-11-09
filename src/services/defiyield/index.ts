import useSWR from 'swr'

const DEFIYIELD_API = 'https://cors-defiyield.herokuapp.com/' + 'https://api.defiyield.app'

// /v1/transactions/new?addresses[]=0x42f9134e9d3bf7eee1f8a5ac2a4328b059e7468c

async function getTransactions(address: string) {
  const response = await fetch(`${DEFIYIELD_API}/v1/transactions/new?addresses[]=${address}`)
  const data = await response.json()
  return data
}

export function useGetTransactions(address: string) {
  const { data, error } = useSWR(address ? `defiyield-${address}` : null, () => getTransactions(address))
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useGetTransactionsStandard(address: string) {
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const url = `${DEFIYIELD_API}/v1/transactions/new?addresses[]=${address}`
  const { data, error } = useSWR(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

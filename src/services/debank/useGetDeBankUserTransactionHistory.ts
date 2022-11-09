import useSWR from 'swr'

export default function useGetUserTransactionHistory(address: string) {
  const { data, error } = useSWR(
    `https://api.debank.com/history/list?page_count=20&start_time=0&token_id=&user_addr=${address}`,
    async (url: string) => {
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        const result = json.data
        return result
      } else {
        throw Error(response.statusText)
      }
    },
  )

  return { isLoading: !data && !error, data, error }
}

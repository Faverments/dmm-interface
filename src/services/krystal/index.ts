import { KRYSTAL_API } from 'services/config'
import { ALL_NETWORKS } from 'services/zapper'
import useSWR from 'swr'

import { TokenApprovalsResponse } from './types'

export * from './types'

export function useGetTokenApprovals(address: string, networkId: number | ALL_NETWORKS) {
  let url = `${KRYSTAL_API}/all/v1/approval/list?address=${address}&chainIds=`
  if (networkId === 'all-networks') {
    url += '1,56,137,43114,25,250,42161,1313161554,10'
  } else {
    url += networkId
  }
  const { data, error } = useSWR<TokenApprovalsResponse>(url, async (url: string) => {
    const response = await fetch(url)
    if (response.ok) {
      const json = await response.json()
      const result = json.data
      return result
    } else {
      throw Error(response.statusText)
    }
  })

  return { isLoading: !data && !error, data, error }
}

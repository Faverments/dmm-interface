import Axios from 'axios'
import useSWR from 'swr'

import { ZAPPER_WEB_API } from '../../config'
import { AppDefinition, AppTokenPosition, ContractPosition, DefaultDataProps } from '../types/models'
import { AppGet, AppPositions, AppTokens } from '../types/parameters/apps'

export function useGetPositions({ appId, network, groupId }: AppPositions) {
  const url = `${ZAPPER_WEB_API}/v2/apps/${appId}/positions`
  const fetcher = (url: string) => Axios.get(url, { params: { network, groupId } }).then(res => res.data)
  const { data, error } = useSWR<AppTokenPosition<DefaultDataProps>>(url, fetcher)
  return {
    transactions: data,
    isLoading: !error && !data,
    isError: error,
  }
}

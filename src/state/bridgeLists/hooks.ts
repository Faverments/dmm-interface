import { ChainId } from '@kyberswap/ks-sdk-core'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { userSelectCurrency } from './actions'

export function useInitUserSelectCurrency(chainId: ChainId | undefined) {
  const userInit: any = useSelector<AppState, AppState['bridgeLists']['userSelectCurrency']>(
    state => state.bridgeLists.userSelectCurrency,
  )
  const dispatch = useDispatch<AppDispatch>()

  const setUserFromSelect = useCallback(
    ({ chainId, token, toChainId, tokenKey }: { chainId?: ChainId; token?: any; toChainId?: any; tokenKey?: any }) => {
      const id = chainId as any
      dispatch(userSelectCurrency({ chainId: id, token, toChainId, tokenKey }))
    },
    [dispatch],
  )

  const setUserToSelect = useCallback(
    ({ chainId, token, toChainId, tokenKey }: { chainId?: ChainId; token?: any; toChainId?: any; tokenKey?: any }) => {
      const id = chainId as any
      dispatch(userSelectCurrency({ chainId: id, token, toChainId, tokenKey }))
    },
    [dispatch],
  )

  return {
    userInit: userInit && chainId && userInit[chainId] ? userInit[chainId] : {},
    setUserFromSelect,
    setUserToSelect,
  }
}

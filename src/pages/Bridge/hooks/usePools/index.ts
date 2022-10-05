import { ChainId } from '@kyberswap/ks-sdk-core'
import { useCallback, useEffect, useState } from 'react'

import useInterval from 'hooks/useInterval'

import { useEvmPool, useEvmPools } from './evm'

export interface AddressList {
  anyTokenAddress: string
  underlyingAddress: string
}
// make array interface of AddressList
export type TokenListAddress = AddressList[]

export function usePool(chainId: ChainId, account: string, anyTokenAddress: string, underlyingAddress: string) {
  console.log('usePool', chainId, account, anyTokenAddress, underlyingAddress)
  const [poolData, setPoolData] = useState<any>()
  const { getEvmPoolsData } = useEvmPool(chainId, account, anyTokenAddress, underlyingAddress)

  const fetchPoolCallBack = useCallback(() => {
    if (!isNaN(chainId)) {
      getEvmPoolsData().then((res: any) => {
        setPoolData(res)
      })
    }
  }, [chainId, getEvmPoolsData, account, anyTokenAddress, underlyingAddress])

  useEffect(() => {
    fetchPoolCallBack()
  }, [chainId, account, anyTokenAddress])

  useInterval(fetchPoolCallBack, 1000 * 10)

  return { poolData }
}

export function usePools({
  account,
  tokenListAddress,
  chainId,
}: {
  account: string
  tokenListAddress: TokenListAddress
  chainId: ChainId
}) {
  // const {selectNetworkInfo} = useUserSelectChainId()
  const [poolData, setPoolData] = useState<any>()
  const { getEvmPoolsData } = useEvmPools({
    account,
    tokenListAddress,
    chainId,
  })

  const fetchPoolCallback = useCallback(() => {
    // let fetchCallback:any
    if (!isNaN(chainId)) {
      // fetchCallback = getEvmPoolsData
      getEvmPoolsData().then((res: any) => {
        // console.log(res)
        setPoolData(res)
      })
    }
  }, [chainId, getEvmPoolsData])

  useEffect(() => {
    if (chainId) {
      fetchPoolCallback()
    }
  }, [chainId, getEvmPoolsData])

  useInterval(fetchPoolCallback, 1000 * 10)

  return { poolData }
}

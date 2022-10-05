import { ChainId } from '@kyberswap/ks-sdk-core'
import React, { useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from 'hooks'

import { FormatDestCurrency, FormatDestCurrencyList, calcReceiveValueAndFee, useGetFTMSelectPool } from '../hooks'
import { BridgeToken } from '../hooks/useGetBridgeTokenList'
import { TokenListAddress, usePools } from '../hooks/usePools/index'
import { BigAmount } from '../utils/formatBigNumber'
import { thousandBit } from '../utils/tools'

export interface Router extends FormatDestCurrency {
  poolLiquidity: any
  poolLiquiditySort: any
  poolMyLiquidity: any
  fee: any
}

export default function RouterList({
  selectCurrency,
  selectDestChainId,
  selectDestKey,
  routerList,
  inputBridgeValue,
  sortType,
  isUserSelect,
  onUserCurrencySelect,
  onCurrencySelect,
}: {
  selectCurrency: BridgeToken | undefined
  selectDestChainId: string | undefined
  selectDestKey: string
  routerList: FormatDestCurrencyList | undefined
  inputBridgeValue: any // **TODO** : type
  sortType: string
  isUserSelect: boolean
  onUserCurrencySelect?: (currency: BridgeToken) => void
  onCurrencySelect?: (currency: BridgeToken) => void
}) {
  const { account, chainId } = useActiveWeb3React()
  const [viewList, setViewList] = useState<any>([]) // **TODO** : type

  const tokenListAddress = useMemo(() => {
    const arr = []
    for (const k in routerList) {
      const obj = routerList[k]
      if (obj.isLiquidity && obj?.underlying?.address) {
        arr.push({
          anyTokenAddress: obj.anytoken.address,
          underlyingAddress: obj.underlying.address,
        })
      }
    }
    return arr
  }, [routerList])

  const ftmConfig: FormatDestCurrency | Record<string, never> = useMemo(() => {
    for (const k in routerList) {
      const obj = routerList[k]
      if (obj.address === 'FTM') {
        return obj
      }
    }
    return {}
  }, [routerList])

  const { destChain: destFTMChain } = useGetFTMSelectPool(selectCurrency, chainId, selectDestChainId, ftmConfig)

  const feeList = useMemo(() => {
    const list: any = {} // **TODO** : type
    for (const k in routerList) {
      const obj = routerList[k]
      if (inputBridgeValue) {
        list[k] = calcReceiveValueAndFee(inputBridgeValue, obj, obj.decimals)
        if (!list[k].fee) {
          list[k] = { fee: obj.MinimumSwapFee }
        }
      } else {
        list[k] = { fee: obj.MinimumSwapFee }
      }
    }
    return list
  }, [inputBridgeValue, routerList])

  const { poolData } = usePools({ account, tokenListAddress, chainId } as unknown as {
    account: string
    tokenListAddress: TokenListAddress
    chainId: ChainId
  }) // **TODO** : type

  const useFTMPool = useMemo(() => {
    // console.log(destFTMChain)
    if (selectDestChainId === '250' && ftmConfig?.address === 'FTM' && destFTMChain?.ts) {
      return destFTMChain?.ts
    }
    return ''
  }, [destFTMChain, selectDestChainId, ftmConfig])

  useEffect(() => {
    const viewListDraft = []
    if (routerList && feeList) {
      for (const k in routerList) {
        const router = routerList[k]
        let poolLiquidity: any = '-'
        let poolLiquiditySort: any = 0
        let poolMyLiquidity: any = '-'
        if (router.isLiquidity) {
          if (useFTMPool && ['swapin', 'swapout'].includes(router.type)) {
            poolLiquidity = thousandBit(useFTMPool, 2)
            poolLiquiditySort = useFTMPool ? Number(useFTMPool) : 0
          } else {
            const pool = poolData?.[router?.anytoken?.address] ? poolData?.[router?.anytoken?.address] : ''
            // poolLiquidity = pool?.balanceOf ? BigAmount.format(router?.decimals, pool.balanceOf).toExact() : ''
            poolLiquidity = pool?.balanceOf ? BigAmount.format(router?.decimals, pool.balanceOf) : ''
            poolLiquiditySort = poolLiquidity ? Number(poolLiquidity) : 0
            poolLiquidity = poolLiquidity ? thousandBit(poolLiquidity, 2) : ''
            // poolMyLiquidity = pool?.balance ? BigAmount.format(router?.decimals, pool.balance).toExact() : ''
            poolMyLiquidity = pool?.balance ? BigAmount.format(router?.decimals, pool.balance) : ''
            poolMyLiquidity = poolMyLiquidity ? thousandBit(poolMyLiquidity, 2) : ''
          }
        } else {
          poolLiquidity = 'Unlimited'
          poolLiquiditySort = 1e32
        }
        viewListDraft.push({
          ...router,
          poolLiquidity,
          poolLiquiditySort,
          poolMyLiquidity,
          fee: feeList?.[router.key]?.fee ? Number(feeList?.[router.key]?.fee) : 0,
        })
      }

      if (sortType === 'LIQUIDITYUP') {
        viewListDraft.sort((a: any, b: any) => {
          if (a.poolLiquiditySort > b.poolLiquiditySort) {
            return -1
          }
          return 1
        })
      }
    }

    setViewList(viewListDraft)
    // }, [routerList, poolData, feeList, sortType, selectDestChainId, selectDestKey, useFTMPool])
  }, [routerList, feeList, sortType, selectDestChainId, selectDestKey, useFTMPool])

  useEffect(() => {
    if (onCurrencySelect && viewList.length > 0 && !isUserSelect) {
      onCurrencySelect(viewList[0])
    }
  }, [viewList, isUserSelect])

  console.log('viewList', viewList)

  return <div>RouterList</div>
}

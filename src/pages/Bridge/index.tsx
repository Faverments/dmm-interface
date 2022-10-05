import { ChainId, Currency as KyberCurrency, CurrencyAmount as KyberCurrencyAmount } from '@kyberswap/ks-sdk-core'
import { t } from '@lingui/macro'
import { Token } from 'graphql'
import { useEffect, useMemo, useState } from 'react'

import { AutoColumn } from 'components/Column'
import { useActiveWeb3React } from 'hooks'
import { useActiveNetwork } from 'hooks/useActiveNetwork'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useWalletModalToggle } from 'state/application/hooks'
import { useInitUserSelectCurrency } from 'state/bridgeLists/hooks'
import { isAddress } from 'utils'

import RouterList, { Router } from './components/RouterList'
import config from './config'
import {
  FormatDestCurrencyList,
  tryParseAmount,
  useGetFTMSelectPool,
  useGetInitDestChainId,
  useGetInitDestCurrency,
  useInitSelectCurrency,
  useLocalToken,
} from './hooks'
import useGetBridgeTokenList, { BridgeToken } from './hooks/useGetBridgeTokenList'
import { usePool } from './hooks/usePools/index'
import { BigAmount } from './utils/formatBigNumber'

export default function Bridge() {
  const { chainId, account } = useActiveWeb3React()

  const { data: tokenListResponse } = useGetBridgeTokenList(chainId || 1)
  const allTokensList = tokenListResponse ? tokenListResponse : {}
  const toggleWalletModal = useWalletModalToggle()

  const { setUserFromSelect, setUserToSelect } = useInitUserSelectCurrency(chainId)

  const { bridgtoken, toChainId } = useParsedQueryString()
  let initBridgeToken = bridgtoken ? bridgtoken : ''
  initBridgeToken = initBridgeToken ? (initBridgeToken as string).toLowerCase() : ''

  const initSelectCurrencyKey = initBridgeToken ? 'evm' + initBridgeToken : ''

  let initToChainId = toChainId ? toChainId : ''
  initToChainId = initToChainId ? (initToChainId as string).toLowerCase() : ''

  const [inputBridgeValue, setInputBridgeValue] = useState<any>('')

  const [selectDestChainId, setSelectDestChainId] = useState<string | undefined>(initToChainId)

  const [selectChainList, setSelectChainList] = useState<Array<any>>([])

  const [selectCurrency, setSelectCurrency] = useState<BridgeToken | undefined>(
    allTokensList?.[initSelectCurrencyKey] ? allTokensList[initSelectCurrencyKey] : undefined,
  )
  useInitSelectCurrency(allTokensList, chainId, setSelectCurrency)

  console.log('selectCurrency', selectCurrency)

  const { initChainId, initChainList } = useGetInitDestChainId(selectCurrency, selectDestChainId, chainId) // **TODO**: Wrong Dest ChainId like AnySwap

  useEffect(() => {
    setSelectDestChainId(initChainId)
  }, [initChainId, selectCurrency])

  useEffect(() => {
    setSelectChainList(initChainList)
  }, [initChainList])

  console.log('selectDestChainId', selectDestChainId)
  console.log('selectChainList', selectChainList)

  const [selectDestCurrency, setSelectDestCurrency] = useState<any>()

  const [selectDestCurrencyList, setSelectDestCurrencyList] = useState<FormatDestCurrencyList>()

  // initDestCurrency set default value in RouterList, not set in this Parent Component **NOTICE**
  const { initDestCurrency, initDestCurrencyList } = useGetInitDestCurrency(
    selectCurrency,
    selectCurrency?.destChains?.[selectDestChainId as unknown as string],
  )

  useEffect(() => {
    setSelectDestCurrencyList(initDestCurrencyList)
  }, [initDestCurrencyList])

  console.log('selectDestCurrency', selectDestCurrency)

  console.log('selectDestCurrencyList', selectDestCurrencyList)

  const [recipient, setRecipient] = useState<string>(account ?? '')
  const [swapType, setSwapType] = useState('swap')
  const [isUserSelect, setIsUserSelect] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTipOpen, setModalTipOpen] = useState(false)

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const [delayAction, setDelayAction] = useState<boolean>(false)

  const [curChain, setCurChain] = useState<any>({
    chain: chainId,
    ts: '',
    bl: '',
  })

  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(chainId).bridgeInitChain,
    ts: '',
    bl: '',
  })

  const destConfig: Router | undefined = useMemo(() => {
    if (selectDestCurrency) {
      return selectDestCurrency
    }
    return undefined
  }, [selectDestCurrency])

  const isRouter = useMemo(() => {
    if (['swapin', 'swapout'].includes(destConfig?.type as string)) {
      return false
    }
    return true
  }, [destConfig])

  const isApprove = useMemo(() => {
    return destConfig?.isApprove
  }, [destConfig])

  const isLiquidity = useMemo(() => {
    return destConfig?.isLiquidity
  }, [destConfig])

  const useSwapMethods = useMemo(() => {
    return destConfig?.routerABI
  }, [destConfig])

  const isNativeToken = useMemo(() => {
    console.log(selectCurrency)
    if (selectCurrency && selectCurrency?.tokenType === 'NATIVE') {
      return true
    }
    return false
  }, [selectCurrency])

  const anyToken = useMemo(() => {
    if (destConfig?.fromanytoken) {
      return destConfig.fromanytoken
    }
    return undefined
  }, [destConfig?.fromanytoken])

  const isDestUnderlying = useMemo(() => {
    if (destConfig?.underlying) {
      return true
    }
    return false
  }, [destConfig])

  const routerToken = useMemo(() => {
    if (destConfig?.router && isAddress(destConfig?.router)) {
      return destConfig?.router
    }
    return undefined
  }, [destConfig])

  const approveSpender = useMemo(() => {
    if (destConfig?.isApprove) {
      if (isRouter) {
        return destConfig?.spender
      } else {
        return destConfig?.fromanytoken?.address
      }
    }
    return undefined
  }, [destConfig, isRouter, routerToken])

  const isBridgeFTM = useMemo(() => {
    if (destConfig?.address === 'FTM' || destConfig?.fromanytoken?.address === 'FTM') {
      return true
    }
    return false
  }, [destConfig])

  const formatCurrency = useLocalToken(selectCurrency)
  const formatInputBridgeValue = tryParseAmount(
    inputBridgeValue,
    formatCurrency && isApprove ? formatCurrency : undefined,
  )

  const [approval, approveCallback] = useApproveCallback(
    (formatInputBridgeValue && isApprove
      ? formatInputBridgeValue
      : undefined) as unknown as KyberCurrencyAmount<KyberCurrency>,
    approveSpender,
  )

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  function onDelay() {
    setDelayAction(true)
  }
  function onClear(type?: any) {
    setDelayAction(false)
    setModalTipOpen(false)
    if (!type) {
      setInputBridgeValue('')
    }
  }

  // function changeNetwork(chainID: any) {
  //   selectNetwork(chainID).then((res: any) => {
  //     console.log(res)
  //     if (res.msg === 'Error') {
  //       alert(t('changeMetamaskNetwork', { label: config.getCurChainInfo(chainID).networkName }))
  //     }
  //   })
  // }

  const { changeNetwork } = useActiveNetwork()

  const { curChain: curFTMChain, destChain: destFTMChain } = useGetFTMSelectPool(
    selectCurrency,
    chainId,
    selectDestChainId,
    destConfig,
  )

  const { poolData } = usePool(
    chainId as unknown as ChainId,
    account as string,
    (destConfig?.isFromLiquidity && !isBridgeFTM && destConfig?.isLiquidity ? anyToken?.address : undefined) as string,
    selectCurrency?.address as string,
  )

  const { poolData: destPoolData } = usePool(
    selectDestChainId as unknown as ChainId,
    account as string,
    (destConfig?.isLiquidity && !isBridgeFTM ? destConfig?.anytoken?.address : undefined) as string,
    destConfig?.underlying?.address as string,
  )

  useEffect(() => {
    setDestChain(undefined)
  }, [selectDestChainId, selectCurrency, chainId])

  useEffect(() => {
    if (poolData && anyToken?.address && !isBridgeFTM && poolData?.[anyToken?.address]?.balanceOf) {
      setCurChain({
        chain: chainId,
        ts: BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balanceOf).toExact(),
        bl: poolData[anyToken?.address]?.balance
          ? BigAmount.format(anyToken?.decimals, poolData[anyToken?.address]?.balance).toExact()
          : '',
      })
    } else if (isBridgeFTM && curFTMChain) {
      setCurChain({
        ...curFTMChain,
      })
    } else {
      setCurChain({})
    }
  }, [poolData, anyToken, curFTMChain, isBridgeFTM])

  useEffect(() => {
    if (
      destPoolData &&
      destConfig?.anytoken?.address &&
      !isBridgeFTM &&
      destPoolData?.[destConfig?.anytoken?.address]?.balanceOf
    ) {
      setDestChain({
        chain: selectDestChainId,
        ts: BigAmount.format(
          destConfig?.anytoken?.decimals,
          destPoolData[destConfig?.anytoken?.address]?.balanceOf,
        ).toExact(),
        bl: destPoolData[destConfig?.anytoken?.address]?.balance
          ? BigAmount.format(
              destConfig?.anytoken?.decimals,
              destPoolData[destConfig?.anytoken?.address]?.balance,
            ).toExact()
          : '',
      })
    } else if (isBridgeFTM && destFTMChain) {
      setDestChain({
        ...destFTMChain,
      })
    } else {
      setDestChain({})
    }
  }, [destPoolData, destConfig, destFTMChain, isBridgeFTM])

  return (
    <>
      <AutoColumn gap="sm">
        {/* unknown error */}
        <RouterList
          selectCurrency={selectCurrency}
          selectDestChainId={selectDestChainId}
          selectDestKey={destConfig?.key as string}
          routerList={selectDestCurrencyList}
          inputBridgeValue={inputBridgeValue}
          sortType={'LIQUIDITYUP'}
          isUserSelect={isUserSelect}
          onUserCurrencySelect={inputCurrency => {
            setSelectDestCurrency(inputCurrency)
            setIsUserSelect(true)
          }}
          onCurrencySelect={inputCurrency => {
            setSelectDestCurrency(inputCurrency)
          }}
        />
      </AutoColumn>
    </>
  )
}

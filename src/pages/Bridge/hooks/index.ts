import { parseUnits } from '@ethersproject/units'
import { ChainId } from '@kyberswap/ks-sdk-core'
import { number } from '@lingui/core/cjs/formats'
import { Currency, CurrencyAmount, JSBI, Token, TokenAmount } from 'anyswap-sdk'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useActiveWeb3React } from 'hooks'
import { isAddress } from 'utils'

import config from '../config'
import { supportChainArr } from '../config/chainConfig'
import { getNodeBalance } from '../utils/getBalanceV2'
import { formatDecimal, thousandBit } from '../utils/tools'
import { BridgeToken, BridgeTokenList, DestCurrency, DestCurrencyList } from './useGetBridgeTokenList'

export interface FormatDestCurrency extends DestCurrency {
  key: string
  logoUrl: string
}

export interface FormatDestCurrencyList {
  [tokenAddress: string]: FormatDestCurrency
}

export function useInitSelectCurrency(
  allTokensList: BridgeTokenList,
  chainId: ChainId | undefined,
  setSelectCurrency: React.Dispatch<React.SetStateAction<BridgeToken | undefined>>,
) {
  return useEffect(() => {
    let t = []
    if (config.getCurChainInfo(chainId)?.bridgeInitToken || config.getCurChainInfo(chainId)?.crossBridgeInitToken) {
      if (config.getCurChainInfo(chainId)?.bridgeInitToken) {
        t.push(config.getCurChainInfo(chainId)?.bridgeInitToken?.toLowerCase())
      } else if (config.getCurChainInfo(chainId)?.crossBridgeInitToken) {
        t.push(config.getCurChainInfo(chainId)?.crossBridgeInitToken?.toLowerCase())
      }
    } else {
      t = [config.getCurChainInfo(chainId)?.symbol]
    }

    const list: any = {}

    let initCurrency: any
    console.log(allTokensList)
    let useToken = ''
    if (Object.keys(allTokensList).length > 0) {
      let noMatchInitToken = ''
      for (const tokenKey in allTokensList) {
        const item = allTokensList[tokenKey]
        const token = item.address
        list[tokenKey] = {
          ...((item as any).tokenInfo ? (item as any).tokenInfo : item),
          key: tokenKey,
        }
        if (!list[tokenKey].name || !list[tokenKey].symbol) continue
        if (!noMatchInitToken) noMatchInitToken = tokenKey
        if (!useToken) {
          if (
            t.includes(token?.toLowerCase()) ||
            t.includes(list[tokenKey]?.symbol?.toLowerCase()) ||
            t.includes(tokenKey?.toLowerCase())
          ) {
            useToken = tokenKey
          }
        }
      }
      if (useToken && list[useToken].chainId === chainId?.toString()) {
        initCurrency = list[useToken]
      } else if (noMatchInitToken && list[noMatchInitToken].chainId === chainId?.toString()) {
        initCurrency = list[noMatchInitToken]
      }
    }
    setSelectCurrency(initCurrency)
  }, [allTokensList, chainId, setSelectCurrency])
}

export function useGetInitDestCurrency(selectCurrency?: BridgeToken, selectDestCurrencyList?: DestCurrencyList) {
  const [initDestCurrency, setInitDestCurrency] = useState<FormatDestCurrency>()
  const [initDestCurrencyList, setInitDestCurrencyList] = useState<FormatDestCurrencyList>({})
  useEffect(() => {
    if (selectDestCurrencyList) {
      const dl = selectDestCurrencyList
      const formatDl: FormatDestCurrencyList = {}
      for (const t in dl) {
        formatDl[t] = {
          ...dl[t],
          key: t,
          logoUrl: selectCurrency?.logoUrl as string,
        }
      }
      const destTokenAddressList = Object.keys(formatDl)
      let destTokenMinKey = ''

      for (const tokenKey of destTokenAddressList) {
        if (!destTokenMinKey) destTokenMinKey = tokenKey
        if (formatDl[destTokenMinKey].sortId > formatDl[tokenKey].sortId) {
          destTokenMinKey = tokenKey
        }
      }
      try {
        setInitDestCurrency(formatDl[destTokenMinKey])
        setInitDestCurrencyList(formatDl)
      } catch (error) {
        console.log(error)
      }
    }
  }, [selectDestCurrencyList])
  return {
    initDestCurrency,
    initDestCurrencyList,
  }
}

export function useGetInitDestChainId(selectCurrency?: BridgeToken, selectDestChain?: string, chainId?: ChainId) {
  const [initChainId, setInitChainId] = useState<string>()
  const [initChainList, setInitChainList] = useState<string[]>([])
  useEffect(() => {
    if (selectCurrency) {
      const chainArr: string[] = []
      for (const c in selectCurrency?.destChains) {
        if (c.toString() === chainId?.toString() || !supportChainArr.includes(c)) continue
        chainArr.push(c)
      }

      let useChain
      if (selectDestChain && chainArr.includes(selectDestChain.toString())) {
        useChain = selectDestChain
      } else {
        useChain = config.getCurChainInfo(selectDestChain).bridgeInitChain
      }

      if (chainArr.length > 0) {
        if (!useChain || (useChain && !chainArr.includes(useChain))) {
          for (const c of chainArr) {
            if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
            useChain = c
            break
          }
        }
      }

      setInitChainId(useChain)
      setInitChainList(chainArr)
    }
    // else {
    //   setInitChainId('')
    //   setInitChainList([])
    // }
  }, [selectCurrency])

  return {
    initChainId,
    initChainList,
  }
}

export function useLocalToken(currency?: BridgeToken): Token | undefined | null {
  const { chainId } = useActiveWeb3React()

  // const address = isAddress(currency?.address)
  const address = isAddress(currency?.address)

  const symbol = currency?.symbol
  const name = currency?.name
  const decimals: any = currency?.decimals
  const underlying = (currency as any)?.underlying

  const ContractVersion = (currency as any)?.ContractVersion
  const destChains = currency?.destChains
  const logoUrl = currency?.logoUrl
  const price = currency?.price

  // const token = address && name ? undefined : useToken(address ? address : undefined)
  // console.log(token)
  // console.log(address)
  // console.log(currency)
  return useMemo(() => {
    if (!currency) return undefined
    // if (!chainId || !address) return undefined
    if (!chainId || !address) return undefined
    // if (token) return token
    return new Token(
      chainId as any,
      address,
      decimals,
      symbol,
      name,
      underlying,
      ContractVersion,
      destChains,
      logoUrl,
      price,
    )
  }, [address, chainId, symbol, decimals, name, underlying, ContractVersion, destChains, logoUrl, price])
}

export function calcReceiveValueAndFee(inputBridgeValue: any, destConfig: any, decimals: any) {
  if (inputBridgeValue && destConfig) {
    const minFee = destConfig.BaseFeePercent
      ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100
      : destConfig.MinimumSwapFee
    const baseFee = destConfig.BaseFeePercent ? (minFee * destConfig.BaseFeePercent) / 100 : 0
    let fee = (Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion)) / 100
    let value: any = Number(inputBridgeValue) - fee
    // console.log(minFee)
    // console.log(baseFee)
    if (fee < Number(minFee)) {
      fee = Number(minFee)
    } else if (fee > destConfig.MaximumSwapFee) {
      fee = Number(destConfig.MaximumSwapFee)
    } else {
      fee = fee
    }
    value = Number(inputBridgeValue) - fee - baseFee
    // console.log(value)
    if (value && Number(value) && Number(value) > 0) {
      const dec = Math.min(6, decimals)
      value = value.toFixed(Math.min(7, decimals))
      return {
        fee: fee,
        outputBridgeValue: thousandBit(formatDecimal(value, dec), 'no'),
      }
    }
    return {
      fee: '',
      outputBridgeValue: '',
    }
  } else {
    return {
      fee: '',
      outputBridgeValue: '',
    }
  }
}

export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

export function useGetFTMSelectPool(selectCurrency: any, chainId: any, selectChain: any, destConfig: any) {
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
  const getFTMSelectPool = useCallback(async () => {
    if (
      selectCurrency &&
      chainId &&
      (destConfig.isLiquidity || destConfig.isFromLiquidity) &&
      (destConfig?.address === 'FTM' || destConfig.fromanytoken?.address === 'FTM')
    ) {
      // console.log(selectCurrency)
      const curChain = destConfig.isFromLiquidity ? chainId : selectChain
      const destChain = destConfig.isFromLiquidity ? selectChain : chainId
      // const tokenA = destConfig.isFromLiquidity ? selectCurrency : destConfig
      const dec = selectCurrency?.decimals

      const CC: any = await getNodeBalance(
        chainId?.toString() === '1' ? destConfig.fromanytoken?.address : destConfig?.address,
        chainId?.toString() === '1' ? selectCurrency?.address : destConfig?.address,
        curChain,
        dec,
      )
      let DC: any = ''
      // console.log(!isNaN(selectChain))
      DC = await getNodeBalance(destConfig?.DepositAddress, selectCurrency.symbol, destChain, dec)
      // console.log(curChain)
      // console.log(CC)
      // console.log(destChain)
      // console.log(DC)
      if (CC) {
        if (chainId?.toString() === '1') {
          setCurChain({
            chain: chainId,
            ts: CC,
          })
        } else {
          setDestChain({
            chain: selectChain,
            ts: CC,
          })
        }
      }
      // console.log(DC)
      if (DC) {
        if (chainId?.toString() === '1') {
          setDestChain({
            chain: selectChain,
            ts: DC,
          })
        } else {
          setCurChain({
            chain: chainId,
            ts: DC,
          })
        }
      }
    }
  }, [selectCurrency, chainId, selectChain, destConfig])
  useEffect(() => {
    getFTMSelectPool()
  }, [selectCurrency, chainId, selectChain, destConfig])
  return {
    curChain,
    destChain,
  }
}

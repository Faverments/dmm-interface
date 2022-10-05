import { ChainId } from '@kyberswap/ks-sdk-core'
import useSWR from 'swr'

import { bridgeApi } from '../config/constant'

export interface AnyToken {
  address: string
  name: string
  symbol: string
  decimals: number
}

export interface FromAnyToken {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: string
}

export interface UnderlyingToken {
  address: string
  decimals: number
  name: string
  symbol: string
}

export interface DestCurrency {
  address: string
  name: string
  symbol: string
  decimals: number
  anytoken: AnyToken
  fromanytoken: FromAnyToken
  underlying: UnderlyingToken
  type: string
  router: string
  tokenid: string
  routerABI: string
  isLiquidity: boolean
  isApprove: boolean
  isFromLiquidity: boolean
  spender: string
  BigValueThreshold: string
  MaximumSwap: string
  MaximumSwapFee: string
  MinimumSwap: string
  MinimumSwapFee: string
  SwapFeeRatePerMillion: number
  pairid: string
  DepositAddress: string
  BaseFeePercent: string
  sortId: number
  tokenType: string
  chainId: string
}

export interface DestCurrencyList {
  [tokenAddress: string]: DestCurrency
}

// type ChainIdString = `${ChainId}`;

export interface BridgeToken {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: string
  price: number
  logoUrl: string
  destChains: {
    [chainId: string]: DestCurrencyList
  }
  tokenType: string
}

export interface BridgeTokenList {
  [tokenAddressKey: string]: BridgeToken
}

export default function useGetBridgeTokenList(chainId: ChainId) {
  const { data, error } = useSWR(`${bridgeApi}/v4/poollist/${chainId}`, async (url: string) => {
    const response = await fetch(url)
    if (response.ok) {
      const json: BridgeTokenList = await response.json()
      return json
    }
    throw new Error('Failed to fetch API')
  })
  return { isLoading: !data && !error, data, error }
}

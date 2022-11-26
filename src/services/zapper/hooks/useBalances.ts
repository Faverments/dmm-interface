import { t } from '@lingui/macro'
import React, { useEffect, useMemo } from 'react'

import { NotificationType, useNotify } from 'state/application/hooks'

import { ZAPPER_WEB_API } from '../../config'
import { ALL_NETWORKS, EachBalance, Network, PresentedBalancePayload } from '../types/models'
import { BalancesGet } from '../types/parameters'

// export interface MessageEvent {
//   appId: string
//   network: string
//   addresses: string[]
//   balance: any
//   totals: any[]
//   error: any[]
// }

// export type TokensMessageEvent = MessageEvent

// export interface ProtocolsMessageEvent extends MessageEvent {
//   app: {
//     appId: string
//     network: string
//     data: any[]
//   }
// }

// export type ListTokensMessageEvent = Array<TokensMessageEvent>

// export type ListProtocolsMessageEvent = Array<ProtocolsMessageEvent>

export function useGetBalancesEventStream({ addresses, networks, bundled }: BalancesGet) {
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [error, setError] = React.useState<Error>()
  // const [protocols, setProtocols] = React.useState<ListProtocolsMessageEvent>([])
  // const [tokens, setTokens] = React.useState<ListProtocolsMessageEvent>([])
  const [data, setData] = React.useState<PresentedBalancePayload[]>([])
  const [currentMessageData, setCurrentMessageData] = React.useState<PresentedBalancePayload>()
  const notify = useNotify()
  // const fetchRef = useRef(0)

  useEffect(() => {
    // prevent useEffect from running on double render
    // fetchRef.current = ++fetchRef.current
    // if (fetchRef.current === 2) return

    setData([])
    setCurrentMessageData(undefined)
    setIsSyncing(true)

    let eventSource: EventSource

    try {
      // const url = `https://web.zapper.fi/v2/balances?addresses[0]=${addresses[0]}&networks[0]=ethereum&networks[1]=polygon&networks[2]=optimism&networks[3]=gnosis&networks[4]=binance-smart-chain&networks[5]=fantom&networks[6]=avalanche&networks[7]=arbitrum&networks[8]=celo&networks[9]=harmony&networks[10]=moonriver&networks[11]=bitcoin&networks[12]=cronos&networks[13]=aurora&networks[14]=evmos&nonNilOnly=true&useNewBalancesFormat=true&useNftService=true`
      let url = `${ZAPPER_WEB_API}/v2/balances?`
      addresses?.forEach((address, index) => {
        url += `addresses[${index}]=${address}&`
      })
      networks?.forEach((network, index) => {
        url += `networks[${index}]=${network}&`
      })
      url += `nonNilOnly=true&useNewBalancesFormat=true&useNftService=true`
      eventSource = new EventSource(url)

      eventSource.addEventListener('balance', function (e) {
        console.log('EVENT : balance')
        const jsonData = JSON.parse(e.data)
        // if (jsonData.appId === 'tokens') {
        //   setTokens((preState: any) => {
        //     return [...preState, jsonData]
        //   })
        // } else {
        //   setProtocols((prevState: any) => {
        //     return [...prevState, jsonData]
        //   })
        // }
        setData(prevState => {
          return [...prevState, jsonData]
        })
        setCurrentMessageData(jsonData)
      })
      eventSource.addEventListener('end', function (e) {
        console.log('EVENT : end')
        setIsSyncing(false)
        eventSource.close()
      })

      eventSource.onerror = function (e) {
        console.log(' Receive EVENT : error')
        console.log(e)
        setIsSyncing(false)
        // setData([])
        setError(new Error('Error fetching balances'))
        notify({
          title: t`Error while fetching balances`,
          summary: t`This is likely you make too many requests. Please try again later.`,
          type: NotificationType.ERROR,
        })
        eventSource.close()
      }
    } catch (error) {
      console.log('Catch EVENT : error')
      console.log(error)
      setError(error)
    }
    return () => {
      eventSource.close()
    }
  }, [JSON.stringify(addresses), JSON.stringify(networks)])

  // return { data: { protocols, tokens }, isSyncing, error }
  return useMemo(() => ({ isSyncing, data, currentMessageData, error }), [data, currentMessageData, isSyncing, error])
}

export function useTotalsBalances(data: PresentedBalancePayload[], selectedChain: Network | ALL_NETWORKS) {
  return useMemo(() => {
    const tokens = { total: 0 }
    if (data.length === 0) {
    } else {
      data.forEach(balances => {
        // if (balances.appId === 'tokens') {
        balances.totals.forEach(partial => {
          tokens.total += partial.balanceUSD
        })
        // }
      })
    }
    return tokens
  }, [data])
}

export function useTotalsWalletBalances(data: PresentedBalancePayload[], selectedChain: Network | ALL_NETWORKS) {
  return useMemo(() => {
    const tokens = { total: 0 }
    if (data.length === 0) {
    } else {
      data.forEach(balances => {
        if (balances.appId === 'tokens') {
          balances.totals.forEach(partial => {
            tokens.total += partial.balanceUSD
          })
        }
      })
    }
    return tokens
  }, [data])
}

export function useChainBalances(data: PresentedBalancePayload[]) {
  return useMemo(() => {
    const tokens = {
      [Network.ETHEREUM_MAINNET]: { total: 0 },
      [Network.POLYGON_MAINNET]: { total: 0 },
      [Network.OPTIMISM_MAINNET]: { total: 0 },
      // [Network.GNOSIS_MAINNET]: { total: 0 },
      [Network.BINANCE_SMART_CHAIN_MAINNET]: { total: 0 },
      [Network.FANTOM_OPERA_MAINNET]: { total: 0 },
      [Network.AVALANCHE_MAINNET]: { total: 0 },
      [Network.ARBITRUM_MAINNET]: { total: 0 },
      // [Network.CELO_MAINNET]: { total: 0 },
      // [Network.HARMONY_MAINNET]: { total: 0 },
      // [Network.MOONRIVER_MAINNET]: { total: 0 },
      // [Network.BITCOIN_MAINNET]: { total: 0 },
      [Network.CRONOS_MAINNET]: { total: 0 },
      [Network.AURORA_MAINNET]: { total: 0 },
      // [Network.EVMOS_MAINNET]: { total: 0 },
    }
    if (data.length === 0) {
    } else {
      data.forEach(balances => {
        // if (balances.appId === 'tokens') {
        balances.totals.forEach(partial => {
          tokens[partial.network as Network].total += partial.balanceUSD
          // ;(tokens[partial.network as Network] as any).logo = (balances.balance.wallet as any)[
          //   partial.key
          // ].displayProps.images[0]
        })
        // }
      })
    }
    return tokens
  }, [data])
}

interface WalletChain {
  totals: number
  details: EachBalance | Record<string, unknown>
}

export interface WalletDetails {
  [key: string]: WalletChain
}

export function useWalletBalances(data: PresentedBalancePayload[]) {
  return useMemo(() => {
    const wallets: WalletDetails = {}

    if (data.length === 0) {
    } else {
      data.forEach(balances => {
        if (balances.appId === 'tokens') {
          const obj: WalletChain = {
            totals: 0,
            details: balances.balance.wallet,
          }
          // Object.values<any>(balances.balance.wallet).forEach(
          //   (token: TokenBreakdown) => (obj.totals += token.balanceUSD),
          // )
          balances.totals.forEach(partial => {
            obj.totals += partial.balanceUSD
          })
          wallets[balances.network] = obj
        }
      })
    }
    return wallets
  }, [data])
}

interface App {
  totals: number
  details: PresentedBalancePayload
}

interface AppDetails {
  [key: string]: App
}

export function useAppBalances(data: PresentedBalancePayload[], network: Network | ALL_NETWORKS) {
  return useMemo(() => {
    const Apps: AppDetails = {}

    if (data.length === 0) {
    } else {
      data.forEach(balances => {
        if (balances.appId !== 'tokens') {
          const obj: App = {
            totals: 0,
            details: balances,
          }
          balances.totals.forEach(partial => {
            obj.totals += partial.balanceUSD
          })
          if (network === 'all-networks') {
            Apps[balances.appId] = obj
          } else {
            if (balances.network === network) {
              Apps[balances.appId] = obj
            }
          }
        }
      })
    }
    return Apps
  }, [data, network])
}

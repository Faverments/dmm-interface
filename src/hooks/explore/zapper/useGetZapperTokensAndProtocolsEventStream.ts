import React, { useEffect } from 'react'

export interface MessageEvent {
  appId: string
  network: string
  addresses: string[]
  balance: any
  totals: any[]
  error: any[]
}

export type TokensMessageEvent = MessageEvent

export interface ProtocolsMessageEvent extends MessageEvent {
  app: {
    appId: string
    network: string
    data: any[]
  }
}

export type ListTokensMessageEvent = Array<TokensMessageEvent>

export type ListProtocolsMessageEvent = Array<ProtocolsMessageEvent>

export default function useGetTokensAndProtocolsEventStream(address: string) {
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [error, setError] = React.useState<Error>()
  const [protocols, setProtocols] = React.useState<ListProtocolsMessageEvent>([])
  const [tokens, setTokens] = React.useState<ListProtocolsMessageEvent>([])
  // const [data, setData] = React.useState<ListMessageEvent>([])
  useEffect(() => {
    try {
      const url = `https://web.zapper.fi/v2/balances?addresses[0]=${address}&networks[0]=ethereum&networks[1]=polygon&networks[2]=optimism&networks[3]=gnosis&networks[4]=binance-smart-chain&networks[5]=fantom&networks[6]=avalanche&networks[7]=arbitrum&networks[8]=celo&networks[9]=harmony&networks[10]=moonriver&networks[11]=bitcoin&networks[12]=cronos&networks[13]=aurora&networks[14]=evmos&nonNilOnly=true&useNewBalancesFormat=true&useNftService=true`
      const eventSource = new EventSource(url)

      eventSource.addEventListener('balance', function (e) {
        console.log('EVENT : balance')
        setIsSyncing(true)
        const jsonData = JSON.parse(e.data)
        if (jsonData.appId === 'tokens') {
          setTokens((preState: any) => {
            return [...preState, jsonData]
          })
        } else {
          setProtocols((prevState: any) => {
            return [...prevState, jsonData]
          })
        }
        // setData(prevState => {
        //   return [...prevState, jsonData]
        // })
      })
      eventSource.addEventListener('end', function (e) {
        console.log('EVENT : end')
        setIsSyncing(false)
        eventSource.close()
      })
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }, [address])

  return { data: { protocols, tokens }, isSyncing, error }
}

import { useMemo, useState } from 'react'
import { useGetDailyChartData } from 'services/coingecko'
import { HistoryChainParams, HistoryPricesResponse, useGetHistoricalPrices } from 'services/nansenportfolio'
import { useWalletBalances } from 'services/zapper/hooks/useBalances'
import { Network, PresentedBalancePayload, TokenBreakdown } from 'services/zapper/types/models'

import MultipleLineChart from 'components/LiveChart/MultipleLineChart'
import WeekLineChart from 'components/LiveChart/WeekLineChart'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'

function formatNetwork(network: Network | string) {
  switch (network) {
    case Network.ETHEREUM_MAINNET:
      return HistoryChainParams.ETHEREUM
    case Network.BINANCE_SMART_CHAIN_MAINNET:
      return HistoryChainParams.BSC
    case Network.POLYGON_MAINNET:
      return HistoryChainParams.POLYGON
    case Network.FANTOM_OPERA_MAINNET:
      return HistoryChainParams.FANTOM
    case Network.AVALANCHE_MAINNET:
      return HistoryChainParams.AVAX
    // case Network.HARMONY_MAINNET:
    //   return HistoryChainParams.HARMONY
    case Network.ARBITRUM_MAINNET:
      return HistoryChainParams.ARBITRUM
    case Network.OPTIMISM_MAINNET:
      return HistoryChainParams.OPTIMISM
    case Network.CRONOS_MAINNET:
      return HistoryChainParams.CRONOS
    case Network.AURORA_MAINNET:
      return HistoryChainParams.AURORA
    default:
      return HistoryChainParams.ETHEREUM
  }
}

function dateStrToDate(str: string) {
  const arr = str.split('-')
  const day = parseInt(arr[0])
  const month = parseInt(arr[1])
  const year = parseInt(arr[2]) + 2000
  return new Date(year, month - 1, day).getTime()
}

function formatChartOne(
  arr: {
    [key: string]: {
      [key: string]: number
    }
  }[],
) {
  const result: {
    [key: string]: {
      time: number
      value: string
    }[]
  } = {}
  for (const item of arr) {
    const date = Object.keys(item)[0]
    for (const [key, value] of Object.entries(item[date])) {
      if (!result[key]) {
        result[key] = []
      }
      result[key].push({
        // time: date,
        // value,
        time: dateStrToDate(date),
        value: String(value),
      })
    }
  }
  return result
}

function formatHistoyOfChain(
  history: HistoryPricesResponse,
  tokensParam: {
    address: string
    chain: HistoryChainParams
    balance: number
  }[],
) {
  const listChain: string[] = ['TOTALS']
  const formatHistoryOfChain = Object.keys(history).map((dateKey, index) => {
    const listTokenOfDay = history[dateKey]
    // run one time to make list chain
    if (index === 0) {
      Object.keys(listTokenOfDay).map(key => {
        const chain = key.split('-')[1]
        if (!listChain.includes(chain)) {
          listChain.push(chain.toUpperCase())
        }
      })
    }

    const obj: {
      [key: string]: {
        [key: string]: number
      }
    } = {} as any
    obj[dateKey] = {}

    listChain.forEach(chain => {
      obj[dateKey][chain] = 0
    })
    // one day
    Object.keys(listTokenOfDay).map(key => {
      const address = key.split('-')[0]
      const chain = key.split('-')[1]
      const value = listTokenOfDay[key] * (tokensParam.filter(item => item.address === address)[0]?.balance || 1)
      obj[dateKey][chain.toUpperCase()] += value
      obj[dateKey]['TOTALS'] += value
    })
    return obj
  })
  return { formatHistoryOfChain, listChain }
}

export default function Analytics({ data }: { data: PresentedBalancePayload[] }) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const wallet = useWalletBalances(data)

  const tokensParam = useMemo(() => {
    const allToken: TokenBreakdown[] = []
    Object.values(wallet).forEach(item => {
      const listTokenOnNetwork: TokenBreakdown[] = Object.values<any>(item.details)
      allToken.push(...listTokenOnNetwork)
    })

    const tokens = allToken.map((item: TokenBreakdown) => ({
      address: item.address,
      chain: formatNetwork(item.network),
      balance: item.context.balance,
    }))
    return tokens
  }, [wallet])

  const { data: history, isLoading } = useGetHistoricalPrices(
    {
      tokens: tokensParam.map(item => ({
        address: item.address,
        chain: item.chain,
      })),
    },
    wallet,
  )
  const chartOne = useMemo(() => {
    if (history) {
      const chartData = formatChartOne(formatHistoyOfChain(history, tokensParam).formatHistoryOfChain.reverse())

      return chartData
    }
    return {
      TOTALS: [],
    }
  }, [history])

  console.log('chartOne', chartOne)

  const ChartMultiple = useMemo(() => {
    if (history) {
      const { formatHistoryOfChain } = formatHistoyOfChain(history, tokensParam)
      return formatHistoryOfChain.reverse().map(item => {
        const key = Object.keys(item)[0]
        const value = item[key]
        const obj = Object.keys(value).reduce((acc: any, cur) => {
          acc[cur] = value[cur].toString()
          return acc
        }, {})
        obj.time = dateStrToDate(key)
        return obj
      })
    }
    return []
  }, [history])
  const theme = useTheme()

  const { data: coin } = useGetDailyChartData('ethereum', 12)
  console.log('coin', coin)
  return (
    <div>
      {isLoading ? (
        <LocalLoader />
      ) : (
        <>
          <div
            style={
              {
                // backgroundColor: theme.buttonBlack,
              }
            }
          >
            <div>MULTIPLE CHAIN</div>
            <MultipleLineChart
              data={ChartMultiple}
              color={theme.primary}
              setHoverValue={setHoverValue}
              showYAsis={true}
              syncId="sync"
              unitYAsis="$"
              // minHeight={0}
            />
          </div>

          {Object.entries(chartOne).map(([key, value]) => (
            <div
              key={key}
              style={
                {
                  // backgroundColor: theme.buttonBlack,
                }
              }
            >
              <div>{key}</div>
              <WeekLineChart
                data={value}
                color={theme.primary}
                setHoverValue={setHoverValue}
                showYAsis={true}
                syncId="sync"
                unitYAsis="$"
                // minHeight={0}
              />
            </div>
          ))}
        </>
      )}
    </div>
  )
}

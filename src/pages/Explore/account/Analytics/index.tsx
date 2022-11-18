import { chain } from 'lodash'
import React, { useMemo, useState } from 'react'
import { useGetDailyChartData } from 'services/coingeko'
import { HistoryChainParams, HistoryPricesResponse, useGetHistoricalPrices } from 'services/nansenportfolio'
import { Network, PresentedBalancePayload, TokenBreakdown } from 'services/zapper/types/models'

import LineChart from 'components/LiveChart/LineChart'
import MultipleLineChart from 'components/LiveChart/MultipleLineChart'
import WeekLineChart from 'components/LiveChart/WeekLineChart'
import useTheme from 'hooks/useTheme'
import { theme } from 'theme'

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

function formatHistoyOfChain(history: HistoryPricesResponse) {
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
      const value = listTokenOfDay[key]
      obj[dateKey][chain.toUpperCase()] += value
      obj[dateKey]['TOTALS'] += value
    })
    return obj
  })
  return { formatHistoryOfChain, listChain }
}

export default function Analytics({ data }: { data: PresentedBalancePayload[] }) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const tokensParam = data.map(item => ({
    address: (item.balance.wallet as TokenBreakdown).address,
    network: formatNetwork(item.network),
  }))
  const { data: history, isLoading } = useGetHistoricalPrices({
    tokens: [
      {
        address: '0x7b4328c127b85369d9f82ca0503b000d09cf9180',
        chain: HistoryChainParams.ETHEREUM,
      },
      {
        address: '0x8254e26e453eb5abd29b3c37ac9e8da32e5d3299',
        chain: HistoryChainParams.ETHEREUM,
      },
      {
        address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        chain: HistoryChainParams.BSC,
      },
      {
        address: '0x01a28952780e4b9baf812431e6f89f80a5470700',
        chain: HistoryChainParams.POLYGON,
      },
      {
        address: '0x92a9c92c215092720c731c96d4ff508c831a714f',
        chain: HistoryChainParams.POLYGON,
      },
    ],
  })
  const chartOne = useMemo(() => {
    if (history) {
      console.log('history', history)

      // const ChartData: {
      //   [key: string]: {
      //     time: number
      //     value: string
      //   }[]
      // } = {}
      // listChain.forEach(chain => {
      //   ChartData[chain] = []
      // })
      const chartData = formatChartOne(formatHistoyOfChain(history).formatHistoryOfChain.reverse())
      console.log('chartData', chartData)

      return chartData
    }
    return {
      TOTALS: [],
    }
  }, [history])

  const ChartMultiple = useMemo(() => {
    if (history) {
      const { formatHistoryOfChain } = formatHistoyOfChain(history)
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
  console.log('ChartMultiple', ChartMultiple)
  const theme = useTheme()

  const { data: coin } = useGetDailyChartData('ethereum', 12)
  console.log('coin', coin)
  return (
    <div>
      Analytics
      {isLoading ? (
        <div>loading</div>
      ) : (
        <>
          <div>multiple line chart</div>
          <MultipleLineChart
            data={ChartMultiple}
            color={theme.primary}
            setHoverValue={setHoverValue}
            showYAsis={true}
            syncId="sync"
          />
          <div>total</div>
          <div>
            <WeekLineChart
              data={chartOne.TOTALS}
              color={theme.primary}
              setHoverValue={setHoverValue}
              showYAsis={true}
              syncId="sync"
            />
          </div>
          <div>polygon</div>
          <div>
            <WeekLineChart
              data={chartOne.POLYGON}
              color={theme.primary}
              setHoverValue={setHoverValue}
              showYAsis={true}
              syncId="sync"
            />
          </div>
        </>
      )}
    </div>
  )
}

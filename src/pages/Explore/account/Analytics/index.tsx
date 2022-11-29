import { rgba } from 'polished'
import { useMemo, useState } from 'react'
import { Command } from 'react-feather'
import { Flex } from 'rebass'
import { useGetDailyChartData } from 'services/coingecko'
import { HistoryChainParams, HistoryPricesResponse, useGetHistoricalPrices } from 'services/nansenportfolio'
import { nanSenPortfolioChainsInfo } from 'services/nansenportfolio/constances'
import { useWalletBalances } from 'services/zapper/hooks/useBalances'
import { Network, PresentedBalancePayload, TokenBreakdown } from 'services/zapper/types/models'
import styled from 'styled-components'

import AllNetwork from 'assets/images/all-networks.png'
import MultipleLineChart, { getColor } from 'components/LiveChart/MultipleLineChart'
import WeekLineChart from 'components/LiveChart/WeekLineChart'
import LocalLoader from 'components/LocalLoader'
import useTheme from 'hooks/useTheme'

import Disclaimer from './Disclaimer'

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

function capitalizeFirstLetter(string: string) {
  string = string.toLowerCase()
  return string.charAt(0).toUpperCase() + string.slice(1)
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

  const { data: eth } = useGetDailyChartData('ethereum', 12)
  const { data: btc } = useGetDailyChartData('bitcoin', 12)
  return (
    <div>
      <Disclaimer />
      {isLoading ? (
        <LocalLoader />
      ) : (
        <>
          {' '}
          <Flex flexDirection="column" style={{ gap: 32 }}>
            <WrapperChartContainer>
              <StyledTitle>
                {/* <Kyber size={40} color={theme.border} /> */}
                <img src={AllNetwork} alt="" height={40} />

                <div>Multiple Network</div>
              </StyledTitle>
              <WrapperChartItem>
                <MultipleLineChart
                  data={ChartMultiple}
                  color={theme.primary}
                  setHoverValue={setHoverValue}
                  showYAsis={true}
                  syncId="sync"
                  unitYAsis="$"
                  // minHeight={0}
                />
              </WrapperChartItem>
            </WrapperChartContainer>
            <WeekLineChartListLayout>
              {Object.entries(chartOne).map(([key, value]) => {
                const chainInfo =
                  key !== 'TOTALS'
                    ? nanSenPortfolioChainsInfo[key as unknown as HistoryChainParams]
                    : {
                        name: 'Total',
                        chainId: null,
                        logo: '',
                      }

                return (
                  <WrapperChartContainer key={key}>
                    {key !== 'TOTALS' && (
                      <StyledTitle>
                        <img src={chainInfo.logo} alt={chainInfo.name} height={40} />
                        <div>{chainInfo.name}</div>
                      </StyledTitle>
                    )}

                    {key === 'TOTALS' && (
                      <StyledTitle>
                        <div
                          style={{
                            backgroundColor: theme.primary,
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Command size={40} />
                        </div>
                        <div>{chainInfo.name}</div>
                      </StyledTitle>
                    )}

                    <WrapperChartItem>
                      <WeekLineChart
                        data={value}
                        color={getColor(key as any) || theme.primary}
                        setHoverValue={setHoverValue}
                        showYAsis={true}
                        syncId="sync"
                        unitYAsis="$"
                        // minHeight={0}
                      />
                    </WrapperChartItem>
                  </WrapperChartContainer>
                )
              })}
            </WeekLineChartListLayout>
          </Flex>
        </>
      )}
    </div>
  )
}

const WrapperChartContainer = styled.div`
  border: 1px solid ${({ theme }) => rgba(theme.border, 0.3)};
  border-radius: 16px;
  min-height: 0px;
  min-width: 0px;
`

const WrapperChartItem = styled.div`
  padding: 16px 0px;
`

const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => rgba(theme.border, 0.3)};
  padding: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
`

const WeekLineChartListLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  min-height: 0px;
  min-width: 0px;
  @media screen and (max-width: 888px) {
    display: flex;
    flex-direction: column;
  }
`

import React, { useState } from 'react'
import { Flex } from 'rebass'
import { TrueSightChartCategory, TrueSightTimeframe } from 'pages/TrueSight/index'
import { Trans } from '@lingui/macro'
import LineChart from 'components/LiveChart/LineChart'
import styled from 'styled-components'
import { rgba } from 'polished'
import useTheme from 'hooks/useTheme'
import { FormattedCoinGeckoChartData } from 'pages/TrueSight/hooks/useGetCoinGeckoChartData'
import { formattedNumLong } from 'utils'
import LocalLoader from 'components/LocalLoader'
import { LiveDataTimeframeEnum } from 'hooks/useLiveChartData'

import PredictedChart from 'components/LiveChart/PredictedChart'
import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'

import { ChartDisplaySettings } from 'constants/discoverPro'
import ChartDisplayButton from './ChartDisplayButton'

const Chart = ({
  chartData: rawChartData,
  isLoading,
  chartCategory,
  setChartCategory,
  chartTimeframe,
  setChartTimeframe,
  predictedDetails,
  isPredictedDetailsLoading,
  chartDisplaySettings,
  setChartDisplaySettings,
}: {
  chartData: FormattedCoinGeckoChartData
  isLoading: boolean
  chartCategory: TrueSightChartCategory
  setChartCategory: React.Dispatch<React.SetStateAction<TrueSightChartCategory>>
  chartTimeframe: TrueSightTimeframe
  setChartTimeframe: React.Dispatch<React.SetStateAction<TrueSightTimeframe>>
  predictedDetails: PredictedDetails[]
  isPredictedDetailsLoading: boolean
  chartDisplaySettings: ChartDisplaySettings
  setChartDisplaySettings: React.Dispatch<React.SetStateAction<ChartDisplaySettings>>
}) => {
  const theme = useTheme()
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const chartData =
    chartCategory === TrueSightChartCategory.TRADING_VOLUME ? rawChartData.totalVolumes : rawChartData.prices
  const oldestValue = chartData.length ? parseFloat(chartData[0].value) : undefined
  const latestValue = chartData.length ? parseFloat(chartData[chartData.length - 1].value) : undefined
  const mainValueNumber = hoverValue ?? latestValue
  let subValueNumber, subValuePercent
  if (oldestValue && latestValue) {
    let currentValue, comparedValue
    if (hoverValue) {
      currentValue = hoverValue
      comparedValue = latestValue
    } else {
      currentValue = latestValue
      comparedValue = oldestValue
    }
    subValueNumber = currentValue - comparedValue
    subValuePercent = ((subValueNumber * 100) / comparedValue).toFixed(2)
  }

  const mainValue = mainValueNumber ? formattedNumLong(mainValueNumber, true) : '--'
  const subValue =
    subValueNumber !== undefined && subValuePercent !== undefined
      ? `${formattedNumLong(subValueNumber, true)} (${subValuePercent}%)`
      : '--'
  let subValueDesc = ''
  if (subValue !== '--' && hoverValue === null) {
    subValueDesc = 'Past ' + (chartTimeframe === TrueSightTimeframe.ONE_DAY ? '24 Hours' : '7 Days')
  }

  const [index, setIndex] = useState<{ startIndex: number | undefined; endIndex: number | undefined }>({
    startIndex: undefined,
    endIndex: undefined,
  })

  const resetIndex = () => {
    setIndex({ startIndex: undefined, endIndex: undefined })
  }

  return (
    <ChartContainer>
      {isLoading || isPredictedDetailsLoading ? (
        <LocalLoader />
      ) : (
        <>
          <Flex justifyContent="space-between" alignItems="center">
            <ChartDataTypeContainer>
              <ChartDataTypeItem
                isActive={chartCategory === TrueSightChartCategory.TRADING_VOLUME}
                onClick={() => {
                  setChartCategory(TrueSightChartCategory.TRADING_VOLUME)
                  resetIndex()
                }}
              >
                <Trans>Trading Volume</Trans>
              </ChartDataTypeItem>
              <ChartDataTypeItem
                isActive={chartCategory === TrueSightChartCategory.PRICE}
                onClick={() => {
                  setChartCategory(TrueSightChartCategory.PRICE)
                  resetIndex()
                }}
              >
                <Trans>Price</Trans>
              </ChartDataTypeItem>
            </ChartDataTypeContainer>
            <ChartTimeframeContainer>
              <ChartTimeframeItem
                isActive={chartTimeframe === TrueSightTimeframe.ONE_DAY}
                onClick={() => {
                  setChartTimeframe(TrueSightTimeframe.ONE_DAY)
                  resetIndex()
                }}
              >
                <Trans>1D</Trans>
              </ChartTimeframeItem>
              <ChartTimeframeItem
                isActive={chartTimeframe === TrueSightTimeframe.ONE_WEEK}
                onClick={() => {
                  setChartTimeframe(TrueSightTimeframe.ONE_WEEK)
                  resetIndex()
                }}
              >
                <Trans>7D</Trans>
              </ChartTimeframeItem>
              <ChartDisplayButton
                chartDisplaySettings={chartDisplaySettings}
                setChartDisplaySettings={setChartDisplaySettings}
              />
            </ChartTimeframeContainer>
          </Flex>
          <MainValue>{mainValue}</MainValue>
          <SubValue up={typeof subValueNumber === 'number' && subValueNumber >= 0}>
            {subValue} <span style={{ color: theme.disableText }}>{subValueDesc}</span>
          </SubValue>
          <div style={{ flex: 1, marginTop: '16px' }}>
            <PredictedChart
              data={chartData}
              color={theme.primary}
              setHoverValue={setHoverValue}
              timeFrame={
                chartTimeframe === TrueSightTimeframe.ONE_DAY ? LiveDataTimeframeEnum.DAY : LiveDataTimeframeEnum.WEEK
              }
              minHeight={0}
              showYAsis
              unitYAsis="$"
              predictedDetails={predictedDetails}
              index={index}
              setIndex={setIndex}
              chartDisplaySettings={chartDisplaySettings}
            />
          </div>
        </>
      )}
    </ChartContainer>
  )
}

export default Chart

const ChartContainer = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => rgba(theme.buttonBlack, 0.4)};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &,
  & * {
    user-select: none;
  }
`

const MainValue = styled.div`
  color: ${({ theme }) => theme.subText};
  font-size: 18px;
  font-weight: 500;
  line-height: 20px;
  margin-top: 12px;
`

const SubValue = styled.div<{ up?: boolean }>`
  color: ${({ theme, up }) => (up ? theme.apr : theme.red)};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  margin-top: 4px;
`

const ChartDataTypeContainer = styled.div`
  display: flex;
  border-radius: 14px;
  background: ${({ theme }) => theme.buttonBlack};
  background: ${({ theme }) => theme.buttonBlack};
`

const ChartDataTypeItem = styled.div<{ isActive?: boolean }>`
  padding: 7px 12px;
  border-radius: 14px;
  background: ${({ theme, isActive }) => (isActive ? theme.primary : theme.buttonBlack)};
  color: ${({ theme, isActive }) => (isActive ? theme.text : theme.subText)};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
`

const ChartTimeframeContainer = styled.div`
  display: flex;
  gap: 4px;
`

const ChartTimeframeItem = styled.div<{ isActive?: boolean }>`
  padding: 7px 6px;
  background: ${({ theme, isActive }) => (isActive ? theme.primary : theme.buttonBlack)};
  color: ${({ theme, isActive }) => (isActive ? theme.text : theme.subText)};
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
`

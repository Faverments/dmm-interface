import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush } from 'recharts'
import { AxisDomain } from 'recharts/types/util/types'
import { Props as BrushProps } from 'recharts/types/cartesian/Brush'
import { format } from 'date-fns'
import styled, { ThemeContext } from 'styled-components'
import { LiveDataTimeframeEnum } from 'hooks/useLiveChartData'
import { isMobile } from 'react-device-detect'
import { toKInChart } from 'utils'

import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'
import useMakePredictedChartData from './useMakePredictedChartData'
import { ReferenceDot } from 'recharts'
import { ChartDisplaySettings } from 'constants/discoverPro'
import { rgba } from 'polished'

const AreaChartWrapper = styled(AreaChart)`
  svg {
    overflow-x: visible;
  }
`
const getHoverDateFormat = (timeFrame: LiveDataTimeframeEnum | undefined) => {
  switch (timeFrame) {
    case LiveDataTimeframeEnum.HOUR:
      return 'p (O)'
    case LiveDataTimeframeEnum.FOUR_HOURS:
      return 'p (O)'
    case LiveDataTimeframeEnum.DAY:
      return 'p MMM d (O)'
    case LiveDataTimeframeEnum.WEEK:
      return 'p MMM d (O)'
    case LiveDataTimeframeEnum.MONTH:
      return 'MMM d (O)'
    case LiveDataTimeframeEnum.SIX_MONTHS:
      return 'MMM d (O)'
    default:
      return 'p MMM d (O)'
  }
}

const getAxisDateFormat = (timeFrame: LiveDataTimeframeEnum | undefined) => {
  switch (timeFrame) {
    case LiveDataTimeframeEnum.HOUR:
      return 'p'
    case LiveDataTimeframeEnum.FOUR_HOURS:
      return 'p'
    case LiveDataTimeframeEnum.DAY:
      return 'p'
    case LiveDataTimeframeEnum.WEEK:
      return 'MMM d'
    case LiveDataTimeframeEnum.MONTH:
      return 'MMM d'
    case LiveDataTimeframeEnum.SIX_MONTHS:
      return 'MMM d'
    default:
      return 'p MMM d'
  }
}

const getBrushDateFormat = (timeFrame: LiveDataTimeframeEnum | undefined) => {
  switch (timeFrame) {
    case LiveDataTimeframeEnum.HOUR:
      return 'p'
    case LiveDataTimeframeEnum.FOUR_HOURS:
      return 'p'
    case LiveDataTimeframeEnum.DAY:
      return 'p'
    case LiveDataTimeframeEnum.WEEK:
      return 'p MMM d'
    case LiveDataTimeframeEnum.MONTH:
      return 'MMM d'
    case LiveDataTimeframeEnum.SIX_MONTHS:
      return 'MMM d'
    default:
      return 'p MMM d'
  }
}

const HoverUpdater = ({
  payload,
  setHoverValue,
}: {
  payload: any
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  useEffect(() => {
    setHoverValue(payload.value)
  }, [payload.value, payload.time, setHoverValue])

  return null
}

const CustomizedCursor = (props: any) => {
  const { payload, points, timeFrame, width } = props
  const isTextAnchorStart = width - points[0].x > 100
  if (payload) {
    return (
      <>
        <text
          x={points[0].x + (isTextAnchorStart ? 5 : -5)}
          y={12}
          fill="#6C7284"
          fontSize={12}
          textAnchor={isTextAnchorStart ? 'start' : 'end'}
        >
          {format(payload[0].payload.time, getHoverDateFormat(timeFrame))}
          {' | '}
          {payload[0].payload.rank}
        </text>
        <line x1={points[0].x} y1={0} x2={points[1].x} y2={points[1].y} stroke="#6C7284" width={2} />
      </>
    )
  } else {
    return <></>
  }
}

const ONE_DAY_TIMESTAMP = 86400000

const getFirstTimestamp = (timeFrame: LiveDataTimeframeEnum | undefined) => {
  const nowTimestamp = new Date().getTime()
  switch (timeFrame) {
    case LiveDataTimeframeEnum.HOUR:
      return nowTimestamp - 3600000
    case LiveDataTimeframeEnum.FOUR_HOURS:
      return nowTimestamp - 1440000
    case LiveDataTimeframeEnum.DAY:
      return nowTimestamp - ONE_DAY_TIMESTAMP
    case LiveDataTimeframeEnum.WEEK:
      return nowTimestamp - 7 * ONE_DAY_TIMESTAMP
    case LiveDataTimeframeEnum.MONTH:
      return nowTimestamp - 30 * ONE_DAY_TIMESTAMP
    case LiveDataTimeframeEnum.SIX_MONTHS:
      return nowTimestamp - 180 * ONE_DAY_TIMESTAMP
    default:
      return nowTimestamp - 7 * ONE_DAY_TIMESTAMP
  }
}

const addZeroData = (data: { time: number; value: string }[], timeFrame: LiveDataTimeframeEnum | undefined) => {
  let timestamp = getFirstTimestamp(timeFrame)
  const zeroData = []

  while (data[0]?.time - timestamp > ONE_DAY_TIMESTAMP) {
    zeroData.push({ time: timestamp, value: '0' })
    timestamp += ONE_DAY_TIMESTAMP
  }
  return [...zeroData, ...data]
}

interface LineChartProps {
  data: { time: number; value: string }[]
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>
  color: string
  timeFrame?: LiveDataTimeframeEnum
  minHeight?: number
  showYAsis?: boolean
  unitYAsis?: string
  predictedDetails: PredictedDetails[]
  index: {
    startIndex: undefined | number
    endIndex: undefined | number
  }
  setIndex: React.Dispatch<
    React.SetStateAction<{
      startIndex: undefined | number
      endIndex: undefined | number
    }>
  >
  chartDisplaySettings: ChartDisplaySettings
}

// const CustomizedBrush = (props: any) => {}

const LineChart = ({
  data,
  setHoverValue,
  color,
  timeFrame,
  minHeight = 292,
  showYAsis,
  unitYAsis = '',
  predictedDetails,
  index,
  setIndex,
  chartDisplaySettings,
}: LineChartProps) => {
  // const [index, setIndex] = useState<{ startIndex: number | undefined; endIndex: number | undefined }>({
  //   startIndex: undefined,
  //   endIndex: undefined,
  // })
  const theme = useContext(ThemeContext)
  const formattedData = useMemo(() => {
    return addZeroData(
      data.filter(item => !!item.value),
      timeFrame,
    )
  }, [data, timeFrame])
  const dataMax = useMemo(() => {
    if (index)
      return Math.max(...formattedData.slice(index.startIndex, index.endIndex).map(item => parseFloat(item.value)))
    return Math.max(...formattedData.map(item => parseFloat(item.value)))
  }, [formattedData, index])
  const dataMin = useMemo(() => {
    if (index)
      return Math.min(...formattedData.slice(index.startIndex, index.endIndex).map(item => parseFloat(item.value)))
    return Math.min(...formattedData.map(item => parseFloat(item.value)))
  }, [formattedData, index])

  const ticks = useMemo(() => {
    if (formattedData && formattedData.length > 0) {
      const firstTime = formattedData[index.startIndex || 0].time
      const lastTime = formattedData[index.endIndex || formattedData.length - 1].time
      const length = lastTime - firstTime
      let padding = 0.06
      let counts = 6
      if (isMobile) {
        padding = 0.1
        counts = 4
      }
      const positions = []
      for (let i = 0; i < counts; i++) {
        positions.push(padding + (i * (1 - 2 * padding)) / (counts - 1))
      }
      return positions.map(v => firstTime + length * v)
    }
    return []
  }, [formattedData, index])

  const { predictedChartData, discoverDateIndex, predictedDateIndexList } = useMakePredictedChartData(
    formattedData,
    predictedDetails,
  )

  const rankMax = useMemo(() => {
    if (index)
      return Math.max(
        ...predictedChartData
          .slice(index.startIndex, index.endIndex)
          .map(item => item.rank as number)
          .filter(item => item !== null),
      )
    return Math.max(...predictedChartData.map(item => item.rank as number).filter(item => item !== null))
  }, [predictedChartData, index])

  const rankMin = useMemo(() => {
    if (index)
      return Math.min(
        ...predictedChartData
          .slice(index.startIndex, index.endIndex)
          .map(item => item.rank as number)
          .filter(item => item !== null),
      )
    return Math.min(...predictedChartData.map(item => item.rank as number).filter(item => item !== null))
  }, [predictedChartData, index])

  console.log('rankMin', rankMin)
  console.log('rankMax', rankMax)

  const xDomain = [
    formattedData[index.startIndex || 0]?.time || 'auto',
    formattedData[index.endIndex || formattedData.length - 1]?.time || 'auto',
  ] as AxisDomain
  const yDomain = [dataMin, (5 * (dataMax - dataMin)) / 4] as AxisDomain
  const yDomainRank = [rankMin, Math.round((5 * (rankMax - rankMin)) / 4)] as AxisDomain

  return (
    <ResponsiveContainer minHeight={isMobile ? 240 : minHeight}>
      {formattedData && formattedData.length > 0 ? (
        <AreaChartWrapper
          // data={formattedData}
          data={predictedChartData}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          onMouseLeave={() => setHoverValue(null)}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            fontSize="12px"
            axisLine={false}
            tickLine={false}
            domain={xDomain}
            ticks={ticks}
            tick={{ fill: theme.subText, fontWeight: 400 }}
            type="number"
            textAnchor="middle"
            tickFormatter={time => {
              return typeof time === 'number' ? format(new Date(time), getAxisDateFormat(timeFrame)) : '0'
            }}
            interval={0}
          />
          <YAxis
            yAxisId="value_right"
            width={dataMin >= 0.1 ? 69 : 105}
            dataKey="value"
            fontSize="12px"
            tickLine={false}
            axisLine={false}
            tick={{ fill: theme.subText, fontWeight: 400 }}
            tickFormatter={tick => toKInChart(tick, unitYAsis)}
            ticks={[
              dataMin,
              dataMin + (1 * (dataMax - dataMin)) / 4,
              dataMin + (2 * (dataMax - dataMin)) / 4,
              dataMin + (3 * (dataMax - dataMin)) / 4,
              dataMin + (4 * (dataMax - dataMin)) / 4,
              dataMin + (5 * (dataMax - dataMin)) / 4,
            ]}
            orientation="right"
            domain={yDomain}
            hide={!showYAsis}
          />
          {chartDisplaySettings.showRanking && (
            <YAxis
              yAxisId="rank_left"
              width={rankMax < 10 ? 32 : 38}
              dataKey="rank"
              fontSize="12px"
              tickLine={false}
              axisLine={false}
              tick={{ fill: theme.subText, fontWeight: 400 }}
              tickFormatter={tick => '#' + tick}
              ticks={[
                rankMin, // reversed don't display first tick
                rankMin,
                rankMin + Math.round((1 * (rankMax - rankMin)) / 4),
                rankMin + Math.round((2 * (rankMax - rankMin)) / 4),
                rankMin + Math.round((3 * (rankMax - rankMin)) / 4),
                rankMin + Math.round((4 * (rankMax - rankMin)) / 4),
                rankMin + Math.round((5 * (rankMax - rankMin)) / 4),
              ]}
              orientation="left"
              domain={yDomainRank}
              reversed
            ></YAxis>
          )}
          <Tooltip
            contentStyle={{ display: 'none' }}
            formatter={(tooltipValue: any, name: string, props: any) => (
              // eslint-disable-next-line react/prop-types
              <HoverUpdater payload={props.payload} setHoverValue={setHoverValue} />
            )}
            cursor={<CustomizedCursor timeFrame={timeFrame} />}
          />
          {chartDisplaySettings.showRanking && (
            <Area
              yAxisId="rank_left"
              type="monotone"
              dataKey="rank"
              connectNulls={true}
              fill="#00000000"
              stroke={rgba(theme.text, 0.85)}
              strokeWidth={1.75}
            />
          )}

          <Area
            yAxisId="value_right"
            type="monotone"
            dataKey="value"
            stroke={color}
            fill="url(#colorUv)"
            strokeWidth={2}
          />
          {/* <Brush
            dataKey="time"
            onChange={(e: any) => setIndex(e)}
            tickFormatter={(time: any, index: number) => {
              return typeof time === 'number' ? format(new Date(time), getBrushDateFormat(timeFrame)) : '0'
            }}
            stroke={color}
            fill="#00000000"
            // traveller={
            //   <CustomizedBrush />>
            // }
          /> */}
          {chartDisplaySettings.showPredictedDate &&
            predictedDateIndexList.map((pD: number, index: number) => {
              if (pD !== -1) {
                // console.log('rendering predicted date with pD: ', pD)
                // return <ReferenceLine x={formattedData[pD].time} stroke="green" key={index} />
                return (
                  <ReferenceDot
                    yAxisId="value_right"
                    x={formattedData[pD].time}
                    y={formattedData[pD].value}
                    key={index}
                    // shape={CustomizedDot}
                    fill={theme.text}
                    stroke={theme.text}
                    r={5}
                  />
                )
              } else {
                return null
              }
            })}
          {chartDisplaySettings.showPredictedDate && discoverDateIndex && (
            <ReferenceDot
              yAxisId="value_right"
              x={formattedData[discoverDateIndex].time}
              y={formattedData[discoverDateIndex].value}
              r={5.5}
              // fill={theme.bg2}
              // stroke={theme.bg2}
            ></ReferenceDot>
          )}
        </AreaChartWrapper>
      ) : (
        <></>
      )}
    </ResponsiveContainer>
  )
}

export default React.memo(LineChart)

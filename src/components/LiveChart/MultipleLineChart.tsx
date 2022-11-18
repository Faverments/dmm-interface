import { format } from 'date-fns'
import React, { useEffect, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { Key } from 'react-feather'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { HistoryChainParams } from 'services/nansenportfolio'
import styled from 'styled-components'

import { LiveDataTimeframeEnum } from 'hooks/useBasicChartData'
import useTheme from 'hooks/useTheme'
import { toKInChart } from 'utils'

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
  data: { time: number; [key: string]: string | number }[]
  setHoverValue: React.Dispatch<React.SetStateAction<number | null>>
  color: string
  timeFrame?: LiveDataTimeframeEnum
  minHeight?: number
  showYAsis?: boolean
  unitYAsis?: string
  syncId?: string
}

function getColor(chain: HistoryChainParams) {
  switch (chain) {
    case HistoryChainParams.ETHEREUM:
      return '#3C68E7'
    case HistoryChainParams.BSC:
      return '#F0B90B'
    case HistoryChainParams.POLYGON:
      return '#7B5AF0'
    case HistoryChainParams.FANTOM:
      return '#F86A6A'
    case HistoryChainParams.AVAX:
      return '#60BD68'
    case HistoryChainParams.OPTIMISM:
      return '#FF8C00'
    default:
      return '#3C68E7'
  }
}

const MultipleLineChart = ({
  data,
  setHoverValue,
  color,
  timeFrame,
  minHeight = 292,
  showYAsis,
  unitYAsis = '',
  syncId,
}: LineChartProps) => {
  const theme = useTheme()
  // const formattedData = useMemo(() => {
  //   return addZeroData(
  //     data.filter(item => !!item.value),
  //     timeFrame,
  //   )
  // }, [data, timeFrame])
  // const dataMax = useMemo(() => Math.max(...formattedData.map(item => parseFloat(item.value))), [formattedData])
  // const dataMin = useMemo(() => Math.min(...formattedData.map(item => parseFloat(item.value))), [formattedData])
  const ticks = useMemo(() => {
    if (data && data.length > 0) {
      const firstTime = data[0].time
      const lastTime = data[data.length - 1].time
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
  }, [data])

  const listLine = useMemo(() => {
    return Object.keys(data[0])
      .filter(key => key !== 'time' && key !== 'TOTALS')
      .map(key => ({
        dataKey: key,
        dataColor: getColor(key as HistoryChainParams),
      }))
  }, [data])

  return (
    <ResponsiveContainer minHeight={isMobile ? 300 : minHeight} height="100%">
      {data && data.length > 0 ? (
        <AreaChartWrapper
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          onMouseLeave={() => setHoverValue(null)}
          syncId={syncId}
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
            domain={[data[0]?.time || 'auto', data[data.length - 1]?.time || 'auto']}
            ticks={ticks}
            tick={{ fill: theme.subText, fontWeight: 400 }}
            type="number"
            textAnchor="middle"
            tickFormatter={time => {
              return typeof time === 'number' ? format(new Date(time), getAxisDateFormat(timeFrame)) : '0'
            }}
            interval={0}
          />
          {/* <YAxis
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
            domain={[dataMin, (5 * (dataMax - dataMin)) / 4]}
            hide={!showYAsis}
          /> */}
          <YAxis />
          <Tooltip
            contentStyle={{ display: 'none' }}
            formatter={(tooltipValue: any, name: string, props: any) => (
              <HoverUpdater payload={props.payload} setHoverValue={setHoverValue} />
            )}
            cursor={<CustomizedCursor timeFrame={timeFrame} />}
          />
          {listLine.map(({ dataKey, dataColor }, index) => (
            <Area
              type="monotone"
              dataKey={dataKey}
              key={index}
              stroke={dataColor}
              // fill="url(#colorUv)"
              fill="none"
              strokeWidth={2}
            />
          ))}
        </AreaChartWrapper>
      ) : (
        <></>
      )}
    </ResponsiveContainer>
  )
}

export default React.memo(MultipleLineChart)

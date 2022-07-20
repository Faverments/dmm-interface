import React from 'react'
import styled from 'styled-components'
import { Chart } from 'components/LiquidityChartRangeInput/Chart'

const ChartWrapper = styled.div`
  position: relative;

  justify-content: center;
  align-content: center;
`

export default function RangeSelectLiveChart({
  index,
  setIndex,
}: {
  index: { startIndex: number | undefined; endIndex: number | undefined }
  setIndex: React.Dispatch<React.SetStateAction<{ startIndex: number | undefined; endIndex: number | undefined }>>
}) {
  return <ChartWrapper>{/* <Chart /> */}</ChartWrapper>
}

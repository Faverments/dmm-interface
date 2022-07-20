import { useMemo } from 'react'
import { findIndexNearestValue } from 'utils/discoverProUtils'
import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'

const findPredictedDatesInChartData = (
  predictedDetail: PredictedDetails[],
  formattedChartData: { time: number; value: string }[],
) => {
  const predictedDates = predictedDetail.map((p: PredictedDetails) => p.predicted_date * 1000)
  return predictedDates.map((pD: number) => {
    if (pD < formattedChartData[0].time || pD > formattedChartData[formattedChartData.length - 1].time) {
      return -1
    } else {
      return findIndexNearestValue(
        formattedChartData.map((d: { time: number; value: string }) => d.time),
        pD,
      )
    }
  })
}

const findDiscoverDateInChartData = (discoverDate: number, formattedChartData: { time: number; value: string }[]) => {
  discoverDate = discoverDate * 1000
  if (
    discoverDate < formattedChartData[0].time ||
    discoverDate > formattedChartData[formattedChartData.length - 1].time
  ) {
    return 0
  } else {
    return findIndexNearestValue(
      formattedChartData.map((d: { time: number; value: string }) => d.time),
      discoverDate,
    )
  }
}

const MakePredictedChartData = (
  predictedDetail: PredictedDetails[],
  formattedChartData: { time: number; value: string }[],
  predictedDateIndexs: number[],
) => {
  return formattedChartData.map((d: { time: number; value: string }, index: number) => {
    if (predictedDateIndexs.includes(index)) {
      return { ...d, rank: predictedDetail[predictedDateIndexs.indexOf(index)].rank }
    } else {
      return { ...d, rank: null }
    }
  })
}

export default function useMakePredictedChartData(
  formattedChartData: { time: number; value: string }[],
  predictedDetails: PredictedDetails[],
) {
  return useMemo(() => {
    if (predictedDetails.length === 0 || formattedChartData.length === 0) {
      return {
        predictedChartData: formattedChartData.map(i => ({ ...i, rank: null })),
        discoverDateIndex: 0,
        predictedDateIndexList: [] as number[],
      }
    }
    const predictedDateIndexList = findPredictedDatesInChartData(predictedDetails, formattedChartData)
    const discoverDateIndex = findDiscoverDateInChartData(
      predictedDetails[predictedDetails.length - 1].discovered_on,
      formattedChartData,
    )
    const predictedChartData = MakePredictedChartData(predictedDetails, formattedChartData, predictedDateIndexList)
    return {
      predictedChartData,
      discoverDateIndex,
      predictedDateIndexList,
    }
  }, [formattedChartData, predictedDetails])
}

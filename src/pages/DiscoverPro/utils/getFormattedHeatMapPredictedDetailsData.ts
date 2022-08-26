import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'
import dayjs from 'dayjs'
import { CalendarData } from 'components/HeatMapCalendar'

export default function getFormattedHeatMapPredictedDetailsData(predictedDetails: PredictedDetails[]): CalendarData {
  const rawFormattedData: any[] = predictedDetails.map(predictedDetail => {
    const date = dayjs(predictedDetail.predicted_date * 1000).format('YYYY-MM-DD')
    return {
      date,
    }
  })
  rawFormattedData.forEach((item, index) => {
    const count = rawFormattedData.filter(item2 => item.date === item2.date).length
    rawFormattedData[index].count = count
    let level
    if (count == 1) {
      level = 1
    } else if (count == 2) {
      level = 2
    } else if (count <= 5) {
      level = 3
    } else if (count <= 10) {
      level = 3
    } else {
      level = 4
    }

    rawFormattedData[index].level = level
  })

  const formattedData = rawFormattedData.filter((item, index) => {
    return rawFormattedData.findIndex(item2 => item.date === item2.date) === index
  })
  const oneYearAgo = dayjs()
    .subtract(1, 'year')
    .format('YYYY-MM-DD')

  formattedData.unshift({
    date: oneYearAgo,
    count: 0,
    level: 0,
  })

  console.log('formattedData', formattedData)

  return formattedData
}

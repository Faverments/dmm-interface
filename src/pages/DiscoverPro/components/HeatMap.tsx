import HeatMapCalendar, { Skeleton } from 'components/HeatMapCalendar'
import React, { useEffect, useState } from 'react'
import { PredictedDetails } from 'pages/DiscoverPro/hooks/useGetTokenPredictedDetails'
import getFormattedHeatMapPredictedDetailsData from '../utils/getFormattedHeatMapPredictedDetailsData'
import { CalendarData } from 'components/HeatMapCalendar'
// import ReactTooltip from 'react-tooltip'

export default function HeatMap({
  predictedDetails,
  isPredictedDetailsLoading,
  activeDate,
  setActiveDate,
}: {
  predictedDetails: PredictedDetails[]
  isPredictedDetailsLoading: boolean
  activeDate: string
  setActiveDate: React.Dispatch<React.SetStateAction<string>>
}) {
  const [data, setData] = useState<CalendarData>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // fetch('https://github-contributions-api.jogruber.de/v4/vukhaihoan?y=last')
    //   .then(res => res.json())
    //   .then(res => {
    //     setData(res.contributions)
    //     setLoading(false)
    //   })
    const data = getFormattedHeatMapPredictedDetailsData(predictedDetails)
    setData(data)
  }, [predictedDetails])

  if (isPredictedDetailsLoading || !data) {
    return <Skeleton loading />
  }

  return (
    <HeatMapCalendar
      data={data}
      activeDate={activeDate}
      eventHandlers={{
        onClick: event => data => {
          console.log({ event, data })
          setActiveDate(data.date)
        },

        onMouseEnter: event => data => console.log('mouseEnter'),
      }}
    >
      {/* <ReactTooltip delayShow={50} html /> */}
    </HeatMapCalendar>
  )
}

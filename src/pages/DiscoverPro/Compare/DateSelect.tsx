import React, { useEffect, useRef } from 'react'
import { Flex, Text } from 'rebass'
import { ArrowLeft, ArrowRight, Calendar } from 'react-feather'
import { MouseoverTooltip } from 'components/Tooltip'
import { TextTooltip } from 'pages/TrueSight/styled'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import dayjs from 'dayjs'
import useGetListPredictedDate from 'pages/DiscoverPro/hooks/useGetListPredictedDate'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import { PredictedDate } from 'constants/discoverPro'
import Loader from 'components/Loader'
import CalendarPicker from 'components/CalendarPicker'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ClickableText } from 'components/YieldPools/styleds'

import { darken } from 'polished'
const DateSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const DateNavigateWarper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
const DatePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
const PaginationText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.subText};
`

export default function DateSelect({
  activeTimeFrame,
  setActivePredictedDate,
}: {
  activeTimeFrame: TrueSightTimeframe
  setActivePredictedDate: (predictedDate: PredictedDate) => void
}) {
  const theme = useTheme()
  const tooltipText = 'test'
  const listPredictedDate24h = useGetListPredictedDate(TrueSightTimeframe.ONE_DAY)
  const listPredictedDate7d = useGetListPredictedDate(TrueSightTimeframe.ONE_WEEK)

  const [isShowingCalendar, setIsShowingCalendar] = React.useState(false)
  const [isPicked, setIsPicked] = React.useState(false)
  console.log(isShowingCalendar)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentDate24h = (() => {
    if (listPredictedDate24h.data.length > 0) {
      return dayjs.unix(listPredictedDate24h.data[0].mediumDate).format('h:m A - MMM D, YYYY')
    }
    return ''
  })()
  const currentDate7d = (() => {
    if (listPredictedDate7d.data.length > 0) {
      return dayjs.unix(listPredictedDate7d.data[0].mediumDate).format('h:m A - MMM D, YYYY')
    }
    return ''
  })()

  // useEffect(() => {
  //   if (listPredictedDate24h.data.length > 0) {
  //     setActivePredictedDate(listPredictedDate24h.data[0])
  //   }
  // }, [listPredictedDate24h.data])

  useOnClickOutside(containerRef, () => setIsShowingCalendar(false))
  const setIsPickedWapper = (date: dayjs.Dayjs, predictedDate: PredictedDate[], day: PredictedDate) => {
    // setIsPicked(ol)
  }

  return (
    <DateSelectWrapper>
      {/* <MouseoverTooltip text={tooltipText}>
        <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
          <Trans>Predicted Date</Trans>
        </TextTooltip>
      </MouseoverTooltip> */}
      <DateNavigateWarper>
        <ClickableText>
          <ArrowLeft size={16} color={theme.primary} />
        </ClickableText>
        <div ref={containerRef} style={{ position: 'relative', zIndex: 99 }}>
          <DatePicker
            onClick={e => {
              e.stopPropagation()
              setIsShowingCalendar(prev => !prev)
            }}
          >
            {activeTimeFrame === TrueSightTimeframe.ONE_DAY ? (
              listPredictedDate24h.isLoading ? (
                <Loader />
              ) : (
                (() => {
                  // setActivePredictedDate(listPredictedDate24h.data[0])
                  return (
                    <>
                      <PaginationText>{currentDate24h}</PaginationText>
                      <Calendar size={18} color={theme.subText}></Calendar>
                    </>
                  )
                })()
              )
            ) : listPredictedDate7d.isLoading ? (
              <Loader />
            ) : (
              (() => {
                // setActivePredictedDate(listPredictedDate7d.data[0])
                return (
                  <>
                    <PaginationText>{currentDate7d}</PaginationText>
                    <Calendar size={18} color={theme.subText}></Calendar>
                  </>
                )
              })()
            )}
          </DatePicker>

          {isShowingCalendar && (
            <CalendarPickerContainer>
              <CalendarPicker cancelPicker={true} setIsPicked={setIsPickedWapper} isPicked={isPicked} />
            </CalendarPickerContainer>
          )}
        </div>
        <ClickableText>
          <ArrowRight size={16} color={theme.primary} />
        </ClickableText>
      </DateNavigateWarper>
    </DateSelectWrapper>
  )
}

const CalendarPickerContainer = styled(Flex)`
  position: absolute;
  background: ${({ theme }) => theme.tableHeader};
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.36));
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  padding: 16px;
  width: fit-content;
  transform: translate(-50%, 0);
  gap: 16px;
  color: ${({ theme }) => theme.subText};
  display: flex;
  flex-direction: column;
`

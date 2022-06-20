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
import CalendarPicker from 'components/Calendar'
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
  const [ispicked, setIspicked] = React.useState(false)
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
  console.log('ispicked', ispicked)

  const setisPickedWapper = (ol: boolean) => {
    setIspicked(ol)
  }

  useEffect(() => {
    if (ispicked == true) {
      setIsShowingCalendar(false)
    }
  })

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
        <div ref={containerRef}>
          <DatePicker
            onClick={() => {
              setIsShowingCalendar(true)
              setIspicked(false)
              console.log('click calendar')
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
                      <PaginationText
                        onClick={() => {
                          setIsShowingCalendar(true)
                          setIspicked(false)
                          console.log('click calendar')
                        }}
                      >
                        {currentDate24h}
                      </PaginationText>
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
                    <PaginationText
                      onClick={() => {
                        setIsShowingCalendar(true)
                        setIspicked(false)
                        console.log('click calendar')
                      }}
                    >
                      {currentDate7d}
                    </PaginationText>
                    <Calendar size={18} color={theme.subText}></Calendar>
                  </>
                )
              })()
            )}
          </DatePicker>

          {isShowingCalendar && (
            <CalendarPickerContainer>
              <CalendarPicker
                cancelPicker={true}
                setIspicked={setisPickedWapper}
                isPicked={ispicked}
                data={{ currentDate24h, currentDate7d }}
              />
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
  bottom: -4px;
  right: 0;
  border-radius: 4px;
  flex-direction: column;
  background: ${({ theme }) => theme.tableHeader};
  z-index: 9999;
  width: 300px;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  transform: translate(0, 100%);
  /* min-width: max-content !important; */

  & > * {
    cursor: pointer;
    padding: 12px;

    &:hover {
      background: ${({ theme }) => theme.background};
    }
  }

  & div {
    min-width: max-content !important;
  }

  .no-hover-effect {
    cursor: default;
    &:hover {
      background: inherit;
    }
  }

  .no-hover-effect-divider {
    &:hover {
      background: ${({ theme }) => theme.border};
    }
  }
`

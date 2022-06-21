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
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 35px;
  gap: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.buttonBlack};
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
  position: relative;
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary)};
  }
`

const NavigateButton = styled.div`
  width: 35px;
  height: 35px;
  background: ${({ theme }) => theme.buttonBlack};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary)};
  }
  &:active {
    transform: scale(0.9);
  }
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
        <NavigateButton>
          <ArrowLeft size={18} />
        </NavigateButton>
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
                  return <div>{currentDate24h}</div>
                })()
              )
            ) : listPredictedDate7d.isLoading ? (
              <Loader />
            ) : (
              (() => {
                // setActivePredictedDate(listPredictedDate7d.data[0])
                return (
                  <div
                    onClick={() => {
                      setIsShowingCalendar(true)
                      setIspicked(false)
                      console.log('click calendar')
                    }}
                  >
                    {currentDate7d}
                  </div>
                )
              })()
            )}
            <Calendar size={20}></Calendar>
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
        <NavigateButton>
          <ArrowRight size={18} />
        </NavigateButton>
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

import React from 'react'
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
import Loader from 'components/Loader'
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
  padding: 0 8px;
  display: flex;
  align-items: center;
  height: 35px;
  gap: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.background};
  cursor: pointer;
  color: ${({ theme }) => theme.subText};
  font-size: 14px;
  font-weight: 500;
`

const NavigateButton = styled.div`
  width: 35px;
  height: 35px;
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
  &:active {
    transform: scale(0.9);
  }
`

export default function DateSelect({ activeTimeFrame }: { activeTimeFrame: TrueSightTimeframe }) {
  const theme = useTheme()
  const tooltipText = 'test'
  const { isLoading, data, error } = useGetListPredictedDate(activeTimeFrame)
  const currentDate = (() => {
    if (data.length > 0) {
      return dayjs.unix(data[0].mediumDate).format('h:m A - MMM D, YYYY')
    }
    return ''
  })()

  return (
    <DateSelectWrapper>
      <MouseoverTooltip text={tooltipText}>
        <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
          <Trans>Predicted Date</Trans>
        </TextTooltip>
      </MouseoverTooltip>
      <DateNavigateWarper>
        <NavigateButton>
          <ArrowLeft size={18} />
        </NavigateButton>
        <NavigateButton>
          <ArrowRight size={18} />
        </NavigateButton>
        <DatePicker>
          {isLoading ? <Loader /> : <div>{currentDate}</div>}
          <Calendar size={20}></Calendar>
        </DatePicker>
      </DateNavigateWarper>
    </DateSelectWrapper>
  )
}

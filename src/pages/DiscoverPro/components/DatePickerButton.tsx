import useTheme from 'hooks/useTheme'
import React, { CSSProperties, useRef, useState } from 'react'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { ButtonPrimary } from 'components/Button'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { Flex } from 'rebass'
import styled from 'styled-components'
import { Settings } from 'react-feather'
import { darken } from 'polished'

import { ChartDisplaySettings } from 'constants/discoverPro'

import { AutoColumn } from 'components/Column'
import { t, Trans } from '@lingui/macro'
import { RowBetween, RowFixed } from 'components/Row'
import QuestionHelper from 'components/QuestionHelper'
import Toggle from 'components/Toggle'
import { isMobile } from 'react-device-detect'
import Calendar from 'components/CalendarPicker'
import { NavigateDateButton } from '../History'

const OptionsContainer = styled(Flex)`
  position: absolute;
  background: ${({ theme }) => theme.tableHeader};
  filter: drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.36));
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  padding: 16px;
  width: max-content;
  top: 36px;
  right: -130px;
  transform: translate(-50%, 0);
  gap: 16px;
  color: ${({ theme }) => theme.subText};
  display: flex;
  flex-direction: column;
`
const CalenderDisplayButton = ({ style }: { style?: CSSProperties }) => {
  const theme = useTheme()
  const [isShowCalender, setIsShowCalender] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setIsShowCalender(false))

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 1, ...style }}>
      <NavigateDateButton
        onClick={e => {
          e.stopPropagation()
          setIsShowCalender(prev => !prev)
        }}
      >
        <Settings size={16} />
      </NavigateDateButton>
      {isShowCalender && <OptionsContainer></OptionsContainer>}
    </div>
  )
}

export default CalenderDisplayButton

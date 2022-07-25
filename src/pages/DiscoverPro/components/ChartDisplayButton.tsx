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
import Toggle from 'components/Toggle/LegacyToggle'
import { isMobile } from 'react-device-detect'
const StyledTitle = styled.div`
  font-size: ${isMobile ? '15px' : '15px'};
  font-weight: 500;
`
const StyledLabel = styled.div`
  font-size: ${isMobile ? '14px' : '12px'};
  color: ${({ theme }) => theme.text};
  font-weigh: 400;
  line-height: 20px;
`

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

const ChartTimeframeSettingIcon = styled.div<{ isActive?: boolean }>`
  background: ${({ theme, isActive }) => (isActive ? theme.primary : theme.buttonBlack)};
  color: ${({ theme, isActive }) => (isActive ? theme.text : theme.subText)};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 6px;
  height: 28px;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary)};
  }
`

const ChartDisplayButton = ({
  style,
  chartDisplaySettings,
  setChartDisplaySettings,
}: {
  style?: CSSProperties
  chartDisplaySettings: ChartDisplaySettings
  setChartDisplaySettings: React.Dispatch<React.SetStateAction<ChartDisplaySettings>>
}) => {
  const theme = useTheme()
  const [isShowDisplaySettings, setIsShowDisplaySettings] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setIsShowDisplaySettings(false))

  return (
    <div ref={containerRef} style={{ position: 'relative', zIndex: 1, ...style }}>
      <ChartTimeframeSettingIcon
        onClick={e => {
          e.stopPropagation()
          setIsShowDisplaySettings(prev => !prev)
        }}
      >
        <Settings size={16} />
      </ChartTimeframeSettingIcon>
      {isShowDisplaySettings && (
        <OptionsContainer>
          {/* <StyledTitle style={{ borderTop: '1px solid ' + theme.border, padding: '16px 0' }}> */}
          <StyledTitle>
            <Trans>Chart Display Settings</Trans>
          </StyledTitle>
          <AutoColumn gap="md">
            <RowBetween>
              <RowFixed>
                <StyledLabel>Ranking</StyledLabel>
                <QuestionHelper text={t`Turn on to display token rank line chart`} />
              </RowFixed>
              <Toggle
                isActive={chartDisplaySettings.showRanking}
                toggle={() => {
                  setChartDisplaySettings(prev => ({ ...prev, showRanking: !prev.showRanking }))
                }}
                size={isMobile ? 'md' : 'sm'}
              />
            </RowBetween>

            <RowBetween>
              <RowFixed>
                <StyledLabel>Predicted Date</StyledLabel>
                <QuestionHelper text={t`Turn on to display Predicted Date `} />
              </RowFixed>
              <div style={{ marginLeft: 10 }}>
                <Toggle
                  isActive={chartDisplaySettings.showPredictedDate}
                  toggle={() => {
                    setChartDisplaySettings(prev => ({ ...prev, showPredictedDate: !prev.showPredictedDate }))
                  }}
                  size={isMobile ? 'md' : 'sm'}
                />
              </div>
            </RowBetween>
          </AutoColumn>
        </OptionsContainer>
      )}
    </div>
  )
}

export default ChartDisplayButton

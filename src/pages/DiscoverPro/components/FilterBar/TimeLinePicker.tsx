import React from 'react'
import { Flex } from 'rebass'

import useTheme from 'hooks/useTheme'
import { PercentChangeMode } from 'pages/DiscoverPro/index'

import { PickerItem } from './Shared'

const TimeLinePicker = ({
  activeMode,
  setActiveMode,
}: {
  activeMode: PercentChangeMode
  setActiveMode: (timeframe: PercentChangeMode) => void
}) => {
  const theme = useTheme()

  return (
    <Flex style={{ borderRadius: '4px', padding: '4px', background: theme.background }}>
      <PickerItem
        text="Predicted"
        active={activeMode === PercentChangeMode.PREDICTED_TO_CURRENT}
        onClick={() => {
          setActiveMode(PercentChangeMode.PREDICTED_TO_CURRENT)
        }}
      />
      <PickerItem
        text="Discover"
        active={activeMode === PercentChangeMode.DISCOVER_TO_CURRENT}
        onClick={() => {
          setActiveMode(PercentChangeMode.DISCOVER_TO_CURRENT)
        }}
      />
    </Flex>
  )
}

export default TimeLinePicker

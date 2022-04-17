import React from 'react'
import { Flex } from 'rebass'

import useTheme from 'hooks/useTheme'
import { PercentChangeMode } from 'pages/DiscoverPro/index'

const PercentChangeModePickerItem = ({
  text,
  active,
  onClick,
}: {
  text: string
  active: boolean
  onClick: () => void
}) => {
  const theme = useTheme()

  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '7px',
        color: active ? theme.text14 : theme.subText,
        background: active ? theme.primary : 'transparent',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {text}
    </div>
  )
}

const PercentChangeModePicker = ({
  activeMode,
  setActiveMode,
}: {
  activeMode: PercentChangeMode
  setActiveMode: (timeframe: PercentChangeMode) => void
}) => {
  const theme = useTheme()

  return (
    <Flex style={{ borderRadius: '4px', padding: '4px', background: theme.background }}>
      <PercentChangeModePickerItem
        text="Predicted"
        active={activeMode === PercentChangeMode.PREDICTED_TO_CURRENT}
        onClick={() => {
          setActiveMode(PercentChangeMode.PREDICTED_TO_CURRENT)
        }}
      />
      <PercentChangeModePickerItem
        text="Discover"
        active={activeMode === PercentChangeMode.DISCOVER_TO_CURRENT}
        onClick={() => {
          setActiveMode(PercentChangeMode.DISCOVER_TO_CURRENT)
        }}
      />
    </Flex>
  )
}

export default PercentChangeModePicker

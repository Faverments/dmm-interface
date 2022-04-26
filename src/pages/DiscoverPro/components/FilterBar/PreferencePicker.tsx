import React from 'react'
import { Flex } from 'rebass'

import useTheme from 'hooks/useTheme'
import { PreferenceMode } from 'pages/DiscoverPro/index'

import { PickerItem } from './Shared'

const PreferencePicker = ({
  activeMode,
  setActiveMode,
}: {
  activeMode: PreferenceMode
  setActiveMode: (timeframe: PreferenceMode) => void
}) => {
  const theme = useTheme()

  return (
    <Flex style={{ borderRadius: '4px', padding: '4px', background: theme.background }}>
      <PickerItem
        text="Percent"
        active={activeMode === PreferenceMode.PERCENT}
        onClick={() => {
          setActiveMode(PreferenceMode.PERCENT)
        }}
      />
      <PickerItem
        text="Value"
        active={activeMode === PreferenceMode.VALUE}
        onClick={() => {
          setActiveMode(PreferenceMode.VALUE)
        }}
      />
    </Flex>
  )
}

export default PreferencePicker

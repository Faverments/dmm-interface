import React from 'react'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'

import useTheme from 'hooks/useTheme'
import { OpenMode } from 'constants/discoverPro'
import { Layers, ExternalLink } from 'react-feather'

const LayoutPickerItem = ({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children?: React.ReactNode
}) => {
  const theme = useTheme()

  return (
    <div
      style={{
        borderRadius: '4px',
        padding: '6px 7px',
        // color: active ? theme.text14 : theme.subText,
        background: active ? theme.primary : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const OpenModeSelect = ({
  activeMode,
  setActiveMode,
}: {
  activeMode: OpenMode | undefined
  setActiveMode: (timeframe: OpenMode) => void
}) => {
  const theme = useTheme()
  return (
    <>
      {/* <Text fontSize="14px" fontWeight={500} color={theme.subText}>
        <Trans>Layout</Trans>
      </Text> */}
      <Flex style={{ borderRadius: '4px', padding: '4px', background: theme.background }}>
        <LayoutPickerItem
          active={activeMode === OpenMode.INTERNAL}
          onClick={() => {
            setActiveMode(OpenMode.INTERNAL)
          }}
        >
          <Layers size={16} color={activeMode === OpenMode.INTERNAL ? theme.text14 : theme.subText} />
        </LayoutPickerItem>
        <LayoutPickerItem
          active={activeMode === OpenMode.EXTERNAL}
          onClick={() => {
            setActiveMode(OpenMode.EXTERNAL)
          }}
        >
          <ExternalLink size={16} color={activeMode === OpenMode.EXTERNAL ? theme.text14 : theme.subText} />
        </LayoutPickerItem>
      </Flex>
    </>
  )
}

export default OpenModeSelect

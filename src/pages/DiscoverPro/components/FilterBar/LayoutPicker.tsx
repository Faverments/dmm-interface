import React from 'react'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'

import useTheme from 'hooks/useTheme'
import { LayoutMode } from 'constants/discoverPro'
import { Layout as TableWithDetails, CreditCard as TableLarge } from 'react-feather'

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

const LayoutPicker = ({
  activeMode,
  setActiveMode,
}: {
  activeMode: LayoutMode
  setActiveMode: (timeframe: LayoutMode) => void
}) => {
  const theme = useTheme()
  return (
    <>
      {/* <Text fontSize="14px" fontWeight={500} color={theme.subText}>
        <Trans>Layout</Trans>
      </Text> */}
      <Flex style={{ borderRadius: '4px', padding: '4px', background: theme.background }}>
        <LayoutPickerItem
          active={activeMode === LayoutMode.TABLE_LARGE}
          onClick={() => {
            setActiveMode(LayoutMode.TABLE_LARGE)
          }}
        >
          <TableLarge size={16} color={activeMode === LayoutMode.TABLE_LARGE ? theme.text : theme.subText} />
        </LayoutPickerItem>
        <LayoutPickerItem
          active={activeMode === LayoutMode.TABLE_WITH_DETAILS}
          onClick={() => {
            setActiveMode(LayoutMode.TABLE_WITH_DETAILS)
          }}
        >
          <TableWithDetails
            size={16}
            color={activeMode === LayoutMode.TABLE_WITH_DETAILS ? theme.text : theme.subText}
          />
        </LayoutPickerItem>
      </Flex>
    </>
  )
}

export default LayoutPicker

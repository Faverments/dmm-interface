import React from 'react'
import { Flex } from 'rebass'

import useTheme from 'hooks/useTheme'

export const PickerItem = ({ text, active, onClick }: { text: string; active: boolean; onClick: () => void }) => {
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

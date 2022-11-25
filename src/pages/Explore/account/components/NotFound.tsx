import React from 'react'
import { Search as SearchIcon, X } from 'react-feather'
import { Flex, Text } from 'rebass'

import useTheme from 'hooks/useTheme'

export default function NotFound({ text }: { text: string }) {
  const theme = useTheme()
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      style={{
        height: 300,
        width: '100%',
        border: `1px solid ${theme.background}`,
        borderRadius: 12,
      }}
    >
      <Flex justifyContent="center" alignItems="center" flexDirection="column" style={{ gap: 20 }}>
        <div
          style={{
            position: 'relative',
            width: 'fit-content',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: theme.background,
            }}
          >
            <SearchIcon size={36} />
          </div>
          <X
            size={24}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              backgroundColor: theme.primary,
              borderRadius: '50%',
              color: theme.textReverse,
            }}
          />
        </div>
        <Text color={theme.subText} fontSize={24} fontWeight={300}>
          {text}
        </Text>
      </Flex>
    </Flex>
  )
}

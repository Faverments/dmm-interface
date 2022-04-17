import React, { CSSProperties, Dispatch, SetStateAction, useState, useRef } from 'react'
import styled from 'styled-components'
import { DiscoverProFilter } from 'pages/DiscoverPro/index'
import useTheme from 'hooks/useTheme'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

import { isMobile } from 'react-device-detect'
import { Flex, Text } from 'rebass'
import { Trans } from '@lingui/macro'

import { TokenStatus } from 'pages/DiscoverPro/index'
import { ChevronDown, X } from 'react-feather'
import { OptionsContainer } from 'pages/TrueSight/styled'

// UNKNOWN_ERROR if put TOKEN_STATUS_LABE here ( interface is working )

const TokenStatusSelectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px 12px;
  position: relative;
  border-radius: 4px;
  background: ${({ theme }) => theme.background};
  min-width: 160px;
  cursor: pointer;
`

const TokenStatusSelect = ({
  filter,
  setFilter,
  style,
}: {
  filter: DiscoverProFilter
  setFilter: Dispatch<SetStateAction<DiscoverProFilter>>
  style?: CSSProperties
}) => {
  const TOKEN_STATUS_LABEL: { [key in TokenStatus]: string } = {
    [TokenStatus.NEW_DISCOVER]: 'New Discover',
    [TokenStatus.CHANGE_DISCOVER]: 'Change Discover',
    [TokenStatus.NEXT_PREDICT]: 'Next Predict',
    [TokenStatus.PREVIOUS_PREDICT]: 'Previous Predict',
  }
  const theme = useTheme()
  const { selectedTokenStatus } = filter
  const [isShowOptions, setIsShowOptions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => !isMobile && setIsShowOptions(false))

  // IN_DEV toggle TokenStatusSelectModal on mobile

  return (
    <TokenStatusSelectContainer
      onClick={() => {
        if (isMobile) {
        } else {
          setIsShowOptions(prev => !prev)
        }
      }}
      ref={containerRef}
      style={style}
    >
      <div>
        <Text color={selectedTokenStatus ? theme.subText : theme.disableText} fontSize="12px">
          {selectedTokenStatus ? TOKEN_STATUS_LABEL[selectedTokenStatus] : <Trans>All Tokens</Trans>}
        </Text>
      </div>
      <Flex alignItems="center">
        {selectedTokenStatus && (
          <X
            size={16}
            color={theme.disableText}
            onClick={e => {
              e.stopPropagation()
              setFilter(prev => ({ ...prev, selectedTokenStatus: undefined }))
            }}
          />
        )}
        <ChevronDown size={16} color={theme.disableText} />

        {isShowOptions && !isMobile && (
          <OptionsContainer>
            {(Object.keys(TokenStatus) as Array<keyof typeof TokenStatus>).map((status, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilter(prev => ({ ...prev, selectedTokenStatus: status as TokenStatus }))
                }}
              >
                <Text key={index} color={theme.subText} fontSize="12px">
                  <Trans>{TOKEN_STATUS_LABEL[status]}</Trans>
                </Text>
              </div>
            ))}
          </OptionsContainer>
        )}
      </Flex>
    </TokenStatusSelectContainer>
  )
}
export default TokenStatusSelect

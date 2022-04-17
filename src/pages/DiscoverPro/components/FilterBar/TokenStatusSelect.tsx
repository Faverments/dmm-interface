import React, { CSSProperties, Dispatch, SetStateAction, useState, useRef } from 'react'
import styled from 'styled-components'
import { DiscoverProFilter } from 'pages/DiscoverPro/index'
import useTheme from 'hooks/useTheme'
import { useOnClickOutside } from 'hooks/useOnClickOutside'

import { isMobile } from 'react-device-detect'
import { Flex } from 'rebass'

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
    ></TokenStatusSelectContainer>
  )
}
export default TokenStatusSelect

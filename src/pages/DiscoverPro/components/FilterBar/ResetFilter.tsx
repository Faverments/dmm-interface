import React, { useState, useEffect } from 'react'
import { RefreshCcw } from 'react-feather'

import useTheme from 'hooks/useTheme'
import { DiscoverProFilter } from 'pages/DiscoverPro/TrueSight/index'
import { Trans } from '@lingui/macro'
import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'

// IN_DEV UNKNOWN MAKE ROTATE BUTTON REFRESH

function deepEqual(x: any, y: any): boolean {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length && ok(x).every(key => deepEqual(x[key], y[key]))
    : x === y
}
function compareFilterState(filter: DiscoverProFilter): boolean {
  const DefaultFilter = {
    isShowTrueSightOnly: false,
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedTokenStatus: undefined,
  }
  const newFilter = {
    isShowTrueSightOnly: filter.isShowTrueSightOnly,
    selectedTag: filter.selectedTag,
    selectedTokenData: filter.selectedTokenData,
    selectedNetwork: filter.selectedNetwork,
    selectedTokenStatus: filter.selectedTokenStatus,
  }
  return deepEqual(DefaultFilter, newFilter)
}

const ResetButtonWarper = styled.div<{ active: boolean }>`
  width: 35px;
  height: 35px;
  background: ${({ theme, active }) => (active ? theme.background : theme.bg3)};
  /* background: ${({ theme }) => theme.background}; */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  pointer-events: ${({ active }) => (active ? 'all' : 'none')};
  cursor: ${({ active }) => (active ? 'pointer' : 'default')};
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
  &:active {
    transform: scale(0.9);
  }
`

const ResetButton = ({ filter, resetFilter }: { filter: DiscoverProFilter; resetFilter: () => void }) => {
  const theme = useTheme()
  const [isFilterChanged, setIsFilterChanged] = useState<boolean>(!compareFilterState(filter))

  useEffect(() => {
    setIsFilterChanged(!compareFilterState(filter))
  }, [filter])

  return (
    <ResetButtonWarper onClick={resetFilter} active={isFilterChanged}>
      <RefreshCcw size={18} color={isFilterChanged ? undefined : theme.disableText} />
    </ResetButtonWarper>
    // <ButtonPrimary
    //   padding="8px 10px"
    //   width="fit-content"
    //   style={{ borderRadius: '4px', fontSize: '14px' }}
    //   disabled={!isFilterChanged}
    //   onClick={resetFilter}
    // >
    //   <RefreshCcw size={18} />
    // </ButtonPrimary>
  )
}

export default ResetButton

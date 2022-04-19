import React, { useState, useEffect } from 'react'
import { Flex, Text } from 'rebass'
import { RefreshCcw } from 'react-feather'

import useTheme from 'hooks/useTheme'
import { DiscoverProFilter, PercentChangeMode } from 'pages/DiscoverPro/index'
import { Trans } from '@lingui/macro'
import styled from 'styled-components'

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
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedPercentChangeMode: PercentChangeMode.PREDICTED_TO_CURRENT,
    selectedTokenStatus: undefined,
  }
  const newFilter = {
    selectedTag: filter.selectedTag,
    selectedTokenData: filter.selectedTokenData,
    selectedNetwork: filter.selectedNetwork,
    selectedPercentChangeMode: filter.selectedPercentChangeMode,
    selectedTokenStatus: filter.selectedTokenStatus,
  }
  return deepEqual(DefaultFilter, newFilter)
}

const ResetButtonWarper = styled.div`
  width: 35px;
  height: 35px;
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
  &:active {
    transform: scale(0.9);
  }
`

const PercentChangeModePicker = ({ filter, resetFilter }: { filter: DiscoverProFilter; resetFilter: () => void }) => {
  const theme = useTheme()
  const [isFilterChanged, setIsFilterChanged] = useState<boolean>(!compareFilterState(filter))

  useEffect(() => {
    setIsFilterChanged(!compareFilterState(filter))
  }, [filter])

  return (
    <>
      {/* <Text fontSize="14px" fontWeight={500} color={theme.subText}>
        <Trans>Reset Filter</Trans>
      </Text> */}

      <ResetButtonWarper onClick={resetFilter}>
        <RefreshCcw size={18} color={isFilterChanged ? undefined : theme.disableText} />
      </ResetButtonWarper>
    </>
  )
}

export default PercentChangeModePicker

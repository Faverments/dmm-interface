import React from 'react'
import FilterBarToggle from 'components/Toggle/FilterBarToggle'
import { Flex } from 'rebass'
import { t, Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'
import { TextTooltip } from 'pages/TrueSight/styled'
import { MouseoverTooltip } from 'components/Tooltip'

export interface ToggleProps {
  isActive: boolean | undefined
  toggle: () => void
}

const TrendingToggle = ({ isActive, toggle }: ToggleProps) => {
  const theme = useTheme()
  if (isActive === undefined) {
    isActive = false
  }

  return (
    <Flex alignItems="center">
      <FilterBarToggle isActive={isActive} toggle={toggle} style={{ marginRight: '8px' }} />
      <MouseoverTooltip text={t`Click to view list token before change`}>
        <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
          <Trans>Before Change</Trans>
        </TextTooltip>
      </MouseoverTooltip>
    </Flex>
  )
}

export default TrendingToggle

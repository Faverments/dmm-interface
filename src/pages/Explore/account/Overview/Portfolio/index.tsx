import React from 'react'
import { PresentedBalancePayload } from 'services/zapper'

import { AutoColumn } from 'components/Column'

import { SideTitle, SideWrapper } from '../../styleds'

function calculatePortfolio(data: PresentedBalancePayload[]) {
  return null
}

export default function Portfolio({ data }: { data: PresentedBalancePayload[] }) {
  return (
    <SideWrapper>
      <AutoColumn gap="8px">
        <SideTitle>Portfolio Breakdown</SideTitle>
        <AutoColumn gap="16px"></AutoColumn>
      </AutoColumn>
    </SideWrapper>
  )
}

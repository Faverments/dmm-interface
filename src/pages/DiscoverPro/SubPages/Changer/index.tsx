import React, { useState } from 'react'
import styled from 'styled-components'
import FilterBar from 'pages/DiscoverPro/components/FilterBar/index'
import { DiscoverProFilter, PercentChangeMode, PreferenceMode, DiscoverProSortSettings } from 'pages/DiscoverPro/index'
import { TrueSightTimeframe } from 'pages/TrueSight/index'
import Table from 'pages/DiscoverPro/SubPages/Changer/components/Table/index'
import { Flex } from 'rebass'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px 100px;
  gap: 24px;
  width: 100%;

  @media only screen and (min-width: 768px) {
    flex-direction: column;
    padding: 24px 16px 100px;
    gap: 16px;
  }

  @media only screen and (min-width: 1000px) {
    padding: 24px 32px 100px;
  }

  @media only screen and (min-width: 1366px) {
    padding: 24px 155px 50px;
  }

  @media only screen and (min-width: 1440px) {
    padding: 24px 202px 50px;
  }
`

export default function Changer() {
  const [filter, setFilter] = useState<DiscoverProFilter>({
    isShowTrueSightOnly: false,
    timeframe: TrueSightTimeframe.ONE_DAY,
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedPercentChangeMode: PercentChangeMode.PREDICTED_TO_CURRENT,
    selectedPreferenceMode: PreferenceMode.PERCENT,
    selectedTokenStatus: undefined,
    layoutMode: undefined,
    selectedPredictedDate: undefined,
  })
  const [sortSettings, setSortSettings] = useState<DiscoverProSortSettings>({ sortBy: 'rank', sortDirection: 'asc' })
  return (
    <PageWrapper>
      <h1>Changer</h1>
      <>
        {/* <TrendingSoonHero /> */}
        <Flex flexDirection="column" style={{ gap: '16px' }}>
          <FilterBar
            isChangerPage={true}
            activeTab={undefined}
            filter={filter}
            setFilter={setFilter}
            sortSettings={sortSettings}
            setSortSettings={setSortSettings}
          />
        </Flex>
        {/* <Table filter={filter} sortSettings={sortSettings} setFilter={setFilter} setSortSettings={setSortSettings} /> */}
        <Table />
      </>
    </PageWrapper>
  )
}

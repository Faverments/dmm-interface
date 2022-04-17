import React, { useEffect, useState } from 'react'
import { useDiscoverProMode } from 'state/user/hooks'
import { RouteComponentProps } from 'react-router-dom'
import usePaserQueryString from 'hooks/useParsedQueryString'
import { TrueSightTokenData } from 'pages/TrueSight/hooks/useGetTrendingSoonData'
import { ChainId } from '@dynamic-amm/sdk'

import { Flex } from 'rebass'
import { TrueSightPageWrapper } from 'pages/TrueSight/styled'
import TrendingSoonHero from 'pages/TrueSight/TrendingSoonHero'
import TrendingHero from 'pages/TrueSight/TrendingHero'
import TrueSightTab from 'pages/TrueSight/TrueSightTab'

import FilterBar from 'pages/DiscoverPro/components/FilterBar'

import {
  TrueSightTabs,
  TrueSightChartCategory,
  TrueSightTimeframe,
  TrueSightFilter,
  TrueSightSortSettings,
} from 'pages/TrueSight'

export enum PercentChangeMode {
  PREDICTED_TO_CURRENT = 'predicted_to_current',
  DISCOVER_TO_CURRENT = 'discover_to_current',
  LAST_24H = 'last_24h',
  LAST_7D = 'last_7d',
}

export enum TokenStatus {
  NEW_DISCOVER = 'NEW_DISCOVER',
  CHANGE_DISCOVER = 'CHANGE_DISCOVER',
  PREVIOUS_PREDICT = 'PREVIOUS_PREDICT',
  NEXT_PREDICT = 'NEXT_PREDICT',
}
console.log('DiscoverPro/index.tsx')

export interface DiscoverProFilter extends TrueSightFilter {
  selectedPercentChangeMode: PercentChangeMode
  selectedTokenStatus: TokenStatus | undefined
  // IN_DEV : add token data detail ( add to selectedTokenData )
}

export interface DiscoverProSortSettings extends Omit<TrueSightSortSettings, 'sortBy'> {
  sortBy: 'rank' | 'name' | 'discovered_on' | 'last_rank' | 'trading_volume_percent' | 'price_change_percent'
  //     | 'trading_volume'
  //     | 'price'
}

export default function DiscoverPro({ history }: RouteComponentProps) {
  const { tab } = usePaserQueryString()
  const [activeTab, setActiveTab] = useState<TrueSightTabs>()
  const [filter, setFilter] = useState<DiscoverProFilter>({
    isShowTrueSightOnly: false,
    timeframe: TrueSightTimeframe.ONE_DAY,
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedPercentChangeMode: PercentChangeMode.PREDICTED_TO_CURRENT,
    selectedTokenStatus: undefined,
  })

  const [sortSettings, setSortSettings] = useState<DiscoverProSortSettings>({ sortBy: 'rank', sortDirection: 'asc' })
  const isDiscoverProMode = useDiscoverProMode()

  useEffect(() => {
    if (!isDiscoverProMode) {
      history.push('/discover')
    }
    if (tab === undefined) {
      history.push({ search: '?tab=' + TrueSightTabs.TRENDING_SOON })
    } else {
      setActiveTab(tab as TrueSightTabs)
      setFilter({
        isShowTrueSightOnly: false,
        timeframe: TrueSightTimeframe.ONE_DAY,
        selectedTag: undefined,
        selectedTokenData: undefined,
        selectedNetwork: undefined,
        selectedPercentChangeMode: PercentChangeMode.PREDICTED_TO_CURRENT,
        selectedTokenStatus: undefined,
      })
      setSortSettings({ sortBy: 'rank', sortDirection: 'asc' })
    }
  }, [history, tab, isDiscoverProMode])
  return (
    <TrueSightPageWrapper>
      <TrueSightTab activeTab={activeTab} />
      {activeTab === TrueSightTabs.TRENDING_SOON && (
        <>
          <TrendingSoonHero />
          <Flex flexDirection="column" style={{ gap: '16px' }}>
            <FilterBar
              activeTab={TrueSightTabs.TRENDING_SOON}
              filter={filter}
              setFilter={setFilter}
              sortSettings={sortSettings}
              setSortSettings={setSortSettings}
            />
          </Flex>
        </>
      )}
      {activeTab === TrueSightTabs.TRENDING && (
        <>
          <TrendingHero />
          <Flex flexDirection="column" style={{ gap: '16px' }}>
            <FilterBar
              activeTab={TrueSightTabs.TRENDING_SOON}
              filter={filter}
              setFilter={setFilter}
              sortSettings={sortSettings}
              setSortSettings={setSortSettings}
            />
          </Flex>
        </>
      )}
    </TrueSightPageWrapper>
  )
}

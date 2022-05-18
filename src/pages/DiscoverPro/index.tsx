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
import TrendingSoonLayout from 'pages/DiscoverPro/components/TrendingSoonLayout'

import {
  TrueSightTabs,
  TrueSightChartCategory,
  TrueSightTimeframe,
  TrueSightFilter,
  TrueSightSortSettings,
} from 'pages/TrueSight'
import { number } from '@lingui/core/cjs/formats'
import Calendar from 'components/Calendar'

export enum PercentChangeMode {
  PREDICTED_TO_CURRENT = 'predicted_to_current',
  DISCOVER_TO_CURRENT = 'discover_to_current',
  LAST_24H = 'last_24h',
  LAST_7D = 'last_7d',
}

export enum PreferenceMode {
  PERCENT = 'percent',
  VALUE = 'value',
}

export enum TokenStatus {
  NEW_DISCOVER = 'NEW_DISCOVER',
  CHANGE_DISCOVER = 'CHANGE_DISCOVER',
  PREVIOUS_PREDICT = 'PREVIOUS_PREDICT',
  NEXT_PREDICT = 'NEXT_PREDICT',
}

export enum LayoutMode {
  TABLE_LARGE,
  TABLE_WITH_DETAILS,
}

export interface PredictedDate {
  mediumDate: number
  firstDate: number
  index: number
}

export interface DiscoverProFilter extends TrueSightFilter {
  selectedPercentChangeMode: PercentChangeMode
  selectedPreferenceMode: PreferenceMode
  selectedTokenStatus: TokenStatus | undefined
  layoutMode: LayoutMode | undefined
  selectedPredictedDate: PredictedDate | undefined
  // IN_DEV : add token data detail ( add to selectedTokenData )
}

export interface DiscoverProSortSettings extends Omit<TrueSightSortSettings, 'sortBy'> {
  sortBy:
    | 'rank'
    | 'name'
    | 'discovered_on'
    | 'last_rank'
    | 'trading_volume_percent'
    | 'price_change_percent'
    | 'price'
    | 'volume'
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
    selectedPreferenceMode: PreferenceMode.PERCENT,
    selectedTokenStatus: undefined,
    layoutMode: LayoutMode.TABLE_WITH_DETAILS,
    selectedPredictedDate: undefined,
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
        selectedPreferenceMode: PreferenceMode.PERCENT,
        selectedTokenStatus: undefined,
        layoutMode: LayoutMode.TABLE_WITH_DETAILS,
        selectedPredictedDate: undefined,
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
              isChangerPage={false}
              activeTab={TrueSightTabs.TRENDING_SOON}
              filter={filter}
              setFilter={setFilter}
              sortSettings={sortSettings}
              setSortSettings={setSortSettings}
            />
          </Flex>
          <TrendingSoonLayout
            filter={filter}
            setFilter={setFilter}
            sortSettings={sortSettings}
            setSortSettings={setSortSettings}
          />
        </>
      )}
      {activeTab === TrueSightTabs.TRENDING && (
        <>
          <TrendingHero />
          <Flex flexDirection="column" style={{ gap: '16px' }}>
            <FilterBar
              isChangerPage={false}
              activeTab={TrueSightTabs.TRENDING_SOON}
              filter={filter}
              setFilter={setFilter}
              sortSettings={sortSettings}
              setSortSettings={setSortSettings}
            />
          </Flex>
          {/* <Calendar /> */}
        </>
      )}
    </TrueSightPageWrapper>
  )
}

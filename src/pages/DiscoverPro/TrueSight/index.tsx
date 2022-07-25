import React, { useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { TrueSightFilter, TrueSightSortSettings, TrueSightTabs, TrueSightTimeframe } from 'pages/TrueSight'
import { RouteComponentProps, useLocation } from 'react-router-dom'

import { Flex, Text } from 'rebass'

import { TrueSightPageWrapper } from 'pages/TrueSight/styled'
import TrendingSoonHero from 'pages/DiscoverPro/TrueSight/TrendingSoonHero'
import TrendingHero from 'pages/DiscoverPro/TrueSight/TrendingHero'
import TrueSightTab from 'pages/TrueSight/TrueSightTab'
import FilterBar from 'pages/DiscoverPro/components/FilterBar/index'

import { TableDetail, TokenStatus, SortDirection, LayoutMode } from 'constants/discoverPro'

import TrendingLayout from '../components/TrendingLayout'
import TrendingSoonLayout from '../components/TrendingSoonLayout'
import TrendingLayoutDefault from '../components/TrendingLayout/TableLargeLayout'
import TrendingSoonLayoutDefault from '../components/TrendingSoonLayout/TableWithDetailsLayout'

import styled from 'styled-components'
import { ButtonPrimary } from 'components/Button'
import { Tool } from 'react-feather'
import useTheme from 'hooks/useTheme'

import { Trans } from '@lingui/macro'

export type TableDetailObject = {
  // name: string
  template: string
}

type TableDetailDisplayAll = {
  [key in TableDetail]: TableDetailObject
}

type TableDetailDisplaySome = {
  [key in TableDetail]?: TableDetailObject
}

export const tableDetailsDisplay: TableDetailDisplayAll = {
  [TableDetail.RANK]: {
    // name: 'Rank',
    template: '0.15fr',
  },
  [TableDetail.NAME]: {
    // name: 'Name',
    template: '1.5fr',
  },
  [TableDetail.DISCOVERED_ON]: {
    // name: 'Discovered On',
    template: '2fr',
  },
  [TableDetail.LAST_RANK]: {
    // name: 'Last Rank',
    template: '1.5fr',
  },

  [TableDetail.CURRENT_PRICE]: {
    // name: 'Current Price',
    template: '1.25fr',
  },
  [TableDetail.CURRENT_VOLUME_24H]: {
    // name: 'Current Volume',
    template: '1fr',
  },
  [TableDetail.CURRENT_MARKET_CAP]: {
    // name: 'Current Market Cap',
    template: '1fr',
  },
  [TableDetail.CURRENT_NUMBER_HOLDERS]: {
    // name: 'Current Number of Holders',
    template: '1fr',
  },
  [TableDetail.CURRENT_PRICE_CHANGE_PERCENTAGE_24H]: {
    // name: 'Current Price Change %',
    template: '1.5fr',
  },

  [TableDetail.PREDICTED_PRICE]: {
    // name: 'Predicted Price',
    template: '1fr',
  },
  [TableDetail.PREDICTED_VOLUME_24H]: {
    // name: 'Predicted Volume',
    template: '1.5fr',
  },
  [TableDetail.PREDICTED_MARKET_CAP]: {
    // name: 'Predicted Market Cap',
    template: '1.5fr',
  },
  [TableDetail.PREDICTED_NUMBER_HOLDERS]: {
    // name: 'Predicted Number of Holders',
    template: '1.5fr',
  },
  [TableDetail.PREDICTED_PRICE_CHANGE_PERCENTAGE_24H]: {
    // name: 'Predicted Price Change %',
    template: '1.5fr',
  },

  [TableDetail.PRICE_CHANGE_PERCENTAGE_FROM_PREDICTED]: {
    // name: 'Price Change % from Predicted',
    template: '1.5fr',
  },
  [TableDetail.VOLUME_CHANGE_PERCENTAGE__FROM_PREDICTED]: {
    // name: 'Volume Change % from Predicted',
    template: '1.5fr',
  },
  [TableDetail.ACTION]: {
    template: '1fr',
  },
}

export interface DiscoverProFilter extends TrueSightFilter {
  selectedTokenStatus: TokenStatus | undefined
  selectedLayoutMode: LayoutMode
  isShowTokensBeforeChange?: boolean
}

// export interface DiscoverProSortSettings extends Omit<TrueSightSortSettings, 'sortBy'> {
export interface DiscoverProSortSettings {
  sortBy: TableDetail
  sortDirection: SortDirection
}

export const initialSortSettings: DiscoverProSortSettings = {
  sortBy: TableDetail.RANK,
  sortDirection: SortDirection.ASC,
}

export const initialTableCustomize: TableDetail[] = [
  TableDetail.RANK,
  TableDetail.NAME,
  TableDetail.CURRENT_PRICE,
  TableDetail.CURRENT_VOLUME_24H,
  TableDetail.CURRENT_MARKET_CAP,
  TableDetail.CURRENT_NUMBER_HOLDERS,
  TableDetail.ACTION,
]

export default function DiscoverPro({ history }: RouteComponentProps) {
  const { tab } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState<TrueSightTabs>()
  const initialFilter = (): DiscoverProFilter => ({
    isShowTrueSightOnly: false,
    timeframe: TrueSightTimeframe.ONE_DAY,
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedTokenStatus: undefined,
    selectedLayoutMode: tab === TrueSightTabs.TRENDING_SOON ? LayoutMode.TABLE_LARGE : LayoutMode.TABLE_WITH_DETAILS,
  })
  const [filter, setFilter] = useState<DiscoverProFilter>(initialFilter)
  const [sortSettings, setSortSettings] = useState<DiscoverProSortSettings>(initialSortSettings)
  const [tableCustomize, setTableCustomize] = useState<TableDetail[]>(initialTableCustomize)
  useEffect(() => {
    if (tab === undefined) {
      history.push({ search: '?tab=' + TrueSightTabs.TRENDING_SOON })
    } else {
      setActiveTab(tab as TrueSightTabs)
      setFilter(initialFilter)
      setSortSettings(initialSortSettings)
      setTableCustomize(initialTableCustomize)
    }
  }, [history, tab])

  const theme = useTheme()
  return (
    <TrueSightPageWrapper>
      <Flex justifyContent="space-between">
        <TrueSightTab activeTab={activeTab} />
        <ButtonPrimary
          width="max-content"
          // onClick={() => setShowModalTutorial(true)}
          padding="10px 12px"
          style={{ gap: '4px', fontSize: '14px', height: 'fit-content' }}
        >
          <Tool color={theme.textReverse} size={16} />
          <Trans>Visible</Trans>
        </ButtonPrimary>
      </Flex>

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
              tableCustomize={tableCustomize}
              setTableCustomize={setTableCustomize}
            />
            {filter.selectedLayoutMode === LayoutMode.TABLE_LARGE && (
              <TrendingSoonLayout
                filter={filter}
                sortSettings={sortSettings}
                setFilter={setFilter}
                setSortSettings={setSortSettings}
                tableCustomize={tableCustomize}
                setTableCustomize={setTableCustomize}
              />
            )}
            {filter.selectedLayoutMode === LayoutMode.TABLE_WITH_DETAILS && (
              <TrendingSoonLayoutDefault
                filter={filter}
                sortSettings={sortSettings}
                setFilter={setFilter}
                setSortSettings={setSortSettings}
              />
            )}
          </Flex>
        </>
      )}
      {activeTab === TrueSightTabs.TRENDING && (
        <>
          <TrendingHero />
          <Flex flexDirection="column" style={{ gap: '16px' }}>
            <FilterBar
              activeTab={TrueSightTabs.TRENDING}
              filter={filter}
              setFilter={setFilter}
              sortSettings={sortSettings}
              setSortSettings={setSortSettings}
              tableCustomize={tableCustomize}
              setTableCustomize={setTableCustomize}
            />
            {filter.selectedLayoutMode === LayoutMode.TABLE_WITH_DETAILS && (
              <TrendingLayout
                filter={filter}
                setFilter={setFilter}
                sortSettings={sortSettings}
                setSortSettings={setSortSettings}
              />
            )}
            {filter.selectedLayoutMode === LayoutMode.TABLE_LARGE && (
              <TrendingLayoutDefault
                filter={filter as TrueSightFilter}
                setFilter={setFilter as React.Dispatch<React.SetStateAction<TrueSightFilter>>}
              />
            )}
          </Flex>
        </>
      )}
    </TrueSightPageWrapper>
  )
}

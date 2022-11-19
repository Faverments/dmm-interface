import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { t, Trans } from '@lingui/macro'
import { Flex } from 'rebass'
import { useMedia } from 'react-use'

import {
  TextTooltip,
  TrueSightFilterBarLayout,
  TrueSightFilterBarLayoutMobile,
  TrueSightFilterBarSection,
} from 'pages/TrueSight/styled'
import { TrueSightFilter, TrueSightSortSettings, TrueSightTabs, TrueSightTimeframe } from 'pages/TrueSight/index'
import TimeframePicker from 'pages/TrueSight/components/FilterBar/TimeframePicker'
import TrueSightToggle from 'pages/TrueSight/components/FilterBar/TrueSightToggle'
import useParsedQueryString from 'hooks/useParsedQueryString'
import TrueSightSearchBox from 'pages/TrueSight/components/FilterBar/TrueSightSearchBox'
import useGetTokensForSearchBox from 'pages/TrueSight/hooks/useGetTokensForSearchBox'
import useDebounce from 'hooks/useDebounce'
import useGetTagsForSearchBox from 'pages/TrueSight/hooks/useGetTagsForSearchBox'
import useTheme from 'hooks/useTheme'
import { MouseoverTooltip } from 'components/Tooltip'
import { ButtonEmpty } from 'components/Button'
import { BarChart } from 'react-feather'
import { useTrendingSoonSortingModalToggle } from 'state/application/hooks'

import { DiscoverProFilter, DiscoverProSortSettings } from 'pages/DiscoverPro/TrueSight/index'
import { TableDetail, LayoutMode, OpenMode } from 'constants/discoverPro'
import NetworkSelect from 'pages/DiscoverPro/components/FilterBar/NetworkSelect'
import ModalSorting from 'pages/DiscoverPro/components/FilterBar/ModalSorting'

import TokenStatusSelect from 'pages/DiscoverPro/components/FilterBar/TokenStatusSelect'
import ResetFilter from 'pages/DiscoverPro/components/FilterBar/ResetFilter'
import TableCustomize from 'pages/DiscoverPro/components/FilterBar/TableCustomize'
import LayoutPicker from './LayoutPicker'
import styled from 'styled-components'
import TrendingToggle from './TrendingToggle'
import OpenModeSelect from './OpenModelSelect'

interface FilterBarProps {
  activeTab: TrueSightTabs | undefined
  filter: DiscoverProFilter
  setFilter: React.Dispatch<React.SetStateAction<DiscoverProFilter>>
  sortSettings: DiscoverProSortSettings
  setSortSettings: React.Dispatch<React.SetStateAction<DiscoverProSortSettings>>
  tableCustomize: TableDetail[]
  setTableCustomize: React.Dispatch<React.SetStateAction<TableDetail[]>>
}

const DiscoverProFilterBarLayout = styled.div<{ isComparePage: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: ${({ theme, isComparePage }) => (isComparePage ? theme.bg10 : undefined)}; */
`

export default function FilterBar({
  activeTab,
  filter,
  setFilter,
  sortSettings,
  setSortSettings,
  tableCustomize,
  setTableCustomize,
}: FilterBarProps) {
  const isActiveTabTrending = activeTab === TrueSightTabs.TRENDING
  const isActiveTabTrendingSoon = activeTab === TrueSightTabs.TRENDING_SOON
  const isTableLargeLayoutMode = filter.selectedLayoutMode === LayoutMode.TABLE_LARGE
  const { pathname } = useLocation()
  const isTrueSightPage = pathname.includes('/truesight')
  const isHistoryPage = pathname.includes('/history')
  const isComparePage = pathname.includes('/compare')

  const above1000 = useMedia('(min-width: 1000px)')

  const queryString = useParsedQueryString()

  const setActiveTimeframe = (timeframe: TrueSightTimeframe) => {
    setFilter(prev => ({ ...prev, timeframe }))
  }

  const setLayoutMode = (selectedLayoutMode: LayoutMode) => {
    setFilter(prev => ({ ...prev, selectedLayoutMode }))
  }
  const setOpenMode = (selectedOpenMode: OpenMode) => {
    setFilter(prev => ({ ...prev, selectedOpenMode }))
  }

  const [searchText, setSearchText] = useState('')

  const resetFilter = () => {
    setFilter(prev => ({
      ...prev,
      isShowTrueSightOnly: false,
      selectedTag: undefined,
      selectedTokenData: undefined,
      selectedNetwork: undefined,
      selectedTokenStatus: undefined,
    }))
    setSearchText('')
  }

  const debouncedSearchText = useDebounce(searchText.toLowerCase().trim(), 200)

  const { data: foundTokens } = useGetTokensForSearchBox(
    debouncedSearchText,
    filter.timeframe,
    filter.isShowTrueSightOnly,
  )
  const { data: foundTags } = useGetTagsForSearchBox(debouncedSearchText)

  const theme = useTheme()

  const toggleSortingModal = useTrendingSoonSortingModalToggle()

  const { tab } = useParsedQueryString()
  const tooltipText =
    tab === TrueSightTabs.TRENDING_SOON
      ? t`You can choose to see the tokens with the highest growth potential over the last 24 hours or 7 days ${
          !isComparePage ? 'and LAYOUT MODE.' : ''
        } `
      : t`You can choose to see currently trending tokens over the last 24 hours or 7 days ${
          !isComparePage ? 'and LAYOUT MODE.' : ''
        } `

  return above1000 ? (
    <DiscoverProFilterBarLayout isComparePage={isComparePage}>
      <TrueSightFilterBarSection style={{ gap: '8px' }}>
        <MouseoverTooltip text={tooltipText}>
          <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
            {isComparePage ? <Trans>Timeframe</Trans> : <Trans>Tf &amp; Lo</Trans>}
          </TextTooltip>
        </MouseoverTooltip>
        <TimeframePicker activeTimeframe={filter.timeframe} setActiveTimeframe={setActiveTimeframe} />
        {!isComparePage && <LayoutPicker activeMode={filter.selectedLayoutMode} setActiveMode={setLayoutMode} />}
        {/* {isActiveTabTrendingSoon && isTrueSightPage && (
          <OpenModeSelect activeMode={filter.selectedOpenMode} setActiveMode={setOpenMode} />
        )} */}
        {isComparePage && <TokenStatusSelect filter={filter} setFilter={setFilter} />}
        {isActiveTabTrending && isHistoryPage && (
          <TrendingToggle
            isActive={filter.isShowTokensBeforeChange}
            toggle={() => setFilter(prev => ({ ...prev, isShowTokensBeforeChange: !prev.isShowTokensBeforeChange }))}
          />
        )}
      </TrueSightFilterBarSection>
      <TrueSightFilterBarSection style={{ gap: '12px' }}>
        {isActiveTabTrending && (
          <TrueSightToggle
            isActive={filter.isShowTrueSightOnly}
            toggle={() => setFilter(prev => ({ ...prev, isShowTrueSightOnly: !prev.isShowTrueSightOnly }))}
          />
        )}
        {isActiveTabTrendingSoon && !isComparePage && <TokenStatusSelect filter={filter} setFilter={setFilter} />}
        <NetworkSelect filter={filter} setFilter={setFilter} />
        <TrueSightSearchBox
          placeholder={t`Search by token name or tag`}
          minWidth="260px"
          style={{ minWidth: '260px' }}
          foundTags={foundTags}
          foundTokens={foundTokens}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedTag={filter.selectedTag}
          setSelectedTag={tag => setFilter(prev => ({ ...prev, selectedTag: tag, selectedTokenData: undefined }))}
          selectedTokenData={filter.selectedTokenData}
          setSelectedTokenData={tokenData =>
            setFilter(prev => ({ ...prev, selectedTag: undefined, selectedTokenData: tokenData }))
          }
        />

        <ResetFilter filter={filter} resetFilter={resetFilter} />
        {isTableLargeLayoutMode && !isComparePage && (
          <TableCustomize tableCustomize={tableCustomize} setTableCustomize={setTableCustomize} />
        )}
      </TrueSightFilterBarSection>
    </DiscoverProFilterBarLayout>
  ) : (
    <TrueSightFilterBarLayoutMobile>
      <Flex justifyContent="space-between" style={{ gap: '16px' }}>
        {queryString.tab === 'trending' ? (
          <Flex justifyContent="flex-end">
            <TrueSightToggle
              isActive={filter.isShowTrueSightOnly}
              toggle={() => setFilter(prev => ({ ...prev, isShowTrueSightOnly: !prev.isShowTrueSightOnly }))}
            />
          </Flex>
        ) : (
          <>
            <ButtonEmpty
              style={{ padding: '9px 9px', background: theme.background, width: 'fit-content' }}
              onClick={toggleSortingModal}
            >
              <BarChart
                size={16}
                strokeWidth={3}
                color={theme.subText}
                style={{ transform: 'rotate(90deg) scaleX(-1)' }}
              />
            </ButtonEmpty>
            <ModalSorting sortSettings={sortSettings} setSortSettings={setSortSettings} />
          </>
        )}
        <Flex style={{ gap: '12px', alignItems: 'center' }}>
          <MouseoverTooltip text={tooltipText}>
            <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
              <Trans>Timeframe</Trans>
            </TextTooltip>
          </MouseoverTooltip>
          <TimeframePicker activeTimeframe={filter.timeframe} setActiveTimeframe={setActiveTimeframe} />
        </Flex>
      </Flex>
      <Flex style={{ gap: '16px' }}>
        <NetworkSelect filter={filter} setFilter={setFilter} />
        <TrueSightSearchBox
          placeholder={t`Token name or tag`}
          foundTags={foundTags}
          foundTokens={foundTokens}
          searchText={searchText}
          setSearchText={setSearchText}
          selectedTag={filter.selectedTag}
          setSelectedTag={tag => setFilter(prev => ({ ...prev, selectedTag: tag, selectedTokenData: undefined }))}
          selectedTokenData={filter.selectedTokenData}
          setSelectedTokenData={tokenData =>
            setFilter(prev => ({ ...prev, selectedTag: undefined, selectedTokenData: tokenData }))
          }
          style={{ flex: 1 }}
        />
      </Flex>
    </TrueSightFilterBarLayoutMobile>
  )
}

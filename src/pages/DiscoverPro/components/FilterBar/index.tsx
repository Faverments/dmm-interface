import React, { useState } from 'react'
import { TrueSightTabs, TrueSightTimeframe } from 'pages/TrueSight'
import { DiscoverProFilter, DiscoverProSortSettings } from 'pages/DiscoverPro'

import { useMedia } from 'react-use'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useDebounce from 'hooks/useDebounce'
import useGetTokensForSearchBox from 'pages/TrueSight/hooks/useGetTokensForSearchBox'
import useGetTagsForSearchBox from 'pages/TrueSight/hooks/useGetTagsForSearchBox'
import useTheme from 'hooks/useTheme'
import { useDiscoverProSortingModalToggle } from 'state/application/hooks'

import { t, Trans } from '@lingui/macro'

import { TextTooltip, TrueSightFilterBarLayoutMobile, TrueSightFilterBarSection } from 'pages/TrueSight/styled'

import { DiscoverProFilterBarRow } from 'pages/DiscoverPro/styled'

import { MouseoverTooltip } from 'components/Tooltip'
import TimeframePicker from 'pages/TrueSight/components/FilterBar/TimeframePicker'
import TrueSightToggle from 'pages/TrueSight/components/FilterBar/TrueSightToggle'
import TrueSightSearchBox from 'pages/TrueSight/components/FilterBar/TrueSightSearchBox'

import NetworkSelect from 'pages/DiscoverPro/components/FilterBar/NetworkSelect'
import ModalSorting from 'pages/DiscoverPro/components/FilterBar/ModalSorting'
import TokenStatusSelect from 'pages/DiscoverPro/components/FilterBar/TokenStatusSelect'
import TimeLinePicker from 'pages/DiscoverPro/components/FilterBar/TimeLinePicker'
import PreferencePicker from 'pages/DiscoverPro/components/FilterBar/PreferencePicker'
import ResetFilter from 'pages/DiscoverPro/components/FilterBar/ResetFilter'
import LayoutPicker from 'pages/DiscoverPro/components/FilterBar/LayoutPicker'
import DateSelect from 'pages/DiscoverPro/components/FilterBar/DateSelect'
import { PercentChangeMode, LayoutMode, PredictedDate, PreferenceMode } from 'pages/DiscoverPro/index'

import { Flex, Text } from 'rebass'
import { ButtonEmpty } from 'components/Button'
import { BarChart } from 'react-feather'

interface FilterBarProps {
  activeTab: TrueSightTabs | undefined
  filter: DiscoverProFilter
  setFilter: React.Dispatch<React.SetStateAction<DiscoverProFilter>>
  sortSettings: DiscoverProSortSettings
  setSortSettings: React.Dispatch<React.SetStateAction<DiscoverProSortSettings>>
  isChangerPage: Boolean
}

export default function FilterBar({
  activeTab,
  filter,
  setFilter,
  sortSettings,
  setSortSettings,
  isChangerPage,
}: FilterBarProps) {
  // console.log(filter)
  const isActiveTabTrending = activeTab === TrueSightTabs.TRENDING
  const isActiveTabTrendingSoon = activeTab === TrueSightTabs.TRENDING_SOON
  const above1000 = useMedia('(min-width: 1000px)')

  const queryString = useParsedQueryString()

  const setActiveTimeframe = (timeframe: TrueSightTimeframe) => {
    setFilter(prev => ({ ...prev, timeframe }))
  }
  const setActivePercentChangeMode = (percentChangeMode: PercentChangeMode) => {
    setFilter(prev => ({ ...prev, selectedPercentChangeMode: percentChangeMode }))
  }
  const setActivePredictedDate = (predictedDate: PredictedDate) => {
    setFilter(prev => ({ ...prev, selectedPredictedDate: predictedDate }))
  }
  const setActivePreferenceMode = (preferenceMode: PreferenceMode) => {
    setFilter(prev => ({ ...prev, selectedPreferenceMode: preferenceMode }))
  }

  const [searchText, setSearchText] = useState('')
  const resetFilter = () => {
    setFilter(prev => ({
      ...prev,
      isShowTrueSightOnly: false,
      selectedTag: undefined,
      selectedTokenData: undefined,
      selectedNetwork: undefined,
      selectedPercentChangeMode: PercentChangeMode.PREDICTED_TO_CURRENT,
      selectedTokenStatus: undefined,
    }))
    setSearchText('')
  }

  const setLayoutMode = (layoutMode: LayoutMode) => {
    setFilter(prev => ({ ...prev, layoutMode }))
  }

  const debouncedSearchText = useDebounce(searchText.toLowerCase().trim(), 200)

  const { data: foundTokens } = useGetTokensForSearchBox(
    debouncedSearchText,
    filter.timeframe,
    filter.isShowTrueSightOnly,
  )
  const { data: foundTags } = useGetTagsForSearchBox(debouncedSearchText)

  const theme = useTheme()

  const toggleSortingModal = useDiscoverProSortingModalToggle()

  const { tab } = useParsedQueryString()
  const tooltipTimeframeText =
    tab === TrueSightTabs.TRENDING_SOON
      ? t`You can choose to see the tokens with the highest growth potential over the last 24 hours or 7 days`
      : t`You can choose to see currently trending tokens over the last 24 hours or 7 days`
  const tooltipPercentChangeModeText = 'test'

  return above1000 ? (
    <Flex flexDirection="column" style={{ gap: '8px' }}>
      <DiscoverProFilterBarRow>
        <TrueSightFilterBarSection style={{ gap: '8px' }}>
          <DateSelect activeTimeFrame={filter.timeframe} setActivePredictedDate={setActivePredictedDate} />
        </TrueSightFilterBarSection>
        <TrueSightFilterBarSection style={{ gap: '16px' }}>
          <TokenStatusSelect filter={filter} setFilter={setFilter} />
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
        </TrueSightFilterBarSection>
      </DiscoverProFilterBarRow>
      <DiscoverProFilterBarRow>
        <TrueSightFilterBarSection style={{ gap: '8px' }}>
          {/* <MouseoverTooltip text={tooltipTimeframeText}>
            <TextTooltip
              color={theme.subText}
              fontSize="14px"
              fontWeight={500}
            >
              <Trans>Timeframe</Trans>
            </TextTooltip>
          </MouseoverTooltip> */}
          <Text
            fontSize="14px"
            fontWeight={500}
            color={theme.subText}
            style={{
              width: '102.11px',
            }}
          >
            <Trans>Timeframe</Trans>
          </Text>
          <TimeframePicker activeTimeframe={filter.timeframe} setActiveTimeframe={setActiveTimeframe} />
          {!isChangerPage && <LayoutPicker activeMode={filter.layoutMode} setActiveMode={setLayoutMode} />}
        </TrueSightFilterBarSection>
        <TrueSightFilterBarSection style={{ gap: '16px' }}>
          {isActiveTabTrending && (
            <TrueSightToggle
              isActive={filter.isShowTrueSightOnly}
              toggle={() => setFilter(prev => ({ ...prev, isShowTrueSightOnly: !prev.isShowTrueSightOnly }))}
            />
          )}
          <MouseoverTooltip text={tooltipPercentChangeModeText}>
            <TextTooltip color={theme.subText} fontSize="14px" fontWeight={500}>
              <Trans>TimeLine</Trans>
            </TextTooltip>
          </MouseoverTooltip>
          <TimeLinePicker activeMode={filter.selectedPercentChangeMode} setActiveMode={setActivePercentChangeMode} />
          <PreferencePicker activeMode={filter.selectedPreferenceMode} setActiveMode={setActivePreferenceMode} />
          <ResetFilter filter={filter} resetFilter={resetFilter} />
        </TrueSightFilterBarSection>
      </DiscoverProFilterBarRow>
    </Flex>
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
          <MouseoverTooltip text={tooltipTimeframeText}>
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

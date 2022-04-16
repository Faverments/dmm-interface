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

interface FilterBarProps {
  activeTab: TrueSightTabs | undefined
  filter: DiscoverProFilter
  setFilter: React.Dispatch<React.SetStateAction<DiscoverProFilter>>
  sortSettings: DiscoverProSortSettings
  setSortSettings: React.Dispatch<React.SetStateAction<DiscoverProSortSettings>>
}

export default function FilterBar({ activeTab, filter, setFilter, sortSettings, setSortSettings }: FilterBarProps) {
  const isActiveTabTrending = activeTab === TrueSightTabs.TRENDING
  const above1000 = useMedia('(min-width: 1000px)')

  const queryString = useParsedQueryString()

  const setActiveTimeframe = (timeframe: TrueSightTimeframe) => {
    setFilter(prev => ({ ...prev, timeframe }))
  }

  const [searchText, setSearchText] = useState('')
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
  const tooltipText =
    tab === TrueSightTabs.TRENDING_SOON
      ? t`You can choose to see the tokens with the highest growth potential over the last 24 hours or 7 days`
      : t`You can choose to see currently trending tokens over the last 24 hours or 7 days`

  return above1000 ? () : ()
}

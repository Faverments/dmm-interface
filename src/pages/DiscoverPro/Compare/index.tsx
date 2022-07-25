import React, { useState, useEffect } from 'react'
import { PoolsPageWrapper } from 'pages/Pools/styleds'
import HeroWallHeader from './HeroWallHeader'
import { Text, Flex } from 'rebass'
import { Trans } from '@lingui/macro'
import useTheme from 'hooks/useTheme'

import { useHistory } from 'react-router-dom'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'

import { TabWrapper, Tab } from 'components/YieldPools/styleds'
import styled from 'styled-components'

import DiscoverIcon from 'components/Icons/DiscoverIcon'
import TrendingIcon from 'components/Icons/TrendingIcon'
import { RouteComponentProps, useLocation } from 'react-router-dom'
import { ButtonEmpty } from 'components/Button'
import FilterBar from '../components/FilterBar'
import { DiscoverProFilter, DiscoverProSortSettings, initialSortSettings, initialTableCustomize } from '../TrueSight'
import { TrueSightTabs, TrueSightTimeframe, TrueSightFilter, TrueSightSortSettings } from 'pages/TrueSight'
import { LayoutMode, TableDetail } from 'constants/discoverPro'
import TrendingSoonLayout from './CompareTrendingSoon/CompareTrendingSoonLayout'

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.border};
  margin-right: 1.5rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 12px;
  `}
`

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media only screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`
const HistoryTitle = styled(Text)`
  font-size: 22px;
  font-weight: 500;
  padding-right: 8px;
`

const CompareTabs = ({ activeTab }: { activeTab: TrueSightTabs | undefined }) => {
  const history = useHistory()
  const { tab } = useParsedQueryString()
  const { mixpanelHandler } = useMixpanel()
  return (
    <TabContainer>
      <TabWrapper>
        <Tab
          onClick={() => {
            if (tab !== 'trending_soon') {
              mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_SOON_CLICKED)
            }
            history.push({ search: '?tab=' + TrueSightTabs.TRENDING_SOON })
          }}
          isActive={activeTab === TrueSightTabs.TRENDING_SOON}
        >
          <HistoryTitle>
            <Trans>Trending Soon</Trans>
          </HistoryTitle>
          <DiscoverIcon size={18} />
        </Tab>
        <Divider />
        <Tab
          onClick={() => {
            if (tab !== 'trending') {
              mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
            }
            history.push({ search: '?tab=' + TrueSightTabs.TRENDING })
          }}
          isActive={activeTab === TrueSightTabs.TRENDING}
        >
          <HistoryTitle>
            <Trans>Trending</Trans>
          </HistoryTitle>
          <TrendingIcon size={18} />
        </Tab>
      </TabWrapper>
    </TabContainer>
  )
}

export default function Compare({ history }: RouteComponentProps) {
  const { tab } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState<TrueSightTabs>()
  const theme = useTheme()

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

  return (
    <>
      {/* <Text as="h1" fontSize={['20px', '38px']} textAlign="center" lineHeight={['32px', '60px']} fontWeight="300">
        <Trans>
          Compare{' '}
          <Text color={theme.primary} as="span" fontWeight="500">
            TrueSight
          </Text>{' '}
          Tokens in history
        </Trans>
      </Text> */}

      <PoolsPageWrapper>
        <CompareTabs activeTab={activeTab} />
        <HeroWallHeader />
        {activeTab === TrueSightTabs.TRENDING_SOON && (
          <>
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
              <TrendingSoonLayout filter={filter} />
            </Flex>
          </>
        )}
        {activeTab === TrueSightTabs.TRENDING && (
          <>
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
            </Flex>
          </>
        )}
      </PoolsPageWrapper>
    </>
  )
}

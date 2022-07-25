import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { PageWrapper } from 'pages/CreatePool/styled'
import ScrollContainer from 'react-indiana-drag-scroll'
// import { ScrollContainerWithGradient } from 'components/RewardTokenPrices/index'

import {
  // TopBar,
  TabWrapper,
  Tab,
  PoolTitleContainer,
  UpcomingPoolsWrapper,
  NewText,
  HistoryButton,
} from 'components/YieldPools/styleds'
import styled, { css } from 'styled-components'
import useTheme from 'hooks/useTheme'
import PredictionIcon from 'assets/images/crystal-ball.png'
import SnapshotIcon from 'assets/images/camera-icon.png'
import { Text, Flex } from 'rebass'
import { Trans } from '@lingui/macro'
import { Calendar, ArrowLeft, ArrowRight, Tool, Square, Underline } from 'react-feather'
import { darken, rgba } from 'polished'
import useParsedQueryString from 'hooks/useParsedQueryString'
import DiscoverIcon from 'components/Icons/DiscoverIcon'
import TrendingIcon from 'components/Icons/TrendingIcon'
import { useHistory } from 'react-router'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import { RouteComponentProps } from 'react-router-dom'
import { ButtonText, TrueSightPageWrapper } from 'pages/TrueSight/styled'
import HistoryTrendingSoonHero from 'pages/DiscoverPro/History/HistoryTrendingSoonHero'
import HistoryTrendingHero from 'pages//DiscoverPro/History/HistoryTrendingHero'
import { useActiveWeb3React } from 'hooks'
import useThrottle from 'hooks/useThrottle'
import { useMedia } from 'react-use'
import { DiscoverProFilter, DiscoverProSortSettings, initialSortSettings, initialTableCustomize } from '../TrueSight'
import { TrueSightTabs, TrueSightTimeframe, TrueSightFilter, TrueSightSortSettings } from 'pages/TrueSight'
import { LayoutMode, TableDetail } from 'constants/discoverPro'
import FilterBar from 'pages/DiscoverPro/components/FilterBar/index'

import TrendingLayout from '../History/components/TrendingLayout'
import TrendingSoonLayout from '../History/components/TrendingSoonLayout'
import TrendingLayoutDefault from '../History/components/TrendingLayout/TableLargeLayout'
import TrendingSoonLayoutDefault from '../History/components/TrendingSoonLayout/TableWithDetailsLayout'

import { ButtonPrimary } from 'components/Button'
import useGetTrueSightHistoryData, {
  TrueSightHistoryData,
  TrueSightHistoryResponse,
} from '../hooks/useGetTrueSightHistoryData'
import dayjs from 'dayjs'
import { TrendingHistoryData, TrendingHistoryResponse } from '../hooks/useGetTrendingHistoryData'

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.border};
  margin-right: 1.5rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 12px;
  `}
`

const PredictedDateWrapper = styled.div`
  display: flex;
  align-items: center;
  /* border-right: ${({ theme }) => `2px solid ${theme.border}`}; */
  white-space: nowrap;
`

const PredictedText = styled.span`
  margin-left: 8px;
  font-size: 24px;
  font-weight: 400;
  margin-right: 8px;
  padding-left: 8px;
  border-left: ${({ theme }) => `2px solid ${theme.border}`};
`

const DateText = styled.span`
  color: ${({ theme }) => theme.subText};
  font-size: 20px;
  /* font-style: italic; */
  /* vertical-align: bottom; */
`

const DateNavigateWarper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-left: 16px;
`

const NavigateDateButton = styled.div<{ disabled?: boolean }>`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.subText};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled
      ? css`
          background-color: ${({ theme }) => theme.buttonGray};
          color: ${({ theme }) => theme.disableText};
          cursor: not-allowed;
          pointer-events: none;
        `
      : css`
          &:hover {
            background-color: ${({ theme }) => darken(0.1, theme.primary)};
            color: ${({ theme }) => theme.textReverse};
          }
          &:active {
            transform: scale(0.9);
          }
        `};
`

const HistoryTitle = styled(Text)`
  font-size: 28px;
  font-weight: 400;
  padding-right: 8px;
  @media screen and (max-width: 728px) {
    font-size: 20px;
  }
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

const ScrollContainerWithGradient = styled.div<{ backgroundColor?: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
  max-width: calc(100% - 130px);

  &.left-visible:after,
  &.right-visible:before {
    content: '';
    display: block;
    z-index: 2;
    pointer-events: none;
    position: absolute;
    inset: 0 0 auto auto;
    width: 40px;
    height: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  &.left-visible:after {
    background: linear-gradient(to right, ${({ theme, backgroundColor }) => backgroundColor ?? theme.bg1}, transparent);
    left: 0;
  }

  &.right-visible:before {
    background: linear-gradient(to left, ${({ theme, backgroundColor }) => backgroundColor ?? theme.bg1}, transparent);
    right: 0;
  }
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 32px; */
`

const HistoryTabs = ({ activeTab }: { activeTab: TrueSightTabs | undefined }) => {
  const history = useHistory()
  const { tab } = useParsedQueryString()
  const { mixpanelHandler } = useMixpanel()
  const above728 = useMedia('(min-width: 728px)')
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
          <DiscoverIcon size={above728 ? 20 : 16} />
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
          <TrendingIcon size={above728 ? 20 : 16} />
        </Tab>
      </TabWrapper>
    </TabContainer>
  )
}

const StyledIconHeader = styled.img`
  width: 42px;
  @media screen and (max-width: 728px) {
    width: 30px;
  }
`

const PredictedTimeHeader = ({
  activeTab,
  headerDetails,
}: {
  activeTab: TrueSightTabs | undefined
  headerDetails: HeaderDetails
}) => {
  const scrollRef = useRef(null)
  const contentRef: any = useRef(null)
  const shadowRef: any = useRef(null)
  const handleShadow = useThrottle(() => {
    const element: any = scrollRef.current
    if (element?.scrollLeft > 0) {
      shadowRef.current?.classList.add('left-visible')
    } else {
      shadowRef.current?.classList.remove('left-visible')
    }

    if (contentRef.current?.scrollWidth - element?.scrollLeft > element?.clientWidth) {
      shadowRef.current?.classList.add('right-visible')
    } else {
      shadowRef.current?.classList.remove('right-visible')
    }
  }, 300)

  useEffect(() => {
    window.addEventListener('resize', handleShadow)
    return () => window.removeEventListener('resize', handleShadow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handleShadow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const above768 = useMedia('(min-width: 768px)')
  return (
    // IN_FIX piker date button bị ra ngoài layout nếu để scroll container quá dài ( trên mobile còn lỗi )
    <ScrollContainerWithGradient ref={shadowRef}>
      <ScrollContainer innerRef={scrollRef} vertical={false} className="scroll-container" onScroll={handleShadow}>
        <div
          style={{
            display: 'flex',
          }}
          ref={contentRef}
        >
          <PredictedDateWrapper>
            {activeTab == TrueSightTabs.TRENDING_SOON && (
              <>
                <StyledIconHeader src={PredictionIcon} alt="predicted date" />
                <PredictedText>
                  {above768 && 'Predicted Time :'}{' '}
                  <DateText>
                    {headerDetails.predictedTime
                      ? dayjs(headerDetails.predictedTime * 1000).format('h:m A - MMM D')
                      : ''}
                  </DateText>
                </PredictedText>
              </>
            )}
            {activeTab == TrueSightTabs.TRENDING && (
              <>
                <StyledIconHeader src={SnapshotIcon} alt="predicted date" />
                <PredictedText>
                  {above768 && 'Snapshot Time :'}{' '}
                  <DateText>
                    {headerDetails.snapshotTime
                      ? dayjs(new Date(headerDetails.snapshotTime)).format('h:m A - MMM D')
                      : ''}
                  </DateText>
                </PredictedText>
              </>
            )}
          </PredictedDateWrapper>
        </div>
      </ScrollContainer>
    </ScrollContainerWithGradient>
  )
}

const defaultFilter = {
  isShowTrueSightOnly: false,
  selectedTag: undefined,
  selectedTokenData: undefined,
  selectedNetwork: undefined,
  selectedTokenStatus: undefined,
  isShowTokensBeforeChange: false,
}
export interface HeaderDetails {
  predictedTime: number | undefined
  snapshotTime: string | undefined
  disablePreviousButton: boolean
  disableNextButton: boolean
  current_data_id: string | undefined
  previous_data_id: string | undefined
  next_data_id: string | undefined
  selected_id: string | undefined
  isLoading: boolean
  fakeLoading: boolean
}

const History = ({ history }: RouteComponentProps) => {
  console.log('render')
  const theme = useTheme()
  const { tab } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState<TrueSightTabs>()
  const initialFilter = (): DiscoverProFilter => ({
    isShowTrueSightOnly: false,
    timeframe: TrueSightTimeframe.ONE_DAY,
    selectedTag: undefined,
    selectedTokenData: undefined,
    selectedNetwork: undefined,
    selectedTokenStatus: undefined,
    selectedLayoutMode: tab === TrueSightTabs.TRENDING_SOON ? LayoutMode.TABLE_WITH_DETAILS : LayoutMode.TABLE_LARGE,
    isShowTokensBeforeChange: false,
  })
  const [filter, setFilter] = useState<DiscoverProFilter>(initialFilter)
  const [sortSettings, setSortSettings] = useState<DiscoverProSortSettings>(initialSortSettings)
  const [tableCustomize, setTableCustomize] = useState<TableDetail[]>(initialTableCustomize)
  const [headerDetails, setHeaderDetails] = useState<HeaderDetails>({
    predictedTime: undefined,
    snapshotTime: undefined,
    disablePreviousButton: true,
    disableNextButton: true,
    current_data_id: undefined,
    previous_data_id: undefined,
    next_data_id: undefined,
    selected_id: undefined,
    isLoading: true,
    fakeLoading: false,
  })
  const [trueSightHistoryResponse, setTrueSightHistoryResponse] = useState<TrueSightHistoryResponse>({
    previous_data: null,
    current_data: null,
    next_data: null,
  })
  // const [trendingHistoryData, setTrendingHistoryData] = useState<TrendingHistoryData>()
  const [trueSightHistoryData, setTrueSightHistoryData] = useState<TrueSightHistoryData | null>(null)

  useEffect(() => {
    if (tab === undefined) {
      history.push({ search: '?tab=' + TrueSightTabs.TRENDING_SOON })
    } else {
      setActiveTab(tab as TrueSightTabs)
      setFilter(initialFilter)
      setSortSettings(initialSortSettings)
      setTableCustomize(initialTableCustomize)
      setTrueSightHistoryData(null)
      setHeaderDetails(pre => ({
        ...pre,
        id: undefined,
      }))
    }
  }, [history, tab])

  useEffect(() => {
    setHeaderDetails(pre => ({
      ...pre,
      snapshotTime: trueSightHistoryData?.createAt,
      predictedTime: trueSightHistoryData?.data.tokens[0].predicted_date,
      disablePreviousButton: trueSightHistoryResponse.previous_data === null,
      disableNextButton: trueSightHistoryResponse.next_data === null,
      current_data_id: trueSightHistoryResponse.current_data?._id,
      previous_data_id: trueSightHistoryResponse.previous_data?._id,
      next_data_id: trueSightHistoryResponse.next_data?._id,
    }))
  }, [trueSightHistoryResponse, trueSightHistoryData])
  const above768 = useMedia('(min-width: 768px)')

  // const scrollRef = useRef(null)

  // const executeScroll = () => {
  //   // IN_DEV fix performance issue
  //   setTimeout(() => {
  //     const element: any = scrollRef.current
  //     element.scrollIntoView({ behavior: 'smooth' })
  //   }, 100)
  // }
  const scrollToDiv = () => {
    window.scrollTo({
      top: 300,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    setTimeout(() => {
      setHeaderDetails(pre => ({
        ...pre,
        fakeLoading: false,
      }))
    }, 100)
  }, [headerDetails.fakeLoading])

  return (
    <TrueSightPageWrapper>
      <Flex flexDirection="column" style={{ gap: 32 }}>
        <Flex justifyContent="space-between">
          <HistoryTabs activeTab={activeTab} />
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
        <TopBar>
          <PredictedTimeHeader activeTab={activeTab} headerDetails={headerDetails} />
          <DateNavigateWarper>
            <NavigateDateButton
              disabled={headerDetails.disablePreviousButton || headerDetails.isLoading}
              onClick={() => {
                // scrollToDiv()
                setTrueSightHistoryData(trueSightHistoryResponse.previous_data)
                setHeaderDetails(pre => ({
                  ...pre,
                  selected_id: pre.previous_data_id,
                  fakeLoading: true,
                }))
                setFilter(pre => ({
                  ...pre,
                  ...defaultFilter,
                }))
              }}
            >
              <ArrowLeft size={20} />
            </NavigateDateButton>
            <NavigateDateButton
              onClick={() => {
                // scrollToDiv()
                if (headerDetails.selected_id !== undefined) {
                  setTrueSightHistoryData(null)
                }
                setHeaderDetails(pre => ({
                  ...pre,
                  selected_id: undefined,
                  fakeLoading: true,
                }))
                setFilter(pre => ({
                  ...pre,
                  ...defaultFilter,
                }))
              }}
            >
              <Square size={20} />
            </NavigateDateButton>
            <NavigateDateButton
              disabled={headerDetails.disableNextButton || headerDetails.isLoading}
              onClick={() => {
                // scrollToDiv()
                setTrueSightHistoryData(trueSightHistoryResponse.next_data)
                setHeaderDetails(pre => ({
                  ...pre,
                  selected_id: pre.next_data_id,
                  fakeLoading: true,
                }))
                setFilter(pre => ({
                  ...pre,
                  ...defaultFilter,
                }))
              }}
            >
              <ArrowRight size={20} />
            </NavigateDateButton>
            <NavigateDateButton>
              <Calendar size={20} />
            </NavigateDateButton>
          </DateNavigateWarper>
        </TopBar>
      </Flex>
      {/* <div> */}
      {/* <div ref={scrollRef}></div> */}
      {activeTab === TrueSightTabs.TRENDING_SOON && (
        <>
          <HistoryTrendingSoonHero />
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
                headerDetails={headerDetails}
                setHeaderDetails={setHeaderDetails}
                trueSightHistoryData={trueSightHistoryData}
                setTrueSightHistoryData={setTrueSightHistoryData}
                trueSightHistoryResponse={trueSightHistoryResponse}
                setTrueSightHistoryResponse={setTrueSightHistoryResponse}
              />
            )}
          </Flex>
        </>
      )}
      {activeTab === TrueSightTabs.TRENDING && (
        <>
          <HistoryTrendingHero />
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
                filter={filter}
                setFilter={setFilter}
                headerDetails={headerDetails}
                setHeaderDetails={setHeaderDetails}
                trendingHistoryData={trueSightHistoryData as TrendingHistoryData | null}
                setTrendingHistoryData={
                  setTrueSightHistoryData as React.Dispatch<React.SetStateAction<TrendingHistoryData | null>>
                }
                trendingHistoryResponse={trueSightHistoryResponse as TrendingHistoryResponse}
                setTrendingHistoryResponse={
                  setTrueSightHistoryResponse as React.Dispatch<React.SetStateAction<TrendingHistoryResponse>>
                }
              />
            )}
          </Flex>
        </>
      )}
      {/* </div> */}
    </TrueSightPageWrapper>
  )
}
export default History

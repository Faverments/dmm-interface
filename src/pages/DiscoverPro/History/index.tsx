import React, { useState, useEffect, useRef } from 'react'
import { PageWrapper } from 'pages/CreatePool/styled'
import ScrollContainer from 'react-indiana-drag-scroll'
import { ScrollContainerWithGradient } from 'components/RewardTokenPrices/index'

import {
  TopBar,
  TabWrapper,
  Tab,
  PoolTitleContainer,
  UpcomingPoolsWrapper,
  NewText,
  HistoryButton,
  Divider,
} from 'components/YieldPools/styleds'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import PredictionIcon from 'assets/images/crystal-ball.png'
import { Text } from 'rebass'
import { Trans } from '@lingui/macro'
import { Calendar, ArrowLeft, ArrowRight } from 'react-feather'
import { darken, rgba } from 'polished'
import useParsedQueryString from 'hooks/useParsedQueryString'
import DiscoverIcon from 'components/Icons/DiscoverIcon'
import TrendingIcon from 'components/Icons/TrendingIcon'
import { TrueSightTabs } from 'pages/TrueSight'
import { useHistory } from 'react-router'
import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import { RouteComponentProps } from 'react-router-dom'
import { TrueSightPageWrapper } from 'pages/TrueSight/styled'
import HistoryTrendingSoonHero from 'pages/DiscoverPro/History/HistoryTrendingSoonHero'
import HistoryTrendingHero from 'pages//DiscoverPro/History/HistoryTrendingHero'
import { useActiveWeb3React } from 'hooks'
import useThrottle from 'hooks/useThrottle'
import { useMedia } from 'react-use'

const PredictedDateWrapper = styled.div`
  display: flex;
  align-items: center;
  /* border-right: ${({ theme }) => `2px solid ${theme.border}`}; */
  white-space: nowrap;
`

const PredictedText = styled.span`
  margin-left: 8px;
  font-size: 20px;
  font-weight: 400;
  margin-right: 8px;
  padding-left: 8px;
  border-left: ${({ theme }) => `2px solid ${theme.border}`};
`
const DateText = styled.span`
  color: ${({ theme }) => theme.subText};
  font-size: 17px;
  vertical-align: bottom;
`

const DateNavigateWarper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-left: 16px;
`

const NavigateButton = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.subText};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.primary)};
    color: ${({ theme }) => theme.textReverse};
  }
  &:active {
    transform: scale(0.9);
  }
`
const DatePickerButton = styled(NavigateButton)`
  margin-left: auto;
  white-space: nowrap;
  font-size: 17px;
  font-weight: 400;

  @media only screen and (min-width: 768px) {
    svg {
      vertical-align: bottom;
      margin-right: 6px;
    }
  }
`

const HistoryTitle = styled(Text)`
  font-size: 20px;
  font-weight: 400;
  padding-right: 8px;
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

const HistoryTabs = ({ activeTab }: { activeTab: TrueSightTabs | undefined }) => {
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

const PredictedTimeHeader = () => {
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
            <img
              src={PredictionIcon}
              alt="predicted date"
              style={{
                width: 24,
              }}
            />
            <PredictedText>
              {above768 && 'Predicted Time :'} <DateText> 7:15 AM - Jun 12, 2022</DateText>
            </PredictedText>
          </PredictedDateWrapper>
        </div>
      </ScrollContainer>
    </ScrollContainerWithGradient>
  )
}

const History = ({ history }: RouteComponentProps) => {
  const theme = useTheme()
  const { tab } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState<TrueSightTabs>()
  useEffect(() => {
    if (tab === undefined) {
      history.push({ search: '?tab=' + TrueSightTabs.TRENDING_SOON })
    } else {
      setActiveTab(tab as TrueSightTabs)
    }
  }, [history, tab])
  const above768 = useMedia('(min-width: 768px)')
  return (
    <TrueSightPageWrapper>
      <div>
        <TopBar>
          <PredictedTimeHeader />
          <DateNavigateWarper>
            <NavigateButton>
              <ArrowLeft size={20} />
            </NavigateButton>
            <NavigateButton>
              <ArrowRight size={20} />
            </NavigateButton>
            <DatePickerButton>
              <Calendar size={20} />
              {above768 && <Trans>Picker</Trans>}
            </DatePickerButton>
            {/* {above768 && (
              <DatePickerButton>
                <Calendar size={20} />
                {above768 && <Trans>Picker</Trans>}
              </DatePickerButton>
            )} */}
          </DateNavigateWarper>
        </TopBar>
        <HistoryTabs activeTab={activeTab} />
      </div>
      {activeTab === TrueSightTabs.TRENDING_SOON && (
        <>
          <HistoryTrendingSoonHero />
        </>
      )}
      {activeTab === TrueSightTabs.TRENDING && (
        <>
          <HistoryTrendingHero />
        </>
      )}
    </TrueSightPageWrapper>
  )
}
export default History

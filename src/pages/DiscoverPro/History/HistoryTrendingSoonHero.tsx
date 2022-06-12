import React from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/macro'

import TrendingSoonHeroLaptop from 'assets/images/history_trending_soon_laptop.jpg'
import TrendingSoonHeroTablet from 'assets/images/history_trending_soon_tablet.jpg'
import TrendingSoonHeroMobile from 'assets/images/history_trending_soon_mobile.jpg'
import useTheme from 'hooks/useTheme'

const Hero = styled.div`
  width: 100%;
  background-image: url(${TrendingSoonHeroLaptop});
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 18px 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    background-image: url(${TrendingSoonHeroTablet});
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-image: url(${TrendingSoonHeroMobile});
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 16px;
  `}
`

const MainContent = styled.div`
  /* color: ${({ theme }) => theme.darkText}; */
  color : black;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    max-width: 70ch;
  `}

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: 60ch;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
    line-height: 20px;
  `}
`

const SubContent = styled.div`
  color: ${({ theme }) => theme.darkText};
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 8px;
    line-height: 9.38px;
  `}
`

const HistoryTrendingSoonHero = () => {
  const theme = useTheme()

  return (
    <Hero>
      <MainContent>
        <Trans>
          Here you can view Predicted Tokens in History from{' '}
          <span style={{ color: theme.primary }}>TrueSight Technology</span>, this tokens that could be trending in the
          near future
        </Trans>
      </MainContent>
      <SubContent>
        <Trans>Disclaimer: The information here should not be treated as any form of financial advice</Trans>
      </SubContent>
    </Hero>
  )
}

export default HistoryTrendingSoonHero

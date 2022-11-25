import React from 'react'
import { Flex } from 'rebass'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper'
import styled from 'styled-components/macro'

import bgimg from 'assets/images/about_background_reverse.png'
import { useIsDarkMode } from 'state/user/hooks'

import { BackgroundOverlay, LeftSideWrapper } from '../styleds'
import AppHolding from './AppHoldings'
import Apps from './Apps'
import Chains from './Chains'
import DaoMemberShip from './DaoMemberships'
import Nfts from './Nfts'
import Portfolio from './Portfolio'
import Wallet from './Wallet'

// export default function Overview({ data, return24hs }: { data: PresentedBalancePayload[]; return24hs: Return24h[] }) {
export default function Overview({ data }: { data: PresentedBalancePayload[] }) {
  const [network, setNetwork] = React.useState<Network | ALL_NETWORKS>('all-networks')
  const isDark = useIsDarkMode()
  return (
    <LayoutWrapper>
      <Wrapper>
        <BackgroundOverlay isDark={isDark}>
          <LeftSideWrapper>
            <Flex flexDirection={'column'} style={{ gap: 20 }}>
              <Chains data={data} setNetwork={setNetwork} network={network} />
              <Wallet data={data} network={network} setNetwork={setNetwork} />
              <Apps data={data} network={network} />
            </Flex>
          </LeftSideWrapper>
        </BackgroundOverlay>
      </Wrapper>
      <Flex flexDirection={'column'} style={{ gap: 20 }} height="fit-content">
        <Portfolio data={data} />
        <Nfts network={network} />
        <DaoMemberShip />
        <AppHoldingsWrapper>
          <AppHolding data={data} network={network} />
        </AppHoldingsWrapper>
      </Flex>
    </LayoutWrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  /* background-image: url(${bgimg}); */
  background-size: 100% auto;
  background-repeat: repeat-y;
  z-index: 1;
  background-color: transparent;
  background-position: top;
  -webkit-border-radius: 25px;
  -moz-border-radius: 25px;
`

const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.8fr;
  grid-gap: 20px;
  @media screen and (max-width: 1008px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 20px;
  }
`

const AppHoldingsWrapper = styled.div`
  @media only screen and (min-width: 1100px) {
    position: sticky;
    top: 16px;
  }
`

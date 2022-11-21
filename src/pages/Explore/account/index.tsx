import { rgba } from 'polished'
import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'react-feather'
import { RouteComponentProps } from 'react-router-dom'
import {
  chainParams,
  useGet24hReturn,
  useGet24hReturnAllNetworks,
  useGet24hReturnAllNetworksSync,
} from 'services/defiyield'
import { useGetBalancesEventStream } from 'services/zapper/hooks/useBalances'
import { Network } from 'services/zapper/types/models'
import styled from 'styled-components/macro'

import useParsedQueryString from 'hooks/useParsedQueryString'

import Analytics from './Analytics'
import NFTs from './NFTs'
import NftProfiler from './NftProfiler'
import Overview from './Overview'
import TimeMachine from './TimeMachine'
import TokenApprovals from './TokenApprovals'
import TransactionsHistory from './TransactionHistory'
import WalletProfiler from './WalletProfiler'
import Header from './components/Header'
import AccountTab from './components/Tab'
import { PageWrapper, Wrapper } from './styleds'

export enum AccountTabs {
  OVER_VIEW = 'overview',
  NFTS = 'nfts',
  TRANSACTIONS = 'transactions',
  ANALYTICS = 'analytics',
  TOKEN_APPROVALS = 'token_approvals',
  TIME_MACHINE = 'time_machine',
  WALLET_PROFILER = 'wallet_profiler',
  NFT_PROFILER = 'nft_profiler',
}

export default function Account(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address },
    },
    history,
  } = props
  const { tab } = useParsedQueryString()
  const [activeTab, setActiveTab] = useState<AccountTabs>()
  useEffect(() => {
    if (tab === undefined) {
      history.push({ search: '?tab=' + AccountTabs.OVER_VIEW })
    } else {
      setActiveTab(tab as AccountTabs)
    }
  }, [history, tab])

  const balances = useGetBalancesEventStream({
    addresses: [address],
    networks: Object.keys(Network).map(key => Network[key as keyof typeof Network]),
  })

  // const { data: return24hAllNetwroks } = useGet24hReturnAllNetworks(
  //   address,
  //   Object.keys(chainParams)
  //     .map(key => chainParams[key as unknown as number])
  //     .filter(value => typeof value === 'number') as unknown as number[],
  // )

  // console.log('return24hAllNetwroks', return24hAllNetwroks)

  // const { data: return24h } = useGet24hReturn(address, chainParams['ETHEREUM_MAINNET'])
  // console.log('return24h', return24h)

  // const { data: return24hAllNetworks, isSyncing: is24hSync } = useGet24hReturnAllNetworksSync(
  //   address,
  //   Object.keys(chainParams)
  //     .map(key => chainParams[key as unknown as number])
  //     .filter(value => typeof value === 'number') as unknown as number[],
  // )

  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleShow = () => {
      const scrollTop = window.scrollY
      if (scrollTop > 300) {
        setShow(true)
      } else {
        setShow(false)
      }
    }

    window.addEventListener('scroll', handleShow)

    return () => window.removeEventListener('scroll', handleShow)
  }, [])

  return (
    <Wrapper
      style={{
        position: 'relative',
      }}
    >
      <PageWrapper>
        <Header
          data={balances.data}
          // return24hs={return24hAllNetworks}
          isBalanceSyncing={balances.isSyncing}
          // isReturn24hSyncing={is24hSync}
        />
        <AccountTab activeTab={activeTab} />
        {activeTab === AccountTabs.OVER_VIEW && (
          <Overview
            data={balances.data}
            // return24hs={return24hAllNetworks}
          />
        )}
        {activeTab === AccountTabs.NFTS && <NFTs />}
        {activeTab === AccountTabs.TRANSACTIONS && <TransactionsHistory />}
        {activeTab === AccountTabs.ANALYTICS && <Analytics data={balances.data} />}
        {activeTab === AccountTabs.TOKEN_APPROVALS && <TokenApprovals />}
        {activeTab === AccountTabs.TIME_MACHINE && <TimeMachine />}
        {activeTab === AccountTabs.WALLET_PROFILER && <WalletProfiler />}
        {activeTab === AccountTabs.NFT_PROFILER && <NftProfiler />}
        {}
      </PageWrapper>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }}
      >
        <ScrollToTopWrapperIcon show={show}>
          <ArrowUp size={24} />
        </ScrollToTopWrapperIcon>
      </div>
    </Wrapper>
  )
}

const ScrollToTopWrapperIcon = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => rgba(theme.primary, 0.1)};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  &:hover {
    cursor: pointer;
    // enlarge icon
    transform: scale(1.2);
  }
`

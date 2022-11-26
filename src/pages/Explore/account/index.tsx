import { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Flex, Text } from 'rebass'
import { useGetBalancesEventStream } from 'services/zapper/hooks/useBalances'
import { Network } from 'services/zapper/types/models'

import KNCG from 'assets/images/knc-graphic.png'
import { ButtonPrimary } from 'components/Button'
import { useActiveWeb3React } from 'hooks'
import useParsedQueryString from 'hooks/useParsedQueryString'
import useTheme from 'hooks/useTheme'
import { isAddress } from 'utils'

import Analytics from './Analytics'
import NFTs from './NFTs'
import NftProfiler from './NftProfiler'
import Overview from './Overview'
import TimeMachine from './TimeMachine'
import TokenApprovals from './TokenApprovals'
import TransactionsHistory from './TransactionHistory'
import WalletProfiler from './WalletProfiler'
import Header from './components/Header'
import ScrollTopButton from './components/ScrollTopButton'
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

function containsUppercase(str: string) {
  return Boolean(str.match(/[A-Z]/))
}

export default function Account(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address },
    },
    history,
  } = props

  const { tab } = useParsedQueryString()
  const [isOwnerWallet, setIsOwnerWallet] = useState(false)
  const { account } = useActiveWeb3React()
  useEffect(() => {
    if (address && containsUppercase(address)) {
      history.replace(`/account/${address.toLowerCase()}`)
    }

    if (account && account.toLowerCase() !== address.toLowerCase()) {
      return
    }

    if (account && account.toLowerCase() === address.toLowerCase()) {
      setIsOwnerWallet(true)
    } else {
      setIsOwnerWallet(pre => {
        if (pre) {
          history.push(`/dashboard`)
        }
        return false
      })
    }
  }, [account, address])

  const [activeTab, setActiveTab] = useState<AccountTabs>()
  useEffect(() => {
    if (tab === undefined) {
      history.replace({ search: '?tab=' + AccountTabs.OVER_VIEW })
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

  const theme = useTheme()

  if (!address || isAddress(address) === false) {
    return (
      <Wrapper>
        <PageWrapper>
          <Flex justifyContent="center">
            <Flex style={{ gap: 64, padding: '80px 12px' }}>
              <img src={KNCG} height={358} alt="knc" />
              <Flex
                flexDirection="column"
                // alignItems="center"
                // justifyContent="center"
                width="100%"
                height="100%"
                style={{
                  gap: '32px',
                  padding: '16px 0px',
                }}
              >
                <Text color={theme.primary} fontSize={80} fontWeight={700}>
                  Oops! Page Not Found.
                </Text>
                <Text fontSize={['20px', '40px']} fontWeight="300">
                  Please Enter a Valid Address
                </Text>
                <ButtonPrimary
                  onClick={() => history.push('/dashboard')}
                  style={{
                    maxWidth: '300px',
                  }}
                >
                  Back to DashBoard
                </ButtonPrimary>
              </Flex>
            </Flex>
          </Flex>
        </PageWrapper>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
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
        <ScrollTopButton />
      </PageWrapper>
    </Wrapper>
  )
}

import { Trans } from '@lingui/macro'
import React from 'react'
import { useHistory } from 'react-router'
import { useMedia } from 'react-use'

import useMixpanel, { MIXPANEL_TYPE } from 'hooks/useMixpanel'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { TabContainer, TabItem } from 'pages/Explore/Account/styleds'

import { AccountTabs } from '..'

const AccountTab = ({ activeTab }: { activeTab: AccountTabs | undefined }) => {
  const history = useHistory()
  const { tab } = useParsedQueryString()
  const { mixpanelHandler } = useMixpanel()

  const upToSmall = useMedia('(max-width: 768px)')
  return (
    <TabContainer>
      <TabItem
        active={activeTab === AccountTabs.OVER_VIEW}
        onClick={() => {
          if (tab !== 'overview') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_SOON_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.OVER_VIEW })
        }}
      >
        <Trans>Overview</Trans>
      </TabItem>
      <TabItem
        active={activeTab === AccountTabs.NFTS}
        onClick={() => {
          if (tab !== 'nft') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.NFTS })
        }}
      >
        <Trans>NFTs</Trans>
      </TabItem>

      <TabItem
        active={activeTab === AccountTabs.TRANSACTIONS}
        onClick={() => {
          if (tab !== 'transactions') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.TRANSACTIONS })
        }}
      >
        <Trans>Transactions</Trans>
      </TabItem>

      <TabItem
        active={activeTab === AccountTabs.TOKEN_APPROVALS}
        onClick={() => {
          if (tab !== 'token_approvals') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.TOKEN_APPROVALS })
        }}
      >
        <Trans>Token Approvals</Trans>
      </TabItem>

      <TabItem
        active={activeTab === AccountTabs.ANALYTICS}
        onClick={() => {
          if (tab !== 'analytics') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.ANALYTICS })
        }}
      >
        <Trans>Analytics</Trans>
      </TabItem>

      <TabItem
        active={activeTab === AccountTabs.WALLET_PROFILER}
        onClick={() => {
          if (tab !== 'wallet_profiler') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.WALLET_PROFILER })
        }}
      >
        <Trans>Wallet Profiler</Trans>
      </TabItem>
      <TabItem
        active={activeTab === AccountTabs.NFT_PROFILER}
        onClick={() => {
          if (tab !== 'nft_profiler') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.NFT_PROFILER })
        }}
      >
        <Trans>Nft Profiler</Trans>
      </TabItem>

      <TabItem
        active={activeTab === AccountTabs.TIME_MACHINE}
        onClick={() => {
          if (tab !== 'time_machine') {
            // mixpanelHandler(MIXPANEL_TYPE.DISCOVER_TRENDING_CLICKED)
          }
          history.push({ search: '?tab=' + AccountTabs.TIME_MACHINE })
        }}
      >
        <Trans>Time Machine</Trans>
      </TabItem>
    </TabContainer>
  )
}

export default AccountTab

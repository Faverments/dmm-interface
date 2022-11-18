import React from 'react'
import { Return24h } from 'services/defiyield'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper'

import Apps from './Apps'
import Chains from './Chains'
import Wallet from './Wallet'

export default function Overview({ data, return24hs }: { data: PresentedBalancePayload[]; return24hs: Return24h[] }) {
  const [network, setNetwork] = React.useState<Network | ALL_NETWORKS>('all-networks')
  return (
    <>
      <Chains data={data} setNetwork={setNetwork} network={network} />
      <Wallet data={data} network={network} setNetwork={setNetwork} />
      <Apps data={data} network={network} />
    </>
  )
}

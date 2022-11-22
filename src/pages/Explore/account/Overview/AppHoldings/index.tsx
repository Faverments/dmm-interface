import React from 'react'
import { useAppBalances } from 'services/zapper/hooks/useBalances'
import { ALL_NETWORKS, Network, PresentedBalancePayload } from 'services/zapper/types/models/index'

export default function AppHolding({
  data,
  network,
}: {
  data: PresentedBalancePayload[]
  network: Network | ALL_NETWORKS
}) {
  const apps = useAppBalances(data, network)
  console.log('apps : ', apps)
  return <div>AppHolding</div>
}

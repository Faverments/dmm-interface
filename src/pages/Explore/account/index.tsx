import { RouteComponentProps } from 'react-router-dom'
import SocketProvider from 'websocket/socketContext'

import useGetUserTransactionHistory from 'hooks/explore/debank/useGetDeBankUserTransactionHistory'
import useENS from 'hooks/useENS'

import useGetNftNetWorth from '../../../hooks/explore/zapper/useGetZapperNftNetWorth'
import useGetNftUsersCollectionsTotals from '../../../hooks/explore/zapper/useGetZapperNftUsersCollectionsTotals'
import useGetTokensAndProtocolsEventStream from '../../../hooks/explore/zapper/useGetZapperTokensAndProtocolsEventStream'
import useGetUserDaoMembership from '../../../hooks/explore/zapper/useGetZapperUserDaoMembership'
import Apps from './components/apps'

export default function Account(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address },
    },
  } = props
  const { data: tokensAndProtocols, isSyncing, error } = useGetTokensAndProtocolsEventStream(address)
  const { daoMemberships } = useGetUserDaoMembership(address)
  const { nftNetWorth } = useGetNftNetWorth(address)
  const { nftUsersCollectionsTotals } = useGetNftUsersCollectionsTotals(address, undefined)
  const { data } = useGetUserTransactionHistory(address)
  const { address: ENSAddress, name, loading } = useENS(address)
  // console.log('user transaction history', data)
  // console.log('daoMemberships', daoMemberships)
  // console.log('nftNetWorth', nftNetWorth)
  // console.log('nftUsersCollectionsTotals', nftUsersCollectionsTotals)

  return (
    <SocketProvider>
      <div>Account : {address}</div>
      <div>ENS : {name}</div>
      <div>ENS addres : {ENSAddress}</div>
      <div>isSyncing : {isSyncing ? 'true' : 'false'}</div>
      <Apps tokensAndProtocols={tokensAndProtocols} />
    </SocketProvider>
  )
}

import { useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import useGetUserTransactionHistory from 'services/debank'
import { useGetTransactions, useGetTransactionsStandard } from 'services/defiyield'
import { useGetPositions } from 'services/zapper/hooks/useApps'
import { useGetBalancesEventStream } from 'services/zapper/hooks/useBalances'
import useGetNftNetWorth from 'services/zapper/hooks/useGetZapperNftNetWorth'
import useGetNftUsersCollectionsTotals from 'services/zapper/hooks/useGetZapperNftUsersCollectionsTotals'
import useGetUserDaoMembership from 'services/zapper/hooks/useGetZapperUserDaoMembership'
import { useGetUserAvatar } from 'services/zapper/hooks/useUserAvatar'
import { Network } from 'services/zapper/types/models'
import { useGetZapperTransactions } from 'services/zapper/useGetData_test'
import { useAddressAssetsRequest } from 'services/zerion'

import Avatar from 'components/Avatar'
import useENS from 'hooks/useENS'

import Apps from './Overview/Apps'

export default function Account(props: RouteComponentProps<{ address: string }>) {
  const {
    match: {
      params: { address },
    },
  } = props
  // const userA = useGetUserAvatar(address)
  // console.log('userA', userA.data?.user.avatarURI)
  const {
    data: tokensAndProtocols,
    isSyncing,
    error,
  } = useGetBalancesEventStream({
    addresses: [address],
    networks: [
      Network.ARBITRUM_MAINNET,
      Network.AURORA_MAINNET,
      Network.AVALANCHE_MAINNET,
      Network.BINANCE_SMART_CHAIN_MAINNET,
      Network.BITCOIN_MAINNET,
      Network.CELO_MAINNET,
      Network.POLYGON_MAINNET,
    ],
  })
  // console.log(
  //   'tokensAndProtocols',
  //   tokensAndProtocols.map(e => e.addresses),
  // )
  const { daoMemberships } = useGetUserDaoMembership(address)
  const { nftNetWorth } = useGetNftNetWorth(address)
  const { nftUsersCollectionsTotals } = useGetNftUsersCollectionsTotals(address, undefined)
  const { data } = useGetUserTransactionHistory(address)
  const { address: ENSAddress, name, loading } = useENS(address)
  const trans = useGetTransactions(address)
  const att = useAddressAssetsRequest(address, 'usd')
  // console.log('user transaction history', data)
  // console.log('daoMemberships', daoMemberships)
  // console.log('nftNetWorth', nftNetWorth)
  // console.log('nftUsersCollectionsTotals', nftUsersCollectionsTotals)
  // console.log('trans', trans)

  const [type, setType] = useState('send')

  const filterTransactions = useMemo(() => {
    if (trans.transactions) {
      return trans.transactions.data.filter((item: any) => item.tokenOperation === type)
    } else {
      return {}
    }
  }, [type, trans])

  const zapperTransactions = useGetZapperTransactions(address, Network.ETHEREUM_MAINNET)
  // console.log(
  //   'zapperTransactions',
  //   zapperTransactions.transactions?.data.map(item => item.account),
  // )

  return (
    <div>
      <Avatar address={address} />
      <div>Account : {address}</div>
      <div>ENS : {name}</div>
      <div>ENS addres : {ENSAddress}</div>
      <div>isSyncing : {isSyncing ? 'true' : 'false'}</div>
      <Apps tokensAndProtocols={tokensAndProtocols} />
      <p>transaction filter</p>
      <button onClick={() => setType('send')}>send</button>
      <button onClick={() => setType('receive')}>receive</button>
      <button onClick={() => setType('exchange')}>exchange</button>
      <div>{JSON.stringify(filterTransactions)}</div>
      <p>loading : {trans.isLoading ? 'true ' : 'false'} </p>
      <p>trans</p>
      <div>{JSON.stringify(trans.transactions)}</div>
    </div>
  )
}

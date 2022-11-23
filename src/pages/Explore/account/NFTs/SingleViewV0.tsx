import { ObservableQuery } from '@apollo/client'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { Flex } from 'rebass'
import { Network } from 'services/zapper'
import { zapperClient } from 'services/zapper/apollo/client'
import { nftUsersTokens } from 'services/zapper/apollo/queries'

import SearchNftCollections from './SearchNftCollections'
import ViewTypePicker from './ViewTypePicker'

export default function SingleView({
  activeViewType,
  setActiveViewType,
  network,
}: {
  activeViewType: 'single' | 'collection'
  setActiveViewType: (mode: 'single' | 'collection') => void
  network: keyof typeof Network
}) {
  const { address } = useParams<{ address: string }>()

  const [data, setData] = React.useState<any>(null)

  const variables: any = {
    owners: [address],
    network: network,
    minEstimatedValueUsd: 0,
    first: 24,
    collections: [],
  }

  const [query, setQuery] = React.useState(() => {
    const query = zapperClient.watchQuery({
      query: nftUsersTokens,
      variables,
    })
    const sub = query.subscribe(({ data, loading }) => {
      console.log('data')
      console.log(loading)

      setData(data.nftUsersTokens.edges)
    })
    return {
      query,
      sub,
    }
  })

  return (
    <Flex justifyContent="space-between">
      <ViewTypePicker activeViewType={activeViewType} setActiveViewType={setActiveViewType} />
      <button
        onClick={() =>
          query.query.fetchMore({
            query: nftUsersTokens,
            variables: {
              ...variables,
              after: data[data.length - 1].cursor,
            },
          })
        }
      >
        refetch
      </button>
      {/* <SearchNftCollections /> */}
    </Flex>
  )
}

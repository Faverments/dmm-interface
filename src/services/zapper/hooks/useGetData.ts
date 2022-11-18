import { ApolloError, gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { zapperClient } from 'services/zapper/apollo/client'
import { nftUsersCollections } from 'services/zapper/apollo/queries'

import { NftUsersCollections } from '../apollo/types'
import { Network } from '../types/models'

export function useGetNftUsersCollections({
  address,
  network,
  minCollectionValueUsd = 0,
  first = 24,
  collections = [],
  search = '',
}: {
  address: string
  network: keyof typeof Network
  minCollectionValueUsd?: number
  first?: number
  collections?: string[]
  search?: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [data, setData] = useState<NftUsersCollections>()
  useEffect(() => {
    const fetcher = async () => {
      setError(undefined)
      setIsLoading(true)
      const result = await zapperClient.query<NftUsersCollections>({
        query: nftUsersCollections,
        variables: {
          owners: [address],
          network: network,
          minCollectionValueUsd,
          first,
          collections,
          search,
        },
      })
      setData(result.data)
      setIsLoading(false)
      if (result.error) {
        setError(result.error)
      }
    }
    fetcher()
  }, [address, network, minCollectionValueUsd, first, JSON.stringify(collections), search])
  return useMemo(() => ({ isLoading, data, error }), [isLoading, error, data])
}

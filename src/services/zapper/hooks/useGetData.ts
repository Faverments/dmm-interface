import { ApolloError, gql } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { ZAPPER_WEB_API } from 'services/config'
import { zapperClient } from 'services/zapper/apollo/client'
import { nftUsersCollections, nftUsersTokens } from 'services/zapper/apollo/queries'

import { NftUsersCollections, NftUsersTokens } from '../apollo/types'
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

export function useGetNftUsersTokens({
  address,
  network,
  minEstimatedValueUsd = 0,
  first = 24,
  after = '',
  collections = [],
}: {
  address: string
  network: keyof typeof Network
  minEstimatedValueUsd?: number
  first?: number
  after?: string
  collections?: string[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [data, setData] = useState<NftUsersTokens>()
  useEffect(() => {
    const variables: any = {
      owners: [address],
      network: network,
      minEstimatedValueUsd,
      first,
      collections,
    }
    if (after) {
      variables.after = after
    }
    const fetcher = async () => {
      setError(undefined)
      setIsLoading(true)
      console.log('query', nftUsersTokens)
      // const result = await zapperClient.query<NftUsersTokens>({
      //   query: nftUsersTokens,
      //   variables: variables,
      // })
      const result: any = await fetch(`${ZAPPER_WEB_API}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: nftUsersTokens.loc?.source.body,
          variables: variables,
        }),
      }).then(res => res.json())
      console.log('result', result)
      setData(result.data)
      setIsLoading(false)
      if (result.error) {
        setError(result.error)
      }
    }
    fetcher()
  }, [address, network, minEstimatedValueUsd, first, after, JSON.stringify(collections)])
  return useMemo(() => ({ isLoading, data, error }), [isLoading, error, data])
}

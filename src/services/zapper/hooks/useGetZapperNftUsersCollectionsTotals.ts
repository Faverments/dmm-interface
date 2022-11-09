import { ApolloError, gql } from '@apollo/client'
import { useMemo, useState } from 'react'
import { zapperClient } from 'services/zapper/apollo/client'

const query = gql`
  query NftUsersCollectionsTotals(
    $owners: [Address!]!
    $network: Network
    $minCollectionValueUsd: Float
    $search: String
    $collections: [Address!]
  ) {
    nftUsersCollections(
      input: {
        owners: $owners
        network: $network
        search: $search
        minCollectionValueUsd: $minCollectionValueUsd
        collections: $collections
      }
    ) {
      totals {
        count
        balanceUSD
      }
    }
  }
`

async function execQuery(address: string, network: string | undefined) {
  const variables: any = {
    owners: [address],
    minCollectionValueUsd: 0,
    search: '',
    collections: [],
  }
  if (network) {
    variables.network = network
  }
  const result = await zapperClient.query({
    query: query,
    variables: variables,
  })
  return result
}

export default function useGetNftUsersCollectionsTotals(address: string, network: string | undefined) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [nftUsersCollectionsTotals, setNftUserCollectionTotals] = useState<any>([])
  useMemo(async () => {
    setError(undefined)
    setIsLoading(true)
    const result = await execQuery(address, network)
    setNftUserCollectionTotals(result.data)
    if (result.error) {
      setError(result.error)
    }
  }, [address])
  return { nftUsersCollectionsTotals, isLoading, error }
}

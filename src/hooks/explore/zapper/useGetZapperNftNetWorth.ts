import { ApolloError, gql } from '@apollo/client'
import React, { useMemo, useState } from 'react'

import { zapperClient } from 'apollo/ZapperClient'

const query = gql`
  query NftNetWorth($addresses: [Address!]!, $network: Network) {
    nftNetWorth(addresses: $addresses, network: $network)
  }
`

async function execQuery(address: string) {
  const result = await zapperClient.query({
    query: query,
    variables: {
      addresses: [address],
    },
  })
  return result
}

export default function useGetNftNetWorth(address: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [nftNetWorth, setNftNetWorth] = useState<any>()
  useMemo(async () => {
    setError(undefined)
    setIsLoading(true)
    const result = await execQuery(address)
    setNftNetWorth(result.data)
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    }
  }, [address])
  return { nftNetWorth, isLoading, error }
}

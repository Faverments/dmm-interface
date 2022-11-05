import { ApolloError, gql } from '@apollo/client'
import { useMemo, useState } from 'react'

import { zapperClient } from 'apollo/ZapperClient'

const query = gql`
  query UserDaoMembership($input: UserInput!) {
    user(input: $input) {
      daoMemberships {
        id
        img
        name
        slug
        share
        percentileShare
        governanceBaseToken {
          symbol
        }
      }
    }
  }
`

async function execQuery(address: string) {
  const result = await zapperClient.query({
    query: query,
    variables: {
      input: {
        address: address,
      },
    },
  })
  return result
}

export default function useGetUserDaoMembership(address: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [daoMemberships, setDaoMemberships] = useState<any>([])
  useMemo(async () => {
    setError(undefined)
    setIsLoading(true)
    const result = await execQuery(address)
    setDaoMemberships(result.data)
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    }
  }, [address])
  return { daoMemberships, isLoading, error }
}

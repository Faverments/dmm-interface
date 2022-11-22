import { ApolloError, gql } from '@apollo/client'
import { useMemo, useState } from 'react'
import { zapperClient } from 'services/zapper/apollo/client'

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

export interface UserDaoMembership {
  id: string
  img: string
  name: string
  slug: string
  share: number
  percentileShare: number
  governanceBaseToken: {
    symbol: string
  } | null
}

export default function useGetUserDaoMembership(address: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [daoMemberships, setDaoMemberships] = useState<UserDaoMembership[]>([])
  useMemo(async () => {
    setError(undefined)
    setIsLoading(true)
    const result = await execQuery(address)
    setDaoMemberships(result.data.user.daoMemberships)
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    }
  }, [address])
  return useMemo(() => {
    return {
      isLoading,
      error,
      daoMemberships,
    }
  }, [isLoading, error, daoMemberships])
}

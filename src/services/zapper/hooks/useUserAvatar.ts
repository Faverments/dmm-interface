import { ApolloError } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { zapperClient } from 'services/zapper/apollo/client'
import { UserAvatar } from 'services/zapper/apollo/queries'

import { UserAvatarResponse } from '../apollo/types'

export function useGetUserAvatar(address: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApolloError>()
  const [data, setData] = useState<UserAvatarResponse>()
  useEffect(() => {
    const fetcher = async () => {
      setError(undefined)
      setIsLoading(true)
      const result = await zapperClient.query<UserAvatarResponse>({
        query: UserAvatar,
        variables: { userInput: { address } },
      })
      setData(result.data)
      setIsLoading(false)
      if (result.error) {
        setError(result.error)
      }
    }
    fetcher()
  }, [address])
  return useMemo(() => ({ isLoading, data, error }), [isLoading, error, data])
}

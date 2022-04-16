import React, { useEffect } from 'react'
import { useDiscoverProMode } from 'state/user/hooks'
import { RouteComponentProps } from 'react-router-dom'
export default function DiscoverPro({ history }: RouteComponentProps) {
  const isDiscoverProMode = useDiscoverProMode()
  useEffect(() => {
    if (!isDiscoverProMode) {
      history.push('/discover')
    }
  }, [history, isDiscoverProMode])

  return <div>DiscoverPro</div>
}

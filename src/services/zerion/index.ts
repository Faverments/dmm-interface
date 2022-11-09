import { useEffect } from 'react'

import { addressAssetsRequest } from './events'
import { addressSocket } from './socket'

export function useAddressAssetsRequest(address: string, currency = 'usd') {
  const requestBody = addressAssetsRequest(address, currency)
  useEffect(() => {
    addressSocket.emit(...requestBody)
    addressSocket.on('received address ' + requestBody[1].scope[0], (data: any) => {
      console.log(data)
    })
    return () => {
      addressSocket.off('received address assets')
      addressSocket.emit('unsubscribe', requestBody[1])
    }
  }, [address, currency])
}

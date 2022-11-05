import io from 'socket.io-client'

import { exampleEmit } from './emit'
import { socketEvents } from './events'

export const socket = io('http://localhost:8008')

function socketrun() {
  const io = require('socket.io-client')

  const BASE_URL = 'wss://api-v4.zerion.io/'

  function verify(request: any, response: any) {
    const keys = ['address', 'currency']
    return keys.every(key => request.payload[key] === response.meta[key])
  }

  const addressSocket = {
    namespace: 'address',
    socket: io(`${BASE_URL}address`, {
      transports: ['websocket'],
      timeout: 60000,
      query: {
        api_token: 'Zerion.oSQAHALTonDN9HYZiYSX5k6vnm4GZNcM',
      },
    }),
  }

  function get(socketNamespace: any, requestBody: any) {
    return new Promise(resolve => {
      const { socket, namespace } = socketNamespace
      function handleReceive(data: any) {
        if (verify(requestBody, data)) {
          unsubscribe()
          resolve(data)
        }
      }
      const model = requestBody.scope[0]
      function unsubscribe() {
        socket.off(`received ${namespace} ${model}`, handleReceive)
        socket.emit('unsubscribe', requestBody)
      }
      socket.emit('get', requestBody)
      socket.on(`received ${namespace} ${model}`, handleReceive)
    })
  }

  get(addressSocket, {
    scope: ['portfolio'],
    payload: {
      address: '0x7e5ce10826ee167de897d262fcc9976f609ecd2b',
      currency: 'usd',
      portfolio_fields: 'all',
    },
  }).then((response: any) => {
    console.log('fortfolio')
    console.log(response.payload.portfolio)
  })
}

export const initSockets = ({ setValue }: { setValue: any }) => {
  socketEvents({ setValue })
  // setValue    ^ is passed on to be used by socketEvents
  exampleEmit()
  socketrun()
}

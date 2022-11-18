import io from 'socket.io-client'

import { ZERRION_BASE_URL, ZERRION_KEY } from '../config'

/**
 * Creates a socket with a given endpoint and the correct configuration.
 *
 * @param endpoint The endpoint.
 * @returns The new socket
 */
const createSocket = (endpoint: string): SocketIOClient.Socket =>
  io(`${ZERRION_BASE_URL}/${endpoint}`, {
    // extraHeaders: { origin: config.data_origin },
    query: {
      api_token: ZERRION_KEY,
    },
    transports: ['websocket'],
  } as SocketIOClient.ConnectOpts)

export const addressSocket = createSocket('address')
export const assetsSocket = createSocket('assets')

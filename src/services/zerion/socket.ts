import io from 'socket.io-client'

const ZERRION_BASE_URL = 'wss://api-v4.zerion.io'

const ZERRION_KEY = 'Zerion.oSQAHALTonDN9HYZiYSX5k6vnm4GZNcM'

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

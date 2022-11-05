import React, { useEffect, useState } from 'react'

import { initSockets } from '../sockets'
import { SocketContext } from './contex'

//       ^ initSockets is shown later on
export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState({})
  useEffect(() => initSockets({ setValue }), [])
  // Note, we are passing setValue ^ to initSockets
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

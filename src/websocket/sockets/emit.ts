import { socket } from './index'

export const exampleEmit = () => {
  socket.emit('message', 'Hello from the client!')
}

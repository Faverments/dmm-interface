import { socket } from './index'

export const socketEvents = ({ setValue }: { setValue: any }) => {
  socket.on('message', (any: any) => {
    setValue((state: any) => {
      return { ...state, any }
    })
  })
}

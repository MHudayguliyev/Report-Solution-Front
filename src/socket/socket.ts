import  authToken from '@app/api/service/auth_token';
import { Socket } from 'socket.io-client';
import sio from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_API_MODE === 'development' ? 
                     import.meta.env.VITE_API_LOCAL_SOCKET_URL : 
                     import.meta.env.VITE_API_SERVER_SOCKET_URL
export function ConnectToSocket(): Socket {
  const socket =  sio(BASE_URL, {
    transports: ['websocket'],
    auth: {
      token: authToken()
    }
  })

  return socket 
}
export interface SocketType extends Socket {}
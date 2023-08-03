import SocketIoClient from 'socket.io-client'
import { Socket } from 'socket.io-client';
import authToken from '@app/api/service/auth_token';

const BASE_URL = import.meta.env.VITE_API_MODE === 'development' ? 
                     import.meta.env.VITE_API_LOCAL_SOCKET_URL : 
                     import.meta.env.VITE_API_SERVER_SOCKET_URL
// const token = authToken()
export const socket: Socket | any =  SocketIoClient(BASE_URL, {
  transports: ['websocket'],
  // auth: {token}
})
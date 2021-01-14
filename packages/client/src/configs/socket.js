import * as io from 'socket.io-client';

// const ENDPOINT_PROD = 'https://shivaluma.wtf';
const ENDPOINT_DEV = 'https://shivaluma.wtf';
const socket = io(ENDPOINT_DEV, {
  transports: ['websocket']
});

export default socket;

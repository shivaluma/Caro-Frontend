import * as io from 'socket.io-client';

// const ENDPOINT_PROD = 'https://shivaluma.wtf';
const ENDPOINT_DEV = 'http://localhost:5000';
const socket = io(ENDPOINT_DEV, {
  transports: ['websocket']
});

export default socket;

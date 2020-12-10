import io from 'socket.io-client';

const ENDPOINT = 'https://shivaluma.wtf';
const socket = io(ENDPOINT, {
  transports: ['websocket'],
});

export default socket;

import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:4101/';

const socket = io.connect(ENDPOINT, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  transports: ['websocket'],
});

export default socket;

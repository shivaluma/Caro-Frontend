import io from 'socket.io-client';

const ENDPOINT = 'http://35.201.203.222:4000/';
const socket = io(ENDPOINT, {
  transports: ['websocket'],
  upgrade: false,
});

export default socket;

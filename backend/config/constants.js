const { SOCKET_EVENTS } = require('./constants');
io.on('connection', (socket) => {
  socket.on(SOCKET_EVENTS.SEND_SCORE, (scoreData) => {
    io.emit(SOCKET_EVENTS.LIVE_SCORE, scoreData);
  });
});

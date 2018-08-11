const {
  ONLINE,
  OFFLINE,
  PRIVATE_MESSAGE,
  TYPING,
  TYPING_STOPPED
} = require("../actions/socket.action");

function outgoing(socket) {
  let _socket = socket;
  function online(username) {
    _socket.emit(ONLINE, username);
  }
  function offline(username) {
    _socket.emit(OFFLINE, username);
  }
  function message(message) {
    _socket.emit(PRIVATE_MESSAGE, message);
  }
  function typing(to) {
    _socket.emit(TYPING, to);
  }
  function typingStopped(to) {
    _socket.emit(TYPING_STOPPED, to);
  }
  return {
    online: online,
    offline: offline,
    message: message,
    typing: typing,
    typingStopped: typingStopped
  };
}
module.exports = outgoing;

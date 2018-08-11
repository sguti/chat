const io = require("socket.io-client");
const socket = io("http://localhost:3000");
require("./socket.incoming")(socket);
const outgoing = require("./socket.outgoing")(socket);

module.exports = outgoing;

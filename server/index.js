// Setup basic express server
var express = require("express");
var app = express();
var path = require("path");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

const { ONLINE, OFFLINE, PRIVATE_MESSAGE } = require("./socket.action");

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static(path.join(__dirname, "public")));

const connectedUsers = {};

io.on("connection", socket => {
  // when the client become online
  socket.on(ONLINE, username => {
    socket.username = username;
    socket.broadcast.emit(ONLINE, socket.username);
    connectedUsers[socket.username] = socket;
    console.log(username + " online");
  });

  socket.on(OFFLINE, () => {
    socket.broadcast.emit(OFFLINE, socket.username);
    console.log(socket.username + " offline");
  });

  socket.on(PRIVATE_MESSAGE, message => {
    connectedUsers[message.to] &&
      connectedUsers[message.to].emit(PRIVATE_MESSAGE, {
        ...message,
        from: socket.username
      });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", username => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    delete connectedUsers[socket.username];
  });
});

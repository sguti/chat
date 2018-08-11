const {
  ONLINE,
  OFFLINE,
  PRIVATE_MESSAGE,
  TYPING,
  TYPING_STOPPED
} = require("../actions/socket.action");
const {
  NEW_MESSAGE,
  SHOW_PRIVATE_CHAT_WINDOW,
  SHOW_OTHER_ACTIVE_CHAT_SESSIONS
} = require("../actions/render.action");
const { render } = require("../handler/render.action.handler");
const { state, setState } = require("../state");
const { PRIVATE_CHAT } = require("../constants");

let appState;
state(state => {
  appState = state;
});

function incoming(socket) {
  let _socket = socket;
  _socket.on(ONLINE, function(username) {
    console.log(username + "is online");
  });

  _socket.on(OFFLINE, function(username) {
    console.log(username + "is offline");
  });

  _socket.on(PRIVATE_MESSAGE, function(message) {
    const user = appState.contacts[message.from];
    let userSession = appState.chatSessions.find(
      session => session.type == PRIVATE_CHAT && session.user.id == message.from
    );
    if (!userSession) {
      userSession = {
        user: user,
        type: PRIVATE_CHAT,
        messages: [],
        ureadMessageCount: 0
      };
      appState.chatSessions.push(userSession);
    }
    if (!appState.focusedSession) {
      appState.focusedSession = userSession;
      render(SHOW_PRIVATE_CHAT_WINDOW, { user: appState.focusedSession.user });
    }
    userSession.messages.push(message);
    if (appState.focusedSession.user.id == message.from) {
      render(NEW_MESSAGE, {
        messages: [message],
        userId: appState._user.username
      });
    } else {
      message.unread = true;
      appState.focusedSession.ureadMessageCount += 1;
    }

    if (appState.chatSessions.length > 1) {
      render(
        SHOW_OTHER_ACTIVE_CHAT_SESSIONS,
        {
          activeChatSessions: appState.chatSessions.filter(session => {
            session =>
              session.type == PRIVATE_CHAT && session.user.id == message.from;
          })
        },
        appState.chatSessions.length
      );
    }
    setState();
  });

  _socket.on(TYPING, function(from) {
    console.log(from);
  });

  _socket.on(TYPING_STOPPED, function(from) {
    console.log(from);
  });
}

module.exports = incoming;

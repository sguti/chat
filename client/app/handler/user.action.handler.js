const { ipcMain } = require("electron");
const { view } = require("../utils/utils.view");
const { state, setState } = require("../state");
const { message } = require("../socket");
const {
  HEADER_CONTACT_ICON_CLICKED,
  START_PRIVATE_CHAT_CLICKED,
  SEND_MESSAGE
} = require("../actions/user.actions");
const {
  SHOW_CONTACTS,
  SHOW_PRIVATE_CHAT_WINDOW,
  SHOW_GROUP_CHAT_WINDOW,
  SHOW_HOME,
  NEW_MESSAGE,
  SHOW_OTHER_ACTIVE_CHAT_SESSIONS
} = require("../actions/render.action");
const { PRIVATE_CHAT, SELF, ONLINE, OFFLINE, AWAY } = require("../constants");
const { render } = require("./render.action.handler");

let appState;
state(state => {
  appState = state;
});
ipcMain.on(HEADER_CONTACT_ICON_CLICKED, event => {
  event.sender.webContents.send(
    SHOW_CONTACTS,
    view(SHOW_CONTACTS, { contacts: appState.contacts })
  );
});

ipcMain.on(START_PRIVATE_CHAT_CLICKED, (event, userId) => {
  const user = appState.contacts[userId];
  let userSession = appState.chatSessions.find(
    session => session.type == PRIVATE_CHAT && session.user.id == userId
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
  appState.focusedSession = userSession;
  setState();

  event.sender.webContents.send(
    SHOW_PRIVATE_CHAT_WINDOW,
    view(SHOW_PRIVATE_CHAT_WINDOW, { user: appState.focusedSession.user })
  );
  if (appState.focusedSession.messages.length) {
    event.sender.webContents.send(
      NEW_MESSAGE,
      view(NEW_MESSAGE, {
        messages: appState.focusedSession.messages,
        userId: appState._user.username
      })
    );
  }
  if (appState.chatSessions.length > 1) {
    event.sender.webContents.send(
      SHOW_OTHER_ACTIVE_CHAT_SESSIONS,
      view(SHOW_OTHER_ACTIVE_CHAT_SESSIONS, {
        activeChatSessions: appState.chatSessions.filter(session => {
          session => session.type == PRIVATE_CHAT && session.user.id == userId;
        })
      }),
      appState.chatSessions.length - 1
    );
  }
});

ipcMain.on(SEND_MESSAGE, (event, msg) => {
  msg.owner = appState._user.username;
  appState.focusedSession.messages.push(msg);
  message({ ...msg, to: appState.focusedSession.user.id });
  render(NEW_MESSAGE, { messages: [msg], userId: appState._user.username });
});

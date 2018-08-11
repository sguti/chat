const { ipcRenderer } = require("electron");
const {
  SHOW_CONTACTS,
  SHOW_PRIVATE_CHAT_WINDOW,
  NEW_MESSAGE,
  SHOW_OTHER_ACTIVE_CHAT_SESSIONS
} = require("../actions/render.action");
const {
  updateHeader,
  updateContent,
  updateActiveChats,
  updateMessages,
  toggleSearchBar
} = require("./window.view.handler");

const uiState = {
  searchBarVisible: false,
  user: null
};

ipcRenderer.on("app-start", function(state) {
  uiState.user = state.user;
});
ipcRenderer.on("header-update", function(sender, headerHtml) {
  updateHeader(headerHtml);
});
ipcRenderer.on(SHOW_CONTACTS, function(sender, contentHtml) {
  updateContent(contentHtml);
});
ipcRenderer.on(SHOW_PRIVATE_CHAT_WINDOW, function(sender, contentHtml) {
  updateContent(contentHtml);
});
ipcRenderer.on(NEW_MESSAGE, function(sender, messagesHtml) {
  updateMessages(messagesHtml);
});
ipcRenderer.on(SHOW_OTHER_ACTIVE_CHAT_SESSIONS, function(
  sender,
  activeChatHtml,
  count
) {
  updateActiveChats(activeChatHtml, count);
});

const pug = require("pug");
const path = require("path");
const {
  SHOW_CONTACTS,
  SHOW_PRIVATE_CHAT_WINDOW,
  NEW_MESSAGE
} = require("../actions/render.action");

const compliedFunctions = {};
function view(action, payload) {
  switch (action) {
    case "getAppHeader":
      return html(action, payload, "app-header");
    case "SHOW_CONTACTS":
      return html(action, payload, "contacts");
    case SHOW_PRIVATE_CHAT_WINDOW:
      return html(action, payload, "chat-window");
    case NEW_MESSAGE:
      return html(action, payload, "messages");
    case "activeChatList":
      return html(action, payload, "active-chats");
    default:
      return "";
  }
}

function html(action, payload, template) {
  if (!compliedFunctions[action])
    compliedFunctions[action] = pug.compileFile(
      path.join(__dirname, "..", "templates", template + ".pug")
    );
  return compliedFunctions[action](payload);
}

module.exports = {
  view: view
};

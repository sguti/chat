const {
  HEADER_CONTACT_ICON_CLICKED,
  START_PRIVATE_CHAT_CLICKED,
  SEND_MESSAGE
} = require("../actions/user.actions");

function showContacts() {
  ipcRenderer.send(HEADER_CONTACT_ICON_CLICKED);
}
function startChatSession(userId) {
  console.log(userId);
  ipcRenderer.send(START_PRIVATE_CHAT_CLICKED, userId);
}
function onUserInput(event) {
  if (event.key == "Enter") {
    ipcRenderer.send(SEND_MESSAGE, {
      type: "text",
      content: event.srcElement.value
    });
    event.srcElement.value = "";
  }
}

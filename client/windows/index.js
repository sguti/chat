const { BrowserWindow, app } = require("electron");
const { userInfo } = require("os");

const state = {
  user: null
};

function initialize() {
  state.user = userInfo();
  app.on("ready", () => {
    createMainWindow();
    console.log(state.user);
  });
}
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 370,
    height: 620,
    title: "Communicator",
    x: 880,
    y: 90,
    autoHideMenuBar: true,
    resizable: true,
    backgroundColor: "#FFGH12",
    maximizable: false
  });
  mainWindow.loadURL(`file://${__dirname}/main/main.window.html`);
}
module.exports = {
  initialize: initialize
};

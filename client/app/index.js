const { BrowserWindow, app } = require("electron");
const { userInfo } = require("os");
const { config } = require("./utils/utils.config");
const { view } = require("./utils/utils.view");
const { state, setState } = require("./state");
const { online, offline } = require("./socket");
require("./handler/user.action.handler");
const { setWindow, render } = require("./handler/render.action.handler");

let appState;
state(state => {
  appState = state;
});

function initialize() {
  config.get().then(config => {
    setState({ config: config, _user: userInfo() });
    app.on("ready", () => {
      createMainWindow();
      online(appState._user.username);
    });
  });
}
let mainWindow;
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
  mainWindow.loadURL(`file://${__dirname}/window/window.html`);
  mainWindow.webContents.on("did-finish-load", function() {
    setWindow(mainWindow);
    appState.appLoaded = true;
    mainWindow.webContents.send("header-update", view("getAppHeader"));
  });
}
app.on("quit", function() {
  offline(appState._user.username);
});

module.exports = {
  initialize: initialize
};

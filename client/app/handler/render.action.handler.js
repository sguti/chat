const { view } = require("../utils/utils.view");

let _window;
function setWindow(window) {
  _window = window;
}

function render(action, payload, ...rest) {
  if (!_window) {
    console.log("please set window first");
  }
  _window.webContents.send(action, view(action, payload), ...rest);
}

module.exports = {
  setWindow: setWindow,
  render: render
};

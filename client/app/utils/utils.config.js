const fs = require("fs");
const path = require("path");

let config = null;

function load(reject) {
  try {
    config = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "..", ".config/settings.json"),
        "utf-8"
      )
    );
  } catch (error) {
    reject(error);
  }
}

function get() {
  return new Promise((resolve, reject) => {
    if (!config) {
      load(reject);
    }
    resolve(config);
  });
}

module.exports = {
  config: {
    get: get
  }
};

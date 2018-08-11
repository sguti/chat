const fs = require("fs");
const path = require("path");
const os = require("os");
const { config } = require("./utils.config");
const crypto = require("crypto");

SECRET_KEY = "THIS IS NOT A SECRET ANYMORE" + os.userInfo().username;

function get() {
  return new Promise((resolve, reject) => {
    config.get().then(config => {
      const filePath = `${config.directory ||
        path.join(__dirname, "temp")}/.state`;
      fs.exists(filePath, exists => {
        if (!exists) {
          fs.writeFile(filePath, "", () => {});
        } else {
          fs.readFile(filePath, "utf-8", (error, data) => {
            if (error) {
              reject(error);
            } else {
              decrypt(data)
                .then(decryptedData => {
                  resolve(JSON.parse(decryptedData));
                })
                .catch(error => reject);
            }
          });
        }
      });
    });
  });
}
function save(state) {
  return new Promise((resolve, reject) => {
    const filePath = `${config.directory ||
      path.join(__dirname, "temp")}/.state`;
    encrypt(JSON.stringify(state))
      .then(encryptedData => {
        fs.writeFile(filePath, "utf-8", (error, data) => {
          error && reject(error);
          resolve("state saved successfully");
        });
      })
      .catch(error => reject);
  });
}
function encrypt(data) {
  return new Promise((resolve, reject) => {
    try {
      var cipher = Crypto.createCipher("aes-256-cbc", SECRET_KEY);
      var encrypted = Buffer.concat([
        cipher.update(new Buffer(JSON.stringify(data), "utf8")),
        cipher.final()
      ]);
      resolve(encrypted);
    } catch (exception) {
      reject({ message: exception.message });
    }
  });
}
function decrypt(data) {
  return new Promise((resolve, reject) => {
    try {
      var decipher = Crypto.createDecipher("aes-256-cbc", SECRET_KEY);
      var decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
      resolve(decrypted.toString());
    } catch (exception) {
      reject({ message: exception.message });
    }
  });
}

module.exports = {
  state: {
    get: get,
    save: save
  }
};

const { state } = require("../utils/utils.stateSync");
const { PRIVATE_CHAT, SELF, ONLINE, OFFLINE, AWAY } = require("../constants");

const _syncState = {
  stateSynced: false,
  lastSyncedAt: null,
  lastReadAt: null,
  lastWriteAt: null,
  isDirty: false
};

let appState = {
  _user: null,
  _config: null,
  _appLoaded: false,
  focusedSession: null,
  contacts: {},
  chatSessions: []
};
function loadState() {
  _syncState.stateSynced = false;
  state.get().then(state => {
    appState = {
      ...state,
      ...appState
    };
    _syncState.stateSynced = true;
    _syncState.lastSyncedAt = _syncState.lastReadAt = +Date.now();
    _syncState.isDirty = false;
    setState();
  });
}
function saveState() {
  if (appState._isDirty) {
    appState._isDirty = false;
    state.save({ ...appState }).then(() => {
      _syncState.stateSynced = true;
      _syncState.lastSyncedAt = _syncState.lastWriteAt = +Date.now();
      _syncState.isDirty = false;
    });
  }
}

const subscribers = [];
function stateSubscription(subscriber) {
  subscribers.push(subscriber);
  subscriber(appState);
  return function(subscriber) {
    subscribers = subscribers.filter(item => item != subscriber);
  };
}
function setState(newState) {
  if (newState) {
    appState = { ...appState, ...newState };
    appState._isDirty = true;
  }
  subscribers.forEach(subscriber => {
    subscriber(appState);
  });
}

loadState();

function insertFakeData() {
  appState.contacts = {
    Sudip: {
      displayName: "Sudip",
      id: "Sudip",
      status: ONLINE
    },
    Sambrita: {
      displayName: "Chini",
      id: "Sambrita",
      status: AWAY
    }
  };
  appState.chatSessions = [
    {
      type: PRIVATE_CHAT,
      user: appState.contacts.Sambrita,
      messages: [
        {
          type: "text",
          content: "Hi",
          owner: "Sudip"
        },
        {
          type: "text",
          content: "How are you?",
          owner: "Sudip"
        }
      ]
    }
  ];
}
insertFakeData();
let interval = setInterval(saveState, 30000);

module.exports = {
  state: stateSubscription,
  setState: setState
};

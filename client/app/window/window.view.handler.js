function toggleSearchBar() {
  uiState.searchBarVisible = !uiState.searchBarVisible;
  const searchBar = document.getElementById("txtSearchBar");
  if (uiState.searchBarVisible) {
    searchBar.classList.remove("animation-hide-search-bar");
    searchBar.classList.add("animation-show-search-bar");
  } else {
    searchBar.classList.remove("animation-show-search-bar");
    searchBar.classList.add("animation-hide-search-bar");
  }
}

function updateHeader(headerHtml) {
  document.getElementById("__view_header").innerHTML = headerHtml;
}
function updateContent(contentHtml) {
  document.getElementById("__view_content").innerHTML = contentHtml;
}
function updateMessages(messagesHtml) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = messagesHtml;
  document.getElementById("__View_chat-window-body").appendChild(wrapper);
}
function updateActiveChats(activeChatHtml, count) {
  if (!count) {
    document.getElementById("__view_active-chats").innerHTML = "";
    document
      .getElementById("__view_active-chats")
      .classList.add("no-active-chats");
  } else {
    document.getElementById("__view_active-chats").innerHTML = activeChatHtml;
    document
      .getElementById("__view_active-chats")
      .classList.remove("no-active-chats");
  }
}

module.exports = {
  toggleSearchBar: toggleSearchBar,
  updateHeader: updateHeader,
  updateContent: updateContent,
  updateActiveChats: updateActiveChats,
  updateMessages: updateMessages
};

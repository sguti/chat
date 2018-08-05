const state = {
  searchBarVisible: false
};
function toggleSearchBar() {
  state.searchBarVisible = !state.searchBarVisible;
  const searchBar = document.getElementById("txtSearchBar");
  if (state.searchBarVisible) {
    searchBar.classList.remove("animation-hide-search-bar");
    searchBar.classList.add("animation-show-search-bar");
  } else {
    searchBar.classList.remove("animation-show-search-bar");
    searchBar.classList.add("animation-hide-search-bar");
  }
}

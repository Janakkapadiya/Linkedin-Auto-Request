import { state } from "./const";
import { addPeopleFromSearchPage } from "./addPeopleFromSearch";
import { isOnSearchPage } from "./isOnSearchPage";

export function checkIfUrlHasChanged() {
  if (
    !state.isAutoConnectRunning ||
    location.href === state.autoConnectLastLocation
  ) {
    return;
  }
  state.autoConnectLastLocation = location.href;

  if (isOnSearchPage()) {
    addPeopleFromSearchPage();
  } else {
    state.isAutoConnectRunning = false;
  }
}

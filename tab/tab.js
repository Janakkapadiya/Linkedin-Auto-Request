import { checkIfUrlHasChanged } from "./functions/checIfUrlChanged";
import { state } from "./functions/const";

setInterval(checkIfUrlHasChanged, 1000);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message) {
    case "isAutoConnectAvailable":
      sendResponse(true);
      break;
    case "isAutoConnectRunning":
      sendResponse(isAutoConnectRunning);
      break;
    case "startAutoConnect":
      state.isAutoConnectRunning = true;
      sendResponse(isAutoConnectRunning);
      break;
    case "stopAutoConnect":
      state.isAutoConnectRunning = false;
      state.autoConnectLastLocation = "";
      sendResponse(isAutoConnectRunning);
      break;
  }
});

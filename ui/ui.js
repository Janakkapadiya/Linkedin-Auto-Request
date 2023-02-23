const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const searchPeopleMessage = document.getElementById("searchPeopleMessage");
const selectOptionMessage = document.getElementById("selectOptionMessage");
const openLinkedInSearchPage = document.getElementById(
  "openLinkedInSearchPage"
);
const classHidden = "hidden";

const linkedInUrl = {
  searchPeoplePage:
    'https://www.linkedin.com/search/results/people/?facetNetwork=%5B"S"%5D',
  myNetworkPage: "https://www.linkedin.com/mynetwork/",
  patternOfSearchPage: "linkedin.com/search/results/people",
  patternOfMyNetworkPage: "linkedin.com/mynetwork"
};

function hideStopButton() {
  stopButton.classList.add(classHidden);
  startButton.classList.remove(classHidden);
}

function hideStartButton() {
  stopButton.classList.remove(classHidden);
  startButton.classList.add(classHidden);
}

function hideStartAndStopButtons() {
  startButton.classList.add(classHidden);
  stopButton.classList.add(classHidden);
}

function hideAllMessages() {
  searchPeopleMessage.classList.add(classHidden);
  selectOptionMessage.classList.add(classHidden);
}

function showSearchPeopleMessage() {
  searchPeopleMessage.classList.remove(classHidden);
}

function showSelectOptionMessage() {
  selectOptionMessage.classList.remove(classHidden);
}

startButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true }, ([activeTab]) => {
    chrome.tabs.sendMessage(
      activeTab.id,
      "isAutoConnectAvailable",
      response => {
        if (!response) {
          chrome.tabs.executeScript(
            { file: "/operations/operation.js" },
            () => {
              chrome.tabs.sendMessage(activeTab.id, "startAutoConnect");
              hideStartButton();
            }
          );
        } else {
          chrome.tabs.sendMessage(activeTab.id, "startAutoConnect");
          hideStopButton();
        }
      }
    );
  });
});

stopButton.addEventListener("click", () => {
  chrome.tabs.query({ active: true }, ([activeTab]) => {
    chrome.tabs.sendMessage(activeTab.id, "stopAutoConnect");
    hideStopButton();
  });
});

openLinkedInSearchPage.addEventListener("click", () => {
  chrome.tabs.update({ url: linkedInUrl.searchPeoplePage });
});

chrome.tabs.query({ active: true }, function updatePopupContent([activeTab]) {
  const isOnSearchPage = activeTab.url.includes(
    linkedInUrl.patternOfSearchPage
  );

  hideAllMessages();

  if (isOnSearchPage) {
    showSearchPeopleMessage();
  } else {
    showSelectOptionMessage();
    hideStartAndStopButtons();
  }

  if (isOnSearchPage) {
    chrome.tabs.sendMessage(activeTab.id, "isAutoConnectRunning", response => {
      if (!response) {
        hideStopButton();
      } else {
        hideStartButton();
      }
    });
  }

  chrome.tabs.onUpdated.addListener(function handleTabUpdated(
    {},
    {},
    updatedTab
  ) {
    if (updatedTab.id !== activeTab.id) return;
    updatePopupContent([updatedTab]);
    chrome.tabs.onUpdated.removeListener(handleTabUpdated);
  });
});

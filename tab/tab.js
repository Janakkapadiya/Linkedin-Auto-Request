import {linkedInUrl ,linkedInSelector} from "./functions/urlsAndSelectors"

(function() {
  let isAutoConnectRunning = false;
  let autoConnectLastLocation = "";

  // const linkedInUrl = {
  //   patternOfSearchPage: "linkedin.com/search/results/people",
  //   patternOfMyNetworkPage: "linkedin.com/mynetwork"
  // };
  // const linkedInSelector = {
  //   sendNowButton: "div.send-invite button.artdeco-button--primary",
  //   connectButtonsFromSearchPage:
  //     "li.reusable-search__result-container button.ember-view:enabled:not([data-control-id])"
  // };

  function clickSendNowButtonIfAvailable() {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const sendButton = document.querySelector(
          linkedInSelector.sendNowButton
        );

        if (sendButton) {
          sendButton.click();
          clearInterval(interval);
          resolve(null);
        } else {
          reject("Send button not found");
        }
      }, 500);
    });
  }

  function addPeopleFromSearchPage() {
    if (!isAutoConnectRunning) return;

    let invited = 0;

    const delayBetweenClicks = 2000;
    const connectButtons = document.querySelectorAll(
      linkedInSelector.connectButtonsFromSearchPage
    );

    window.scrollTo(0, document.body.scrollHeight);

    if (connectButtons.length > 0 && invited <= 10) {
      for (const button of connectButtons) {
        setTimeout(() => {
          if (isAutoConnectRunning) {
            clickSendNowButtonIfAvailable();
            button.focus();
            button.click();
            window.scrollBy(0, 50);
            clickSendNowButtonIfAvailable();
          }
        }, invited * delayBetweenClicks);

        invited++;
      }
    }

    setTimeout(() => {
      if (!isAutoConnectRunning) return;

      let thereAreConnectButtonsLeft = false;

      if (
        document.querySelectorAll(linkedInSelector.connectButtonsFromSearchPage)
          .length > 0
      ) {
        thereAreConnectButtonsLeft = true;
      }

      if (thereAreConnectButtonsLeft) {
        addPeopleFromSearchPage();
      }
    }, invited * delayBetweenClicks + 2000);
  }

  function isOnSearchPage() {
    return location.href.includes(linkedInUrl.patternOfSearchPage);
  }

  function checkIfUrlHasChanged() {
    if (!isAutoConnectRunning || location.href === autoConnectLastLocation)
      return;

    autoConnectLastLocation = location.href;

    if (isOnSearchPage()) {
      addPeopleFromSearchPage();
    } else {
      isAutoConnectRunning = false;
    }
  }

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
        isAutoConnectRunning = true;
        sendResponse(isAutoConnectRunning);
        break;
      case "stopAutoConnect":
        isAutoConnectRunning = false;
        autoConnectLastLocation = "";
        sendResponse(isAutoConnectRunning);
        break;
    }
  });
})();

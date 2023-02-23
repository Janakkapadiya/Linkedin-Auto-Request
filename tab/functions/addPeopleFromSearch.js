import { clickSendNowButtonIfAvailable } from "./clickSendNowButton";
import { linkedInSelector } from "./urlsAndSelectors";
import { isAutoConnectRunning } from "./const";

export function addPeopleFromSearchPage() {
  if (!isAutoConnectRunning) return;

  let invited = 0;

  const delayBetweenClicks = 4000;
  const connectButtons = document.querySelectorAll(
    linkedInSelector.connectButtonsFromSearchPage
  );

  window.scrollTo(0, document.body.scrollHeight);

  if (connectButtons.length > 0 && connectButtons.length < 10) {
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
        .length > 0 &&
      document.querySelectorAll(linkedInSelector.connectButtonsFromSearchPage)
        .length <= 9
    ) {
      thereAreConnectButtonsLeft = true;
    }

    if (thereAreConnectButtonsLeft) {
      addPeopleFromSearchPage();
    } else {
      return;
    }
  }, invited * delayBetweenClicks + 4000);
}

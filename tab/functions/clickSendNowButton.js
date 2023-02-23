import { linkedInSelector } from "./urlsAndSelectors";

export function clickSendNowButtonIfAvailable() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const sendButton = document.querySelector(linkedInSelector.sendNowButton);

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

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

export { hideStartButton, hideStopButton, hideStartAndStopButtons };

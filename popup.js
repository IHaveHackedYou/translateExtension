stealthModeCheckbox = document.querySelector("#stealthModeCheckBox");
feedbackCheckBox = document.querySelector("#feedbackCheckBox");

chrome.runtime.connect({ name: "popup" });

chrome.storage.sync.get(["stealthModeCheckboxChecked", "feedbackCheckboxChecked"], ({ stealthModeCheckboxChecked, feedbackCheckboxChecked }) => {
  // updateSlider(englishLevel);
  stealthModeCheckbox.checked = stealthModeCheckboxChecked;
  feedbackCheckBox.checked = feedbackCheckboxChecked;

});

stealthModeCheckBox.addEventListener("input", async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

  if (stealthModeCheckBox.checked) {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: stealthChecked,
      });
  } else {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: stealthUnchecked,
      });
  }
});

feedbackCheckBox.addEventListener("input", async() => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (feedbackCheckBox.checked) {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: feedbackChecked,
      });
  } else {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: feedbackUnchecked,
      });
  }
});

function stealthChecked() {
  console.log("stealth checked");
  let stealthModeCheckboxChecked = true;
  chrome.storage.sync.set({ stealthModeCheckboxChecked }, () => {});
}

function stealthUnchecked() {
  console.log("stealth unchecked");
  let stealthModeCheckboxChecked = false;
  chrome.storage.sync.set({ stealthModeCheckboxChecked }, () => {});
}

function feedbackChecked() {
  console.log("feedback checked");
  let feedbackCheckboxChecked = true;
  chrome.storage.sync.set({ feedbackCheckboxChecked }, () => {});
}

function feedbackUnchecked() {
  console.log("feedback unchecked");
  let feedbackCheckboxChecked = false;
  chrome.storage.sync.set({ feedbackCheckboxChecked }, () => {});
}
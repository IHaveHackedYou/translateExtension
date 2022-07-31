// stealthModeCheckbox = document.querySelector("#stealthModeCheckBox");
// feedbackCheckBox = document.querySelector("#feedbackCheckBox");
automaticTranslationInput = document.querySelector("#automaticTranslationCb");
doubleClickInput = document.querySelector("#doubleClickCb");
visibleTranslationInput = document.querySelector("#visibleTranslationCb");
feedbackButtonsInput = document.querySelector("#feedbackButtonsCb");
port = chrome.runtime.connect({ name: "popup" });

// chrome.storage.sync.get(["stealthModeCheckboxChecked", "feedbackCheckboxChecked"], ({ stealthModeCheckboxChecked, feedbackCheckboxChecked }) => {
//   // updateSlider(englishLevel);
//   stealthModeCheckbox.checked = stealthModeCheckboxChecked;
//   feedbackCheckBox.checked = feedbackCheckboxChecked;

// });

window.onload = function () {
  automaticTranslationInput = document.querySelector("#automaticTranslationCb");
  doubleClickInput = document.querySelector("#doubleClickCb");
  visibleTranslationInput = document.querySelector("#visibleTranslationCb");
  feedbackButtonsInput = document.querySelector("#feedbackButtonsCb");
  chrome.storage.sync.get(
    [
      "automaticTranslationCb",
      "doubleClickCb",
      "visibleTranslationCb",
      "feedbackButtonsCb",
    ],
    ({
      automaticTranslationCb,
      doubleClickCb,
      visibleTranslationCb,
      feedbackButtonsCb,
    }) => {
      console.log(automaticTranslationCb);
      automaticTranslationInput.checked = automaticTranslationCb;
      doubleClickInput.checked = doubleClickCb;
      visibleTranslationInput.checked = visibleTranslationCb;
      feedbackButtonsInput.checked = feedbackButtonsCb;
    }
  );
};

try{

automaticTranslationInput.addEventListener("input", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

  if (automaticTranslationInput.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: automaticTranslationChecked,
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: automaticTranslationUnchecked,
    });
  }
});

function automaticTranslationChecked() {
  console.log("stealth checked");
  let automaticTranslationCb = true;
  chrome.storage.sync.set({ automaticTranslationCb }, () => {});
}

function automaticTranslationUnchecked() {
  console.log("stealth unchecked");
  let automaticTranslationCb = false;
  chrome.storage.sync.set({ automaticTranslationCb }, () => {});
}


doubleClickInput.addEventListener("input", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

  if (doubleClickInput.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: doubleClickChecked,
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: doubleClickUnchecked,
    });
  }
});

function doubleClickChecked() {
  console.log("stealth checked");
  let doubleClickCb = true;
  chrome.storage.sync.set({ doubleClickCb }, () => {});
}

function doubleClickUnchecked() {
  console.log("stealth unchecked");
  let doubleClickCb = false;
  chrome.storage.sync.set({ doubleClickCb }, () => {});
}


visibleTranslationInput.addEventListener("input", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

  if (visibleTranslationInput.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: visibleTranslationChecked,
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: visibleTranslationUnchecked,
    });
  }
});

function visibleTranslationChecked() {
  console.log("stealth checked");
  let visibleTranslationCb = true;
  chrome.storage.sync.set({ visibleTranslationCb }, () => {});
}

function visibleTranslationUnchecked() {
  console.log("stealth unchecked");
  let visibleTranslationCb = false;
  chrome.storage.sync.set({ visibleTranslationCb }, () => {});
}


feedbackButtonsInput.addEventListener("input", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

  if (feedbackButtonsInput.checked) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: feedbackButtonsChecked,
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: feedbackButtonsUnchecked,
    });
  }
});

function feedbackButtonsChecked() {
  console.log("stealth checked");
  let feedbackButtonsCb = true;
  chrome.storage.sync.set({ feedbackButtonsCb }, () => {});
}

function feedbackButtonsUnchecked() {
  console.log("stealth unchecked");
  let feedbackButtonsCb = false;
  chrome.storage.sync.set({ feedbackButtonsCb }, () => {});
}
}

catch(e){

}


// stealthModeCheckBox.addEventListener("input", async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

//   if (stealthModeCheckBox.checked) {
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: stealthChecked,
//       });
//   } else {
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: stealthUnchecked,
//       });
//   }
// });

// feedbackCheckBox.addEventListener("input", async() => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   if (feedbackCheckBox.checked) {
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: feedbackChecked,
//       });
//   } else {
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: feedbackUnchecked,
//       });
//   }
// });

// function stealthChecked() {
//   console.log("stealth checked");
//   let stealthModeCheckboxChecked = true;
//   chrome.storage.sync.set({ stealthModeCheckboxChecked }, () => {});
// }

// function stealthUnchecked() {
//   console.log("stealth unchecked");
//   let stealthModeCheckboxChecked = false;
//   chrome.storage.sync.set({ stealthModeCheckboxChecked }, () => {});
// }

// function feedbackChecked() {
//   console.log("feedback checked");
//   let feedbackCheckboxChecked = true;
//   chrome.storage.sync.set({ feedbackCheckboxChecked }, () => {});
// }

// function feedbackUnchecked() {
//   console.log("feedback unchecked");
//   let feedbackCheckboxChecked = false;
//   chrome.storage.sync.set({ feedbackCheckboxChecked }, () => {});
// }

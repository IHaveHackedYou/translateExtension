// feedbackButtonCheckBox = document.querySelector("#feedbackCheckBox");
feedbackButtonCheckBox = document.querySelectorAll("checkbox__input")[0];
stealthModeCheckBox = document.querySelectorAll("checkbox__input")[1];
// stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");
// let slider = document.querySelector("#englishLevelSlider");

// chrome.storage.sync.get("color", ({ color }) => {
//     changeColor.style.backgroundColor = color;
// });

// changeColor.addEventListener("click", async() => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: setPageBackgroundColor,
//     });
// });

// function setPageBackgroundColor() {
//     chrome.storage.sync.get("color", ({ color }) => {
//         document.body.style.backgroundColor = color;
//     });
// }

chrome.storage.sync.get(["englishLevel", "feedbackCheckboxChecked", "stealthModeCheckboxChecked"], ({ englishLevel, feedbackCheckboxChecked, stealthModeCheckboxChecked }) => {
    // updateSlider(englishLevel);
    feedbackButtonCheckBox.checked = feedbackCheckboxChecked;
    stealthModeCheckBox.checked = stealthModeCheckboxChecked;
});

chrome.runtime.connect({ name: "popup" });

feedbackButtonCheckBox.addEventListener("input", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let feedbackCheckBox = document.querySelector("#feedbackCheckBox");

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

stealthModeCheckBox.addEventListener("input", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");

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

// slider.addEventListener("input", async() => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     let englishLevelSlider = document.querySelector("#englishLevelSlider");

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: setEnglishLevel,
//         args: [englishLevelSlider.value],
//     });
// });

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

// function setEnglishLevel(value) {
//     englishLevel = value;
//     chrome.storage.sync.set({ englishLevel }, () => {});
// }
// let englishLevelSlider = document.querySelector("#englishLevelSlider");
let feedbackCheckBox = document.querySelector("#feedbackCheckBox");
let stealthModeCheckBox = document.querySelector("#stealthModeCheckBox");
let slider = document.querySelector("#englishLevelSlider");

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

feedbackCheckBox.addEventListener("input", async() => {
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

slider.addEventListener("input", async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let englishLevelSlider = document.querySelector("#englishLevelSlider");

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setEnglishLevel,
        args: [englishLevelSlider.value],
    });
});

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

function setEnglishLevel(value) {
    console.log("english level set" + value);
    englishLevel = value;
    chrome.storage.sync.set({ englishLevel }, () => {});
}
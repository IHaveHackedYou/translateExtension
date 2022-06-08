let color = "#3f51b5";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log("Default background color set to %cgreen", `color: ${color}`);
})

// fires when any value changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storage_change = changes[key];

        // if (key === "englishLevel") {
        //     // chrome.tabs.reload();
        // }

        if (key === "color") {
            color = storage_change.newValue;
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
            });
            console.log("Background color set to %c%s", `color: ${color}`, color);
        }
    }
})

// fires when popup window closes
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === "popup") {
        port.onDisconnect.addListener(function() {
            chrome.tabs.reload();
        });
    }
});
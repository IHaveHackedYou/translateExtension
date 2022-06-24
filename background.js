const URL =
  "https://raw.githubusercontent.com/IHaveHackedYou/translateExtension/main/complete.txt";

chrome.runtime.onInstalled.addListener(() => {
  refreshLists();
});

// // fires when any value changes
// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (var key in changes) {
//     var storage_change = changes[key];

//     if (key === "color") {
//       color = storage_change.newValue;
//       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
//       });
//       console.log("Background color set to %c%s", `color: ${color}`, color);
//     }
//   }
// });

// fires when popup window closes
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function () {
      refreshLists((reload = true));
    });
  }
});

function refreshLists(reload = false) {
  words = [];
  allWords = [];
  translations = [];
  counts = [];

  fetch(URL).then((response) => {
    response.text().then((output) => {
      chrome.storage.sync.get(
        ["englishLevel", "dislikeWordList"],
        ({ englishLevel, dislikeWordList }) => {
          splitted_text = output.split("\n");
          // TODO remove change complete.txt
          englishLevel = 1 / englishLevel / 100;

          if (dislikeWordList === undefined) {
            dislikeWordList = ["jfijeow0/98f9whf78w6732()/&%$/&("];
          }
          var i = 0,
            len = splitted_text.length;

          while (i < len) {
            further_splitted_text = splitted_text[i].split(",");
            if (
              further_splitted_text[1] < englishLevel &&
              !dislikeWordList.includes(further_splitted_text[2])
            ) {
              words.push(further_splitted_text[2]);
              translations.push(further_splitted_text[3]);
              counts.push(further_splitted_text[1]);
            }
            allWords.push(further_splitted_text[2]);
            i++;
          }
          sumDislikedCounts = 0;
          for (let i = 0; i < dislikeWordList.length; i++) {
            index = allWords.indexOf(dislikeWordList[i]);
            if (index > -1 && counts[index]!==undefined) {
              sumDislikedCounts += +counts[index];
            }
          }
          if(dislikeWordList.length > 0)
            englishLevel = sumDislikedCounts / dislikeWordList.length;
          console.log("englishLevel: " + englishLevel);
          while (i < len) {
            further_splitted_text = splitted_text[i].split(",");
            if (
              further_splitted_text[1] < englishLevel &&
              !dislikeWordList.includes(further_splitted_text[2])
            ) {
              words.push(further_splitted_text[2]);
              translations.push(further_splitted_text[3]);
            }
            i++;
          }
          chrome.storage.local.set({ words });
          chrome.storage.sync.set({englishLevel});
          chrome.storage.local.set({ translations }, () => {
            console.log("refreshed");
            if (reload) chrome.tabs.reload();
          });
        }
      );
    });
  });
}

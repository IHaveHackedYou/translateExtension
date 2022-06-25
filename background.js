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
  // words that should get translated
  words = [];
  // all words of wordList
  allWords = [];
  // translations in German
  translations = [];
  // word frequency number in English language
  counts = [];

  // load word list from server/github as txt file
  fetch(URL).then((response) => {
    response.text().then((output) => {
      // load englishLevel: float of english level of user, the smaller the number the more words knows the user
      // load dislikeWordList: words that user marked with X or disliked, user already know the word
      chrome.storage.sync.get(
        ["englishLevel", "dislikeWordList"],
        ({ englishLevel, dislikeWordList }) => {
          // split word list into array
          splittedWordList = output.split("\n");

          // iterate over splittedWordList
          var i = 0;
          len = splittedWordList.length;
          while (i < len) {
            // split further ...
            furtherSplittedText = splittedWordList[i].split(",");

            // into
            count = furtherSplittedText[1];
            word = furtherSplittedText[2];
            translation = furtherSplittedText[3];

            // check if current counts should get translated (smaller as englishLevel)
            // and look for duplicate in dislikeWordList
            if (count < englishLevel && !dislikeWordList.includes(word)) {
              words.push(word);
              translations.push(translation);
              counts.push(count);
            }
            allWords.push(word);
            i++;
          }

          // num of words that got disliked
          sumDislikedCounts = 0;
          // iterate over dislikeWordList
          for (let i = 0; i < dislikeWordList.length; i++) {
            index = allWords.indexOf(dislikeWordList[i]);
            // if index is valid
            if (index > -1 && counts[index] !== undefined) {
              sumDislikedCounts += +counts[index];
            }
          }
          if (dislikeWordList.length > 0) {
            // new englishLevel is average of counts of disliked words
            englishLevel = sumDislikedCounts / dislikeWordList.length;
          } else {
            englishLevel = 100000000000;
          }

          // new englishLevel gets fist applied when this function runs again, due to performance reasons
          console.log("englishLevel: " + englishLevel);

          // save lists
          chrome.storage.local.set({ words });
          chrome.storage.sync.set({ englishLevel });
          chrome.storage.local.set({ translations }, () => {
            console.log("refreshed");
            if (reload) chrome.tabs.reload();
          });
        }
      );
    });
  });
}

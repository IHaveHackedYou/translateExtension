url = "https://raw.githubusercontent.com/IHaveHackedYou/NLP/main/finished.txt";

chrome.runtime.onInstalled.addListener(() => {
  refreshLists();
  automaticTranslationCb = true;
  doubleClickCb = true;
  visibleTranslationCb = true;
  feedbackButtonsCb = true;
  chrome.storage.sync.set({ automaticTranslationCb }, () => {});
  chrome.storage.sync.set({ doubleClickCb }, () => {});
  chrome.storage.sync.set({ visibleTranslationCb }, () => {});
  chrome.storage.sync.set({ feedbackButtonsCb }, () => {});
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

// handle enable/disable of extension
chrome.commands.onCommand.addListener((command) => {

  if (command === "run-foo") {
    chrome.storage.sync.get(
      ["automaticTranslationCb", "doubleClickCb"],
      ({ automaticTranslationCb, doubleClickCb }) => {
        if (automaticTranslationCb === true) {
          automaticTranslationCb = false;
          doubleClickCb = false;
        } else {
          automaticTranslationCb = true;
          doubleClickCb = true;
        }
        chrome.storage.sync.set(
          { automaticTranslationCb, doubleClickCb },
          () => {
            chrome.tabs.reload();
          }
        );
      }
    );
  }
});

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
      port.onDisconnect.addListener(function() {
         refreshLists(reload = false)
      });
  }
});



function refreshLists1(reload = false) {
  // words that should get translated
  words = [];
  // all words of wordList
  allWords = [];
  // translations in German
  translations = [];
  // all translations in German
  allTranslations = [];
  // word frequency number in English language
  counts = [];

  // load word list from server/github as txt file
  fetch(URL).then((response) => {
    response.text().then((output) => {
      // load englishLevel: float of english level of user, the smaller the number the more words knows the user
      // load dislikeWordList: words that user marked with X or disliked, user already know the word
      chrome.storage.sync.get(
        ["englishLevel", "dislikeWordList", "likedWordList"],
        ({ englishLevel, dislikeWordList, likedWordList }) => {
          // split word list into array
          splittedWordList = output.split("\n");

          if (likedWordList === undefined) likedWordList = [];
          if (dislikeWordList === undefined) dislikeWordList = [];
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
            if (
              (count < englishLevel && !dislikeWordList.includes(word)) ||
              likedWordList.includes(word)
            ) {
              words.push(word);
              translations.push(translation);
              counts.push(count);
            }
            allWords.push(word);
            allTranslations.push(translation);
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
          if (dislikeWordList.length > 0 && englishLevel !== 0) {
            // new englishLevel is average of counts of disliked words
            englishLevel = sumDislikedCounts / dislikeWordList.length;
          } else {
            englishLevel = 100000000000;
          }

          // new englishLevel gets fist applied when this function runs again, due to performance reasons
          console.log(
            "englishLevel: " +
              englishLevel +
              " sumDislikeCounts: " +
              sumDislikedCounts +
              " len: " +
              dislikeWordList.length
          );
          // save lists
          chrome.storage.local.set({ words });
          chrome.storage.local.set({ allWords });
          chrome.storage.local.set({ allTranslations });
          chrome.storage.sync.set({ englishLevel });
          chrome.storage.local.set({ translations }, () => {
            if (reload) chrome.tabs.reload();
          });
        }
      );
    });
  });
}

function refreshLists(reload = false) {
  // words that should get translated
  words = [];
  // all words of wordList
  allWords = [];
  // translations in German
  translations = [];
  // all translations in German
  allTranslations = [];
  // word frequency number in English language
  counts = [];

  // load word list from server/github as txt file
  fetch(url).then((response) => {
    response.text().then((output) => {
      // load englishLevel: float of english level of user, the smaller the number the more words knows the user
      // load dislikeWordList: words that user marked with X or disliked, user already know the word
      chrome.storage.sync.get(
        ["englishLevel", "dislikeWordList", "likedWordList"],
        ({ englishLevel, dislikeWordList, likedWordList }) => {
          // split word list into array
          splittedWordList = output.split("\n");
          if (likedWordList === undefined) likedWordList = [];
          if (dislikeWordList === undefined) dislikeWordList = [];
          // iterate over splittedWordList
          var i = 0;
          len = splittedWordList.length;
          while (i < len) {
            // split further ...
            furtherSplittedText = splittedWordList[i].split(",");
            // into
            count = furtherSplittedText[1];
            word = furtherSplittedText[2];
            if (furtherSplittedText.length > 4)
              translation = furtherSplittedText.slice(3);
            else translation = [furtherSplittedText[3]];
            // console.log(count + " " + word + " " + translation)
            // check if current counts should get translated (smaller as englishLevel)
            // and look for duplicate in dislikeWordList
            if (
              (count < englishLevel && !dislikeWordList.includes(word)) ||
              likedWordList.includes(word)
            ) {
              words.push(word);
              translations.push(translation);
              counts.push(count);
            }
            allWords.push(word);
            allTranslations.push(translation);
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
          if (dislikeWordList.length > 0 && englishLevel !== 0) {
            // new englishLevel is average of counts of disliked words
            englishLevel = sumDislikedCounts / dislikeWordList.length;
          } else {
            englishLevel = 1;
          }

          // new englishLevel gets fist applied when this function runs again, due to performance reasons
          console.log(
            "englishLevel: " +
              englishLevel +
              " sumDislikeCounts: " +
              sumDislikedCounts +
              " len: " +
              dislikeWordList.length
          );
          // save lists
          chrome.storage.local.set({ words });
          chrome.storage.local.set({ allWords });
          chrome.storage.local.set({ allTranslations });
          chrome.storage.sync.set({ englishLevel });
          chrome.storage.local.set({ translations }, () => {
            if (reload) chrome.tabs.reload();
          });
        }
      );
    });
  });
}

// dislike button
const DISLIKE_BUTTON_HTML_TEXT = `<button class="dislike_button_69420">✖</button> `;

const STEALTH_MODE_HTML_BEGIN = `|<i>`;
const STEALTH_MODE_HTML_END = `</i>`;
const NON_STEALTH_MODE_HTML_BEGIN = ` <b>`;
const NON_STEALTH_MODE_HTML_END = `</b>`;

words = [];
translations = [];
automaticTranslationCb_ = undefined;
doubleClickCb_ = undefined;

// init translation popup overlay
var bubbleDOM = document.createElement("div");
var englishWordH2 = document.createElement("h2");
var container = document.createElement("div");
var link = document.createElement("link");
var translationIcon = document.createElement("i");
link.setAttribute(
  "href",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
);
link.setAttribute("rel", "stylesheet");
translationIcon.innerText = "g_translate";
translationIcon.setAttribute("class", "material-icons");
container.setAttribute("class", "container");
bubbleDOM.setAttribute("class", "selection_bubble");

bubbleDOM.appendChild(link);
container.appendChild(englishWordH2);
container.appendChild(translationIcon);
bubbleDOM.appendChild(container);
currentSelectedWord = "";
document.body.appendChild(bubbleDOM);

initLoadingOverlay();
replaceWords();
addWordDoubleClick();

function initLoadingOverlay() {
  chrome.storage.sync.get(
    ["automaticTranslationCb"],
    (automaticTranslationCb) => {
      automaticTranslationCb_ = automaticTranslationCb.automaticTranslationCb;
      if (automaticTranslationCb_ === true) {
        // overlay over complete page
        loadingOverlay = document.createElement("div");
        loadingOverlay.setAttribute("id", "overlay");

        // position for loader text and box styling
        loader = document.createElement("div");
        loader.setAttribute("class", "loader");

        // only loading text
        loaderText = document.createElement("div");
        loaderText.setAttribute(
          "style",
          `
color: #8ab4f8;
font-family: "Roboto" sans-serif;
font-size: 16px;
padding-left: 10px;
padding-top: 5px; 
`
        );
        loaderText.textContent = "Loading ...";
        loader.appendChild(loaderText);

        loadingOverlay.appendChild(loader);

        // display overlay, hidden at beginning
        showLoadingOverlay();
      }
    }
  );
}

function replaceWords() {
  startTime = Date.now();
  chrome.storage.local.get(
    ["words", "translations"],
    ({ words, translations }) => {
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
          doubleClickCb_ = doubleClickCb.doubleClickCb
          if (automaticTranslationCb === true) {
            if (feedbackButtonsCb) {
              button_html_dislike = DISLIKE_BUTTON_HTML_TEXT;
            } else {
              button_html_like = " ";
              button_html_dislike = " ";
            }

            if (!visibleTranslationCb) {
              trans_html_begin = STEALTH_MODE_HTML_BEGIN;
              trans_html_end = STEALTH_MODE_HTML_END;
            } else {
              trans_html_begin = NON_STEALTH_MODE_HTML_BEGIN;
              trans_html_end = NON_STEALTH_MODE_HTML_END;
            }
            // get all text from website with "p" or "blockquote" tag
            const text = document.querySelectorAll("p, blockquote, li, span");
            // const text = document.body
            foundedWords = [];
            i = 0;
            while (i < text.length) {
              j = 0;
              currentText = text[i].textContent;
              textWords = currentText.split(" ");
              currentHTML = text[i].innerHTML;
              while (j < textWords.length) {
                foundedWord = textWords[j];
                index = words.indexOf(foundedWord);
                if (index > -1) {
                  // foundedWords.push(textWords[j].toString());

                  currentHTML = currentHTML.replace(
                    " " + foundedWord + " ",
                    " <span>" +
                      foundedWord +
                      "</span>" +
                      trans_html_begin +
                      translations[index][0] +
                      trans_html_end +
                      button_html_dislike
                  );
                  currentHTML = currentHTML.replace(
                    " " + foundedWord + ".",
                    " <span>" +
                      foundedWord +
                      "</span>" +
                      trans_html_begin +
                      translations[index][0] +
                      trans_html_end +
                      ". " +
                      button_html_dislike
                  );
                  currentHTML = currentHTML.replace(
                    " " + foundedWord + ",",
                    " <span>" +
                      foundedWord +
                      "</span>" +
                      trans_html_begin +
                      translations[index][0] +
                      trans_html_end +
                      ", " +
                      button_html_dislike
                  );
                }
                j++;
              }
              text[i].innerHTML = currentHTML;

              i++;
            }
            hideLoadingOverlay();
            // let likeButtons = document.getElementsByClassName("like_button_69420");
            let dislikeButtons = document.getElementsByClassName(
              "dislike_button_69420"
            );

            for (let i = 0; i < dislikeButtons.length; i++) {
              dislikeButtons[i].addEventListener("click", function () {
                currentWord =
                  dislikeButtons[i].previousElementSibling
                    .previousElementSibling.textContent;
                chrome.storage.sync.get(
                  ["dislikeWordList", "likedWordList"],
                  ({ dislikeWordList, likedWordList }) => {
                    if (dislikeWordList === undefined) {
                      dislikeWordList = [];
                    }
                    if (!dislikeWordList.includes(currentWord)) {
                      dislikeWordList.push(currentWord.toString());

                      index = likedWordList.indexOf(currentWord.toString());
                      if (index > -1) likedWordList.splice(index, 1);

                      chrome.storage.sync.set({
                        dislikeWordList,
                        likedWordList,
                      });
                      dislikeButtons[i].style.backgroundColor = "#636466";
                    } else {
                      dislikeWordList.splice(
                        dislikeWordList.indexOf(currentWord),
                        1
                      );
                      chrome.storage.sync.set({ dislikeWordList });
                      dislikeButtons[i].style.backgroundColor = "#8AB4F8";
                    }
                  }
                );
              });
            }
          }
        }
      );
    }
  );
}

function addWordDoubleClick() {
  document.addEventListener("dblclick", function (e) {
    try {
      if (doubleClickCb_ !== true) return;
    } catch (e) {
      console.log("doubleClickCb is null");
    }
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var text = range.cloneContents().textContent.replace(/\s/g, "");
    chrome.storage.local.get(
      ["allWords", "allTranslations"],
      ({ allWords, allTranslations }) => {
        word = text.toLowerCase();
        index = allWords.indexOf(word);
        if (index > -1) {
          // alert(allTranslations[index]);
          showBubblePopup(allTranslations[index], word, range, e);
          chrome.storage.sync.get(
            ["likedWordList", "dislikeWordList"],
            ({ likedWordList, dislikeWordList }) => {
              if (likedWordList === undefined) {
                likedWordList = [];
              }
              if (!likedWordList.includes(word)) {
                likedWordList.push(word);

                index = dislikeWordList.indexOf(word);
                if (index > -1) dislikeWordList.splice(index, 1);

                chrome.storage.sync.set({ likedWordList, dislikeWordList });
              }
            }
          );
        }
      }
    );
  });
  var ignoreClickOnMeElement = bubbleDOM;

  document.addEventListener("mousedown", function (event) {
    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    if (!isClickInsideElement) {
      bubbleDOM.style.visibility = "hidden";
    }
  });
  translationIcon.addEventListener("click", function (e) {
    window
      .open(
        "https://translate.google.com/?sl=auto&tl=de&text=" +
          currentSelectedWord +
          "&op=translate",
        "_blank"
      )
      .focus();
  });
}

function showBubblePopup(synonyms, englishWord, selectionRange, e) {
  pos = selectionRange.getBoundingClientRect();
  // renderBubble(e.clientX - 20, e.clientY + window.scrollY + 10, word);
  synonymList = synonyms.toString().split(",");
  currentSelectedWord = englishWord;
  renderBubble(
    pos.x - 5,
    pos.y + window.scrollY + 20,
    synonymList,
    englishWord
  );
}

function renderBubble(mouseX, mouseY, synonymList, englishWord) {
  previousUL = bubbleDOM.querySelector("ul");
  if (previousUL) previousUL.parentElement.removeChild(previousUL);
  var translationsUL = document.createElement("ul");
  translationsUL.setAttribute("class", "selection_bubble_ul");
  var i = 0;
  var len = synonymList.length;
  while (i < len) {
    synonymLI = document.createElement("li");
    synonymLI.innerText = synonymList[i];
    translationsUL.appendChild(synonymLI);
    i++;
  }
  englishWordH2.innerText = englishWord;
  bubbleDOM.appendChild(translationsUL);

  bubbleDOM.style.top = mouseY + "px";
  bubbleDOM.style.left = mouseX + "px";
  bubbleDOM.style.visibility = "visible";
}

function showLoadingOverlay() {
  document.body.appendChild(loadingOverlay);
  document.getElementById("overlay").style.display = "block";
}

function hideLoadingOverlay() {
  if(automaticTranslationCb_)
    document.getElementById("overlay").style.display = "none";
}

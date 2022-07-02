// dislike button with css code
const DISLIKE_BUTTON_HTML_TEXT = `<button style="
border: 0px;
width: 1.2em;
height: 1.2em;
background-color: #8AB4F8;
border-radius: 20%;
vertical-align: middle;
margin: 0px 0px 3px 2px;
text-align: center;
color: black;
line-height: 10px;
padding: 0px 0px;
" class="dislike_button_69420">✖</button> `;

const STEALTH_MODE_HTML_BEGIN = `|<i>`;
const STEALTH_MODE_HTML_END = `</i>`;
const NON_STEALTH_MODE_HTML_BEGIN = ` <b>`;
const NON_STEALTH_MODE_HTML_END = `</b>`;

words = [];
translations = [];
enableExtension_ = true;

initLoadingOverlay();
replaceWords();
addWordDoubleClick();
bubbleDOM();

function initLoadingOverlay() {
  // overlay over complete page
  loadingOverlay = document.createElement("div");
  loadingOverlay.setAttribute("id", "overlay");
  loadingOverlay.setAttribute(
    "style",
    `
    position: fixed; /* Sit on top of the page content */
    display: none; /* Hidden by default */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0); /* Black background with opacity */
    cursor: pointer; /* Add a pointer on hover */`
  );
  // position for loader text and box styling
  loader = document.createElement("div");
  loader.setAttribute("class", "loader");
  loader.setAttribute(
    "style",
    `
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    background-color: #292a2d;
    border: 0.5px solid #9aa0a6;
    width: 100px;
    height: 30px;
    border-radius: 5px;
  `
  );

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

function replaceWords() {
  startTime = Date.now();
  chrome.storage.local.get(
    ["words", "translations"],
    ({ words, translations }) => {
      chrome.storage.sync.get(
        [
          "feedbackCheckboxChecked",
          "stealthModeCheckboxChecked",
          "enableTranslation",
          "enableExtension",
        ],
        ({
          feedbackCheckboxChecked,
          stealthModeCheckboxChecked,
          enableTranslation,
          enableExtension,
        }) => {
          enableExtension_ = enableExtension;
          console.log(
            "enableExtension: " +
              enableExtension +
              " enableTranslation: " +
              enableTranslation
          );
          if (enableTranslation === true) {
            if (feedbackCheckboxChecked) {
              button_html_dislike = DISLIKE_BUTTON_HTML_TEXT;
            } else {
              button_html_like = " ";
              button_html_dislike = " ";
            }

            if (stealthModeCheckboxChecked) {
              trans_html_begin = STEALTH_MODE_HTML_BEGIN;
              trans_html_end = STEALTH_MODE_HTML_END;
            } else {
              trans_html_begin = NON_STEALTH_MODE_HTML_BEGIN;
              trans_html_end = NON_STEALTH_MODE_HTML_END;
            }
            // get all text from website with "p" or "blockquote" tag
            const text = document.querySelectorAll("p, blockquote, li, span");

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
                      translations[index] +
                      trans_html_end +
                      button_html_dislike
                  );
                  currentHTML = currentHTML.replace(
                    " " + foundedWord + ".",
                    " <span>" +
                      foundedWord +
                      "</span>" +
                      trans_html_begin +
                      translations[index] +
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
                      translations[index] +
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
                console.log(currentWord);
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
                      console.log(dislikeWordList);
                    } else {
                      dislikeWordList.splice(
                        dislikeWordList.indexOf(currentWord),
                        1
                      );
                      chrome.storage.sync.set({ dislikeWordList });
                      dislikeButtons[i].style.backgroundColor = "#8AB4F8";
                      console.log(dislikeWordList);
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

function bubbleDOM() {
  var bubbleDOM = document.createElement("div");
  bubbleDOM.setAttribute("class", "selection_bubble");
  document.body.appendChild(bubbleDOM);
  function addWordDoubleClick() {
    document.addEventListener("dblclick", function (e) {
      if (enableExtension_ !== true) return;
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
            showBubblePopup(allTranslations[index], range, e);
            chrome.storage.sync.get(
              ["likedWordList", "dislikeWordList"],
              ({ likedWordList, dislikeWordList }) => {
                if (likedWordList === undefined) {
                  likedWordList = [];
                }
                if (!likedWordList.includes(word)) {
                  likedWordList.push(word);
                  console.log(likedWordList);

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

    document.addEventListener(
      "mousedown",
      function (e) {
        bubbleDOM.style.visibility = "hidden";
      },
      false
    );
  }
}

function showBubblePopup(word, selectionRange, e) {
  pos = selectionRange.getBoundingClientRect();
  console.log(pos);
  // renderBubble(e.clientX - 20, e.clientY + window.scrollY + 10, word);
  renderBubble(pos.x - 5, pos.y + window.scrollY + 20, word);
}

function renderBubble(mouseX, mouseY, selection) {
  bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + "px";
  bubbleDOM.style.left = mouseX + "px";
  bubbleDOM.style.visibility = "visible";
}

function showLoadingOverlay() {
  document.body.appendChild(loadingOverlay);
  document.getElementById("overlay").style.display = "block";
}

function hideLoadingOverlay() {
  document.getElementById("overlay").style.display = "none";
}

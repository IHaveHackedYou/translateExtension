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

console.log("start" + Date.now());
startTime = Date.now();
chrome.storage.local.get(
  ["words", "translations"],
  ({ words, translations }) => {
    chrome.storage.sync.get(
      ["feedbackCheckboxChecked", "stealthModeCheckboxChecked"],
      ({ feedbackCheckboxChecked, stealthModeCheckboxChecked }) => {
        console.log("loaded files in: " + (Date.now() - startTime) + "ms");

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
        const text = document.querySelectorAll("p, blockquote");

        foundedWords = [];
        startWordComparing = Date.now();
        i = 0;
        while (i < text.length) {
          j = 0;
          currentText = text[i].textContent;
          textWords = currentText.split(" ");
          while (j < textWords.length) {
            foundedWord = textWords[j];
            index = words.indexOf(foundedWord);
            if (index > -1) {
              // foundedWords.push(textWords[j].toString());

              currentText = currentText.replace(
                " " + foundedWord + " ",
                " <span>" +
                  foundedWord +
                  "</span>" +
                  trans_html_begin +
                  translations[index] +
                  trans_html_end +
                  button_html_dislike
              );
              currentText = currentText.replace(
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
              currentText = currentText.replace(
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
          text[i].innerHTML = currentText;

          i++;
        }
        console.log(
          "compared words in: " + (Date.now() - startWordComparing) + "ms"
        );

        // startWordReplacing = Date.now();
        // for (let i = 0; i < text.length; i++) {
        //   current_text = text[i].innerHTML;
        //   for (let i = 0; i < foundedWords.length; i++) {
        //     index = words.indexOf(foundedWords[i]);

        //     if (
        //       !(translations[index] === "") &&
        //       translations[index] &&
        //       translations[index].length > 0
        //     ) {
        //       current_text = current_text.replace(
        //         " " + foundedWords[i] + " ",
        //         " <span>" +
        //           foundedWords[i] +
        //           "</span>" +
        //           trans_html_begin +
        //           translations[index] +
        //           trans_html_end +
        //           button_html_dislike
        //       );
        //       current_text = current_text.replace(
        //         " " + foundedWords[i] + ".",
        //         " <span>" +
        //           foundedWords[i] +
        //           "</span>" +
        //           trans_html_begin +
        //           translations[index] +
        //           trans_html_end +
        //           ". " +
        //           button_html_dislike
        //       );
        //       current_text = current_text.replace(
        //         " " + foundedWords[i] + ",",
        //         " <span>" +
        //           foundedWords[i] +
        //           "</span>" +
        //           trans_html_begin +
        //           translations[index] +
        //           trans_html_end +
        //           ", " +
        //           button_html_dislike
        //       );
        //     }
        //   }
        //   startReplacingTime = Date.now()
        //   // set replaced text as website text
        //   text[i].innerHTML = current_text;
        //   console.log("replaced single paragraph in: " + (Date.now() - startReplacingTime) + "ms")
        // }
        // console.log(
        //   "replaced complete website in: " + (Date.now() - startWordReplacing) + "ms"
        // );
        console.log("complete duration: " + (Date.now() - startTime) + "ms");

        // let likeButtons = document.getElementsByClassName("like_button_69420");
        let dislikeButtons = document.getElementsByClassName(
          "dislike_button_69420"
        );

        for (let i = 0; i < dislikeButtons.length; i++) {
          dislikeButtons[i].addEventListener("click", function () {
            currentWord =
              dislikeButtons[i].previousElementSibling.previousElementSibling
                .textContent;
            console.log(currentWord);
            chrome.storage.sync.get(
              "dislikeWordList",
              ({ dislikeWordList }) => {
                if (dislikeWordList === undefined) {
                  dislikeWordList = ["jfijeow0/98f9whf78w6732()/&%$/&("];
                }
                if (!dislikeWordList.includes(currentWord)) {
                  dislikeWordList.push(currentWord.toString());
                  chrome.storage.sync.set({ dislikeWordList });
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
    );
  }
);

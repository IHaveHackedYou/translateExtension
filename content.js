// local url to complete.txt
// const URL = chrome.runtime.getURL("complete.txt");
const URL = "https://raw.githubusercontent.com/IHaveHackedYou/translateExtension/main/complete.txt";

// like button with css code
const LIKE_BUTTON_HTML_TEXT = `<button style="
border: 0px;
width: 1.2em; 
height: 1.2em;
background-color: #8AB4F8;
border-radius: 20%;
vertical-align: middle;
margin: 0px 0px 3px 2px;
text-align: center;
line-height: 10px;
color: black;
padding: 0px 0px;
// font-size: 10px;
" class="like_button_69420">✔</button>`;

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

raw_text = "";
words = [];
counts = [];
translations = [];
let translate_threshold = 0.0002;

// open the file
// console.log("start OLD " + Date.now());
// fetch(URL).then((response) =>
//     response.text().then((output) => {
//         chrome.storage.sync.get(["englishLevel", "feedbackCheckboxChecked", "stealthModeCheckboxChecked"], ({ englishLevel, feedbackCheckboxChecked, stealthModeCheckboxChecked }) => {
//             console.log("loaded files" + Date.now());
//             translate_threshold = 1 / englishLevel / 100;
//             raw_text = output.toLowerCase();

//             if (feedbackCheckboxChecked) {
//                 button_html_like = LIKE_BUTTON_HTML_TEXT;
//                 button_html_dislike = DISLIKE_BUTTON_HTML_TEXT;
//             } else {
//                 button_html_like = " ";
//                 button_html_dislike = " ";
//             }

//             if (stealthModeCheckboxChecked) {
//                 trans_html_begin = STEALTH_MODE_HTML_BEGIN;
//                 trans_html_end = STEALTH_MODE_HTML_END;
//             } else {
//                 trans_html_begin = NON_STEALTH_MODE_HTML_BEGIN;
//                 trans_html_end = NON_STEALTH_MODE_HTML_END;
//             }
//             // split file in lines
//             splitted_text = raw_text.split("\n");

//             array = [];

//             for (let i = 1; i < splitted_text.length; i++) {
//                 // split line further into words[2], counts[1], translations[3]
//                 further_splitted_text = splitted_text[i].split(",")
//                 count_to_add = further_splitted_text[1];
//                 // check whether word should get translated
//                 if (count_to_add < translate_threshold) {
//                     word_to_add = further_splitted_text[2]
//                     word_to_add = word_to_add.replace("\r", "")
//                     counts.push(count_to_add)
//                     words.push(word_to_add.toString());
//                     translation_to_add = further_splitted_text[3]
//                         // translation_to_add = translation_to_add.substring(0, translation_to_add.length - 1);
//                     translations.push(translation_to_add);
//                 }
//             }
//             console.log("splitted loaded text" + Date.now());
//             // all p paragraphs in the page
//             const text = document.querySelectorAll("p, blockquote, pre");
//             founded_words = [];
//             for (let i = 0; i < text.length; i++) {
//                 text[i].innerHTML.split(" ").forEach((word) => {
//                     // iterate over every word per paragraph
//                     if (
//                         words.includes(word.toString()) &&
//                         !founded_words.includes(word.toString())
//                     ) {
//                         founded_words.push(word.toString());
//                         // console.log(word.toString());
//                     }
//                 });
//             }
//             console.log("calculated " + Date.now());
//             for (let i = 0; i < text.length; i++) {
//                 current_text = text[i].innerHTML;
//                 for (let i = 0; i < founded_words.length; i++) {
//                     index = words.indexOf(founded_words[i]);

//                     if (!(translations[index] === "") && translations[index] && translations[index].length > 0) {
//                         current_text = current_text.replaceAll(
//                             " " + founded_words[i] + " ",
//                             " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + button_html_like + button_html_dislike
//                         );
//                         current_text = current_text.replaceAll(
//                             " " + founded_words[i] + ".",
//                             " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + ". " + button_html_like + button_html_dislike
//                         );
//                         current_text = current_text.replaceAll(
//                             " " + founded_words[i] + ",",
//                             " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + ", " + button_html_like + button_html_dislike
//                         );
//                     }
//                     // text[i].textContent = text[i].textContent.replaceAll(
//                     //     founded_words[i],
//                     //     founded_words[i] + "(edit)"
//                     // );
//                     // founded_words.splice(i, 1);
//                 }
//                 // console.log(current_text);
//                 text[i].innerHTML = current_text;

//             }
//             console.log("replaced " + Date.now());
//         });

//         let like_buttons = document.getElementsByClassName("like_button_69420");
//         let dislike_buttons = document.getElementsByClassName("dislike_button_69420");
//         for (let i = 0; i < like_buttons.length; i++) {
//             like_buttons[i].addEventListener("click", function() {
//                 console.log("like")
//                 console.log(like_buttons[i].previousSibling.innerHTML)
//                     // word regarding to button
//                 current_word = like_buttons[i].previousSibling.innerHTML
//             });
//         }
//         for (let i = 0; i < dislike_buttons.length; i++) {
//             dislike_buttons[i].addEventListener("click", function() {
//                 console.log("dislike")
//                 current_word = dislike_buttons[i].previousSibling.previousSibling.innerHTML
//                 chrome.storage.sync.get("dislike_word_list", ({ dislike_word_list }) => {
//                     console.log(dislike_word_list)
//                     if (!dislike_word_list.includes(current_word)) {
//                         dislike_word_list.push(current_word.toString())
//                         chrome.storage.sync.set({ dislike_word_list });
//                     }
//                 });


//             });
//         }
//     })
// );


//----------------------------------NEW----------------------------------

console.log("start NEW" + Date.now())
chrome.storage.local.get(["words", "translations"], ({ words, translations }) => {
    chrome.storage.sync.get(["feedbackCheckboxChecked", "stealthModeCheckboxChecked"], ({ feedbackCheckboxChecked, stealthModeCheckboxChecked }) => {
        console.log("loaded files" + Date.now())

        if (feedbackCheckboxChecked) {
            button_html_like = LIKE_BUTTON_HTML_TEXT;
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

        const text = document.querySelectorAll("p, blockquote");
        var counter = 0;
        founded_words = [];
        // var i = 0,
        //     len = text.length;
        // while (i < len) {
        //     txt_words = text[i].innerHTML.split(" ");
        //     var j = 0,
        //         len2 = words.length;
        //     while (j < len2) {
        //         word = txt_words[j];
        //         if (words.includes(word) && !founded_words.includes(word)) {
        //             founded_words.push(word);
        //         }
        //         counter++;
        //         j++;
        //     }
        //     i++;
        //     counter++;
        // }

        for (let i = 0; i < text.length; i++) {
            text[i].innerHTML.split(" ").forEach((word) => {
                // iterate over every word per paragraph
                if (!founded_words.includes(word.toString()) &&
                    words.includes(word.toString())
                ) {
                    founded_words.push(word.toString());
                    // console.log(word.toString());
                }
                counter++;
            });
            counter++;
        }

        console.log("calculated founded words" + counter + "  " + Date.now())


        for (let i = 0; i < text.length; i++) {
            current_text = text[i].innerHTML;
            for (let i = 0; i < founded_words.length; i++) {
                index = words.indexOf(founded_words[i]);

                if (!(translations[index] === "") && translations[index] && translations[index].length > 0) {
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + " ",
                        " <span>" + founded_words[i] + "</span>" + trans_html_begin + translations[index] + trans_html_end + button_html_dislike //+ button_html_dislike
                    );
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + ".",
                        " <span>" + founded_words[i] + "</span>" + trans_html_begin + translations[index] + trans_html_end + ". " + button_html_dislike //+ button_html_dislike
                    );
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + ",",
                        " <span>" + founded_words[i] + "</span>" + trans_html_begin + translations[index] + trans_html_end + ", " + button_html_dislike //+ button_html_dislike
                    );
                }
                // text[i].textContent = text[i].textContent.replaceAll(
                //     founded_words[i],
                //     founded_words[i] + "(edit)"
                // );
                // founded_words.splice(i, 1);
            }
            text[i].innerHTML = current_text;
        }
        console.log("replaced website " + Date.now())

        // let likeButtons = document.getElementsByClassName("like_button_69420");
        let dislikeButtons = document.getElementsByClassName("dislike_button_69420");
        console.log(dislikeButtons.length)
        // for (let i = 0; i < likeButtons.length; i++) {
        //     likeButtons[i].addEventListener("click", function() {
        //         console.log("like")
        //         console.log(likeButtons[i].previousSibling.previousSibling.innerHTML)
        //             // word regarding to button
        //         current_word = likeButtons[i].previousSibling.innerHTML
        //     });
        // }
        for (let i = 0; i < dislikeButtons.length; i++) {
            dislikeButtons[i].addEventListener("click", function() {
                currentWord = dislikeButtons[i].previousElementSibling.previousElementSibling.textContent
                console.log(currentWord)
                chrome.storage.sync.get("dislikeWordList", ({ dislikeWordList }) => {
                    if (dislikeWordList === undefined) {
                        dislikeWordList = ["jfijeow0/98f9whf78w6732()/&%$/&("];
                    }
                    if (!dislikeWordList.includes(currentWord)) {
                        dislikeWordList.push(currentWord.toString())
                        chrome.storage.sync.set({ dislikeWordList });
                        dislikeButtons[i].style.backgroundColor = "#636466";
                        console.log(dislikeWordList)
                    } else {
                        dislikeWordList.splice(dislikeWordList.indexOf(currentWord), 1)
                        chrome.storage.sync.set({ dislikeWordList });
                        dislikeButtons[i].style.backgroundColor = "#8AB4F8";
                        console.log(dislikeWordList)
                    }
                });
            });
        };
    });
});
// local url to complete.txt
// const URL = chrome.runtime.getURL("complete.txt");
const URL = "https://raw.githubusercontent.com/IHaveHackedYou/translateExtension/main/complete.txt";

// like button with css code
const LIKE_BUTTON_HTML_TEXT = `<button style="
border: 0px;
width: 14px;
height: 14px;
background-color: #8AB4F8;
border-radius: 20%;
vertical-align: middle;
margin: 0px 0px 3px 2px;
text-align: center;
line-height: 12px;
padding: 0px 0px;
font-size: 10px;
" class="like_button_69420">✔</button>`;

// dislike button with css code
const DISLIKE_BUTTON_HTML_TEXT = `<button style="
border: 0px;
width: 14px;
height: 14px;
background-color: #8AB4F8;
border-radius: 20%;
vertical-align: middle;
margin: 0px 0px 3px 2px;
text-align: center;
line-height: 10px;
font-size: 10px;
padding: 0px 0px;
" class="like_button_69420">✖</button> `;

const STEALTH_MODE_HTML_BEGIN = `|<i>`;
const STEALTH_MODE_HTML_END = `</i>`;
const NON_STEALTH_MODE_HTML_BEGIN = ` <b>`;
const NON_STEALTH_MODE_HTML_END = `</b>`;

raw_text = "";
words = [];
counts = [];
translations = [];
let translate_threshold = 0.0002;

// chrome.storage.onChanged.addListener(function(changes, namespace) {
//     for (var key in changes) {
//         var storage_change = changes[key];

//         if (key === "feedbackCheckboxChecked") {

//         }
//         if (key === "stealthModeCheckboxChecked") {

//         }
//         if (key === "englishLevel") {
//             translate_threshold = storage_change.newValue / 10000;
//             chrome.tabs.reload(details.tabId);
//         }

//         console.log('Storage key "%s" in namespace "%s" changed. ' +
//             'Old value was "%s", new value is "%s".',
//             key,
//             namespace,
//             storage_change.oldValue,
//             storage_change.newValue);
//     }
// });

// open the file
fetch(URL).then((response) =>
    response.text().then((output) => {
        chrome.storage.sync.get(["englishLevel", "feedbackCheckboxChecked", "stealthModeCheckboxChecked"], ({ englishLevel, feedbackCheckboxChecked, stealthModeCheckboxChecked }) => {
            console.log(feedbackCheckboxChecked, stealthModeCheckboxChecked);
            translate_threshold = 1 / englishLevel / 100;
            raw_text = output.toLowerCase();

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
            // split file in lines
            splitted_text = raw_text.split("\n");
            console.log(translate_threshold);

            for (let i = 1; i < splitted_text.length; i++) {
                // split line further into words[2], counts[1], translations[3]
                further_splitted_text = splitted_text[i].split(",")
                count_to_add = further_splitted_text[1];
                // check whether word should get translated
                if (count_to_add < translate_threshold) {
                    word_to_add = further_splitted_text[2]
                    word_to_add = word_to_add.replace("\r", "")
                    counts.push(count_to_add)
                    words.push(word_to_add.toString());
                    translation_to_add = further_splitted_text[3]
                        // translation_to_add = translation_to_add.substring(0, translation_to_add.length - 1);
                    translations.push(translation_to_add);
                }
            }

            // all p paragraphs in the page
            const text = document.querySelectorAll("p, blockquote");
            founded_words = [];
            for (let i = 0; i < text.length; i++) {
                text[i].innerHTML.split(" ").forEach((word) => {
                    // iterate over every word per paragraph
                    if (
                        words.includes(word.toString()) &&
                        !founded_words.includes(word.toString())
                    ) {
                        founded_words.push(word.toString());
                        // console.log(word.toString());
                    }
                });
            }

            document.innerHTML = `<span style="
            position: absolute;
            top: 0px;
            right: 0px;
            ">Loading</span>` + document.innerHTML;

            for (let i = 0; i < text.length; i++) {
                current_text = text[i].innerHTML;
                for (let i = 0; i < founded_words.length; i++) {
                    index = words.indexOf(founded_words[i]);

                    if (!(translations[index] === "") && translations[index] && translations[index].length > 0) {
                        current_text = current_text.replaceAll(
                            " " + founded_words[i] + " ",
                            " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + button_html_like + button_html_dislike
                        );
                        current_text = current_text.replaceAll(
                            ". " + founded_words[i] + " ",
                            ". " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + button_html_like + button_html_dislike
                        );
                        current_text = current_text.replaceAll(
                            ", " + founded_words[i] + " ",
                            ", " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + button_html_like + button_html_dislike
                        );
                        current_text = current_text.replaceAll(
                            " " + founded_words[i] + ".",
                            " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + ". " + button_html_like + button_html_dislike
                        );
                        current_text = current_text.replaceAll(
                            " " + founded_words[i] + ",",
                            " " + founded_words[i] + trans_html_begin + translations[index] + trans_html_end + ", " + button_html_like + button_html_dislike
                        );
                    }
                    // text[i].textContent = text[i].textContent.replaceAll(
                    //     founded_words[i],
                    //     founded_words[i] + "(edit)"
                    // );
                    // founded_words.splice(i, 1);
                }
                // console.log(current_text);
                text[i].innerHTML = current_text;

            }
        });

        let like_buttons = document.getElementsByClassName("like_button_69420");
        let dislike_buttons = document.getElementsByClassName("dislike_button_69420");
        for (let i = 0; i < like_buttons.length; i++) {
            like_buttons[i].addEventListener("click", function() {
                console.log("like")
                console.log(like_buttons[i].previousSibling.innerHTML)
                    // word regarding to button
                current_word = like_buttons[i].previousSibling.innerHTML
            });
        }
        for (let i = 0; i < dislike_buttons.length; i++) {
            dislike_buttons[i].addEventListener("click", function() {
                console.log("dislike")
                current_word = dislike_buttons[i].previousSibling.previousSibling.innerHTML
                chrome.storage.sync.get("dislike_word_list", ({ dislike_word_list }) => {
                    console.log(dislike_word_list)
                    if (!dislike_word_list.includes(current_word)) {
                        dislike_word_list.push(current_word.toString())
                        chrome.storage.sync.set({ dislike_word_list });
                    }
                });


            });
        }
    })
);
// local url to complete.txt
const URL = chrome.runtime.getURL("complete.txt");

// like button with css code
const LIKE_BUTTON_HTML_TEXT = `<button style="
border: 2px solid rgba(200, 200, 200, 0.1);
width: 15px;
height: 15px;
background-color: rgba(0, 0, 0, 0.1);
border-radius: 50%;
margin: 0px 0px;
padding: 0px 0px;
" class="like_button_69420"></button>`;

// dislike button with css code
const DISLIKE_BUTTON_HTML_TEXT = `<button style="
border: 2px solid rgba(0, 0, 0, 0.1);
width: 15px;
height: 15px;
background-color: rgba(200, 200, 200, 0.1);
border-radius: 50%;
margin: 0px 0px;
padding: 0px 0px;
" class="dislike_button_69420"></button> `;;

raw_text = "";
words = [];
counts = [];
translations = [];
const translate_threshold = 0.0002;
// open the file
fetch(URL).then((response) =>
    response.text().then((output) => {
        raw_text = output;
        // split file in lines
        splitted_text = raw_text.split("\n");

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
                translation_to_add = translation_to_add.substring(0, translation_to_add.length - 1);
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

        for (let i = 0; i < text.length; i++) {
            current_text = text[i].innerHTML;
            for (let i = 0; i < founded_words.length; i++) {
                index = words.indexOf(founded_words[i]);

                if (!(translations[index] === "") && translations[index] && translations[index].length > 0) {
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + " ",
                        " " + founded_words[i] + '|<i>' + translations[index] + "</i> " // + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                    );
                    current_text = current_text.replaceAll(
                        ". " + founded_words[i] + " ",
                        ". " + founded_words[i] + "⟪" + translations[index] + "⟫ " //+ LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                    );
                    current_text = current_text.replaceAll(
                        ", " + founded_words[i] + " ",
                        ", " + founded_words[i] + "⟪" + translations[index] + "⟫" //+ LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                    );
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + ".",
                        " " + founded_words[i] + '|<i>' + translations[index] + "</i>. " //+ LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                    );
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + ",",
                        " " + founded_words[i] + "⟪" + translations[index] + "⟫," //+ LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
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
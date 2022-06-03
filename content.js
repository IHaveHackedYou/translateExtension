const URL = chrome.runtime.getURL("complete.txt");
const LIKE_BUTTON_HTML_TEXT = `<button style="
border: 2px solid;
width: 20px;
height: 20px;
font-size: 80%;
text-align: center;
">✓</button> `;
const DISLIKE_BUTTON_HTML_TEXT = '<button>✗</button> ';
raw_text = "";
words = [];
counts = [];
translations = [];
const translate_threshold = 0.0002;

fetch(URL).then((response) =>
    console.log(
        response.text().then((output) => {
            raw_text = output;
            splitted_text = raw_text.split("\n");

            for (let i = 1; i < splitted_text.length; i++) {
                further_splitted_text = splitted_text[i].split(",")
                count_to_add = further_splitted_text[1];
                if (count_to_add < translate_threshold) {
                    word_to_add = further_splitted_text[2]
                    word_to_add = word_to_add.replace("\r", "")
                    counts.push(count_to_add)
                    words.push(word_to_add.toString());
                    translation_to_add = further_splitted_text[3]
                        // translation_to_add = translation_to_add.replace(" ", "")
                    translation_to_add = translation_to_add.substring(0, translation_to_add.length - 1);
                    translations.push(translation_to_add);
                }
            }
            console.log(counts)

            const text = document.querySelectorAll("p");
            founded_words = [];
            for (let i = 0; i < text.length; i++) {
                text[i].innerHTML.split(" ").forEach((word) => {
                    //console.log(word.toString());
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
                            " " + founded_words[i] + '|<i>' + translations[index] + "</i> " + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                        );
                        current_text = current_text.replaceAll(
                            ". " + founded_words[i] + " ",
                            ". " + founded_words[i] + "⟪" + translations[index] + "⟫" + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                        );
                        current_text = current_text.replaceAll(
                            ", " + founded_words[i] + " ",
                            ", " + founded_words[i] + "⟪" + translations[index] + "⟫" + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                        );
                        current_text = current_text.replaceAll(
                            " " + founded_words[i] + ".",
                            " " + founded_words[i] + '|<i>' + translations[index] + "</i>." + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
                        );
                        current_text = current_text.replaceAll(
                            " " + founded_words[i] + ",",
                            " " + founded_words[i] + "⟪" + translations[index] + "⟫," + LIKE_BUTTON_HTML_TEXT + DISLIKE_BUTTON_HTML_TEXT
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
        })
    )
);
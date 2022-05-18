const url = chrome.runtime.getURL("word_frequency_normalized.txt");

raw_text = "";
words = [];
counts = [];
const translate_threshold = 0.05;

fetch(url).then((response) =>
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
                    current_text = current_text.replaceAll(
                        " " + founded_words[i] + " ",
                        " " + founded_words[i] + " " + "(edit) "
                    );
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
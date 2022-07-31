chrome.storage.sync.get(["dislikeWordList"], ({ dislikeWordList }) => {
  ul = document.createElement("ul");
  ul.className = "dislike-list";
  document.getElementById("listContainer").appendChild(ul);
  for (let word of dislikeWordList) {
    let li = document.createElement("li");
    li.className = "dislike-list";
    li.appendChild(document.createElement("p"));
    li.firstChild.innerText = word;
    img = document.createElement("img");
    img.setAttribute("src", "images/svg/delete_FILL1_wght400_GRAD0_opsz48.svg");
    img.className = "garbage-icon"
    li.appendChild(img);
    ul.appendChild(li);
    img.addEventListener("click", () => {
      dislikeWordList.splice(dislikeWordList.indexOf(word), 1);
      ul.removeChild(li);
      chrome.storage.sync.set({ dislikeWordList });
    });
  }
});

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
    img.setAttribute("src", "images/garbage_icon.svg");
    li.appendChild(img);
    ul.appendChild(li);
    let hr = document.createElement("hr");
    hr.className = "dislike-list";
    ul.appendChild(hr);
    img.addEventListener("click", () => {
      dislikeWordList.splice(dislikeWordList.indexOf(word), 1);
      ul.removeChild(li);
      ul.removeChild(hr);
      chrome.storage.sync.set({ dislikeWordList });
    });
  }
});

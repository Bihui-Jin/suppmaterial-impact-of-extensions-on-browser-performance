'use strict';
const activeTextEl = document.getElementById("activateText");
const activeInputEl = document.getElementById("activateInput");
const activeBtn = document.getElementById("submit");

chrome.storage.local.get("active", data => {
    data.active && redoDOM()
});


activeBtn.addEventListener("click", function (e) {
    let userInput = activeInputEl.value;
    activeInputEl.value = ""
    //save and retrieve and insert code here int activeTextEl.innerText

    sendGetCode(userInput)
});


function sendGetCode(verCode) {
    chrome.runtime.sendMessage({
        message: "from-options",
        payload: verCode
    }, response => {

        if (response.appStatus === "success") {
            redoDOM()
        }
        else {
            activeTextEl.innerText = "activation failed. Input the correct code!"
            activeTextEl.style.color = "red"

        }

    })

}

function redoDOM() {
    activeTextEl.innerText = "extension has been activated!"
    activeTextEl.style.color = "green"
    activeInputEl.remove();
    activeBtn.remove();
    // activeInputEl.style.opacity = 0;
    // activeBtn.style.opacity = 0;
}
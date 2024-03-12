var darkcheck = document.getElementById("darkcheck");

function DefDarkConfig() {
  //document.getElementById("darkcheck") = true;
  chrome.storage.sync.get(["darkcheckstatus"], function (settings) {
    console.log(settings.darkcheckstatus);
    if (settings.darkcheckstatus == false) {
      darkcheck.checked = false;
    } else {
      darkcheck.checked = true;
    }
  });
}

darkcheck.onchange = function changestatus() {
  console.log("changestatus");
  if (darkcheck.checked == true) {
    chrome.storage.sync.set({ darkcheckstatus: true }, function () {});
  } else {
    chrome.storage.sync.set({ darkcheckstatus: false }, function () {});
  }
};
DefDarkConfig();

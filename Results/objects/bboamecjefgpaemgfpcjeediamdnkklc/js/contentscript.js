var keyisdown = false; // Switch
var doubleClick = false;

//////// listen to the Ctrl Key ////////
document.addEventListener(
  "keydown",
  function (event) {
    //console.log(event.key);
    //right click
    if (event.key != "Control") {
      return;
    }

    keyisdown = true;

    setTimeout(function () {
      keyisdown = false;
    }, 450);
  },
  true
);
//////// listen to the Ctrl Key ////////

//////// listen to the left click ////////
document.addEventListener(
  "mousedown",
  function (event) {
    //right click
    if (event.button != 0) {
      return;
    }
    if (keyisdown != true) {
      return;
    }
    Process(event);
  },
  true
);
//////// listen to the left click ////////

//////// listen to the double click ////////
document.addEventListener("mousedown", function (event) {
  // trap only right double click
  if (doubleClick) {
    const DLclick = 0;
    if (event.button != DLclick) {
      return;
    }

    event.preventDefault();
    doubleClick = false;
    //console.log("Double Click Dedected");
    Process(event);
  } else {
    doubleClick = true;

    setTimeout(function () {
      doubleClick = false;
    }, 350);
  }
});
//////// listen to the double click ////////

//////// The Hole Process ////////
function Process(eventos) {
  var translatecl = false;
  var el = eventos.target;
  var parel = el.parentElement;
  var parparel = parel.parentElement;
  //console.log(parparel);

  // In Normal DIV
  for (var n = 0; n < el.classList.length; n++) {
    try {
      //console.log( el.classList[n]);

      if (el.classList[n] == "translate") {
        el.classList.remove("translate");
        translatecl = true;
        window.alert("Orginal Language");
      }
    } catch (err) {
      console.log("Error.");
    }
  }
  // In Normal DIV

  // In Translated DIV
  for (var n = 0; n < parparel.classList.length; n++) {
    try {
      //console.log( parparel.classList[n]);

      if (parparel.classList[n] == "translate") {
        parparel.classList.remove("translate");
        translatecl = true;
        window.alert("Orginal Language");
      }
    } catch (err) {
      console.log("Error.");
    }
  }
  // In Translated DIV

  if (translatecl == false) {
    el.classList.add("translate");
    window.alert("Translated Language");
  }

  //Refresh
  try {
    console.log("Updating");
    var iframe = document.getElementById(":0.container");
    var btn = iframe.contentWindow.document.getElementById(":0.confirm");
    btn.click();
    console.log("Updated");
  } catch (err) {
    console.log("Update failed");
  }
  //Refresh
}
//////// The Hole Process ////////

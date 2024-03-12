function execute_popup_js_script() {
  let mainBlockDiv = document.getElementById('mainBlock');
  let ratingBlockDiv = document.getElementById('ratingBlock');
  let welcomeLabel = document.getElementById('welcome');
  let wrongPersonLabel = document.getElementById('wrongPerson');
  let signInLink = document.getElementById('signIn');
  let signInAltLink = document.getElementById('signInAlt');

  let startAndStopButton = document.getElementById('startAndStop');
  let showEntireBackgroundChkBox = document.getElementById('showEntireBkg');
  let ratingDoneButton = document.getElementById('ratingDone');
  let ratingLaterButton = document.getElementById('ratingLater');

  let thanksMessageText = document.getElementById('thanksMessage');
  let errorOutput = document.getElementById('errorMessage');
  let useremail = '';
  
  getValueFromStorage("showEntireBackground").then(function(value) {
    showEntireBackgroundChkBox.checked = value;
  });
  
  function welcomeGreeting(name) {
    try {
    let greetings = ['Hi!', 'Welcome', 'Hello', '_time', 'Pleasure to see you,', 'Nice to see you,', 
    'Good to see you,', "G’day!", "Hey!", "Hey there,", "What's up?", "Yo!", "How's it going?", 
    "How are you?", "What's new?", "How’s life?", "How’s everything?"]

    let index =  Math.floor(Math.random() * (greetings.length));
    let greet_msg = greetings[index];
    if (greet_msg.endsWith("?")) {
      greet_msg = greet_msg.substr(0, greet_msg.length - 1) + ", " + name + "?"
    }
    else if (greet_msg == '_time') {
      var d = new Date();
      let h = d.getHours(); 
      let m = d.getMinutes(); 
      let s = d.getSeconds(); 
      s = s + m * 60 + h * 3600;
      if (s < 18000) {
        greet_msg = "Enjoying night workouts," + name + "!";
      }
      else if (s <= 43200) {
        greet_msg = "Good Morning, " + name + "!";
      }
      else if (s <= 64800) {
        greet_msg = "Good Afternoon, "+ name + "!";
      }
      else if (s <= 79200) {
        greet_msg = "Good Evening, " + name + "!";
      }
      else {
        greet_msg = "Enjoying night workouts, " + name + "!";
      }
    }
    else {
      greet_msg = greet_msg + " " + name;
    }
    return greet_msg;

    }
    catch(err) {
      printError(err)
    }
  }

  function printError(err) {
    if (typeof err === 'undefined') {
      err = '';
    }
    else if (err instanceof Error) {
      err = err.message;
    }
    errorOutput.innerHTML = err;
  };
 
  async function isItTimeToCaptureRatings() {
    let val= await canCaptureRatingsNow(useremail);
    return val;
  }

  function OnSuccessfulSignIn() {
    showMainBlock();
    isItTimeToCaptureRatings().then(function(value) {
      if (value) {
        showRatingBlock();
      }
    });
  }

  function showRatingBlock() {
    mainBlockDiv.style.display = 'none';
    ratingBlockDiv.style.display = 'block';
    clearError();
  }

  function showMainBlock() {
    mainBlockDiv.style.display = 'block';
    ratingBlockDiv.style.display = 'none';
    clearError();

    let request = {};
    request.type = 'GetVideoCaptureStatus';
    try {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, async function(response) {
          let responseVideoStatus = response.videoStatus;
          if (response.success) {
            while (responseVideoStatus == 'NotReady') {
              startAndStopButton.disabled = true;
              await new Promise(done => setTimeout(() => done(), 500));
              chrome.tabs.sendMessage(tabs[0].id, request, function(r) {
              responseVideoStatus = r.videoStatus;
              });
            }
            startAndStopButton.disabled = false;

            if (responseVideoStatus == 'Started') {
              startAndStopButton.innerText = 'Stop';
            }
            else {
              startAndStopButton.innerText = 'Start';
            }
          }
          else {
            printError(response.error);
          }
        });
      });
    }
    catch(err) {
      printError(err);
      console.log(err);
    }
  }

  function clearError() {
    printError("");
  }

  function SignIn() {
    let request = {};
    request.type = 'SignIn';
    chrome.runtime.sendMessage(request, function(response) {
      if (response.success) {
        if (response.email) {
          useremail = response.email;
          welcomeLabel.innerText = welcomeGreeting(response.firstname);
          welcomeLabel.style.display = 'inline';
          signInLink.style.display = 'none';
          wrongPersonLabel.innerText = 'Not ' + response.firstname + "? ";
          wrongPersonLabel.style.display = 'inline';
          signInAltLink.style.display = 'inline';
          OnSuccessfulSignIn();
        }
        else {
          useremail = '';
          welcomeLabel.style.display = 'none';
          signInLink.style.display = 'inline';
          welcomeLabel.style.display = 'none';
          signInAltLink.style.display = 'none';
        }
      }
      else {
        printError(response.error);
      }
      
    });
  }

  signInLink.addEventListener('click', () => {
    SignIn();
  });

  signInAltLink.addEventListener('click', () => {
    SignIn();
  });

  startAndStopButton.addEventListener('click', () => {
    thanksMessageText.style.display = 'none';
    let request = {};
    if (startAndStopButton.innerText == 'Start') {
      request.type = 'StartVideoCapture';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
          if (response.success) {
            startAndStopButton.innerText = 'Stop';
          }
          else {
            printError(response.error);
          }
        });
      });
    }
    else {
      request.type = 'StopVideoCapture';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
          if (response.success) {
            startAndStopButton.innerText = 'Start';
            setTimeout(function() {
              isItTimeToCaptureRatings().then(function(value) {
                if (value) {
                  showRatingBlock();
                }
              });
            }, 500);
          }
          else {
            printError(response.error);
          }
        });
      });
    }
  });

  showEntireBackgroundChkBox.addEventListener('change', function() {
      setValueToStorage("showEntireBackground", this.checked).then(function(items) {
        let request = {};
        request.type = 'ToggleView';
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
              if (response.success) {
                // nothing to do for now
              }
              else {
                printError(response.error);
              }
            });
          });
      });
    } 
  );

  ratingDoneButton.addEventListener('click', () => {
    try {
      let rating = document.querySelector("input[name=rating]:checked").value;
      thanksMessageText.style.display = 'inline';
      showMainBlock();
      setFeedbackParamsToStorage(useremail, rating);

      // Send rating to google
      let request = {};
      request.type = 'SendRatingAnalyticsData';
      request.email = useremail;
      request.rating = rating;
      chrome.runtime.sendMessage(request, function(response) {
      });
    }
    catch(err) {
      printError("Please select at least one rating value.");
    }
  });
  
  ratingLaterButton.addEventListener('click', () => {
    showMainBlock();
    setFeedbackParamsToStorage(useremail, -1, 0, true);
  });

  document.addEventListener("keypress", function onPress(event) {
    if (event.key === "c" && event.ctrlKey) {
        alert("ctrl+C");
    }
  });

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let request = {};
    request.type = 'GetSigninPersonInfo';
    chrome.tabs.sendMessage(tabs[0].id, request, function(response) { 
      if (response.success) {
        if (response.email) {
          useremail = response.email;
          welcomeLabel.innerText = welcomeGreeting(response.firstname);
          welcomeLabel.style.display = 'inline';
          signInLink.style.display = 'none';
          wrongPersonLabel.innerText = 'Not ' + response.firstname + "? ";
          wrongPersonLabel.style.display = 'inline';
          signInAltLink.style.display = 'inline';
          OnSuccessfulSignIn();
        }
        else {
          useremail = '';
          welcomeLabel.style.display = 'none';
          signInLink.style.display = 'inline';
          welcomeLabel.style.display = 'none';
          signInAltLink.style.display = 'none';
        }
      }
      else {
        welcomeLabel.innerText = 'Some error occurred. Please try later';
        welcomeLabel.style.display = 'inline';
        return;
      }
    });
  });

};

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let request = {};
    request.type = 'PingContentScript';
    chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
      response = response || {};
      if (!response.success) {
        chrome.tabs.executeScript(tabs[0].id, {file: "./opencv.js"}, function() {
          chrome.tabs.executeScript(tabs[0].id, {file: "./tfjs@1.2.js"}, function() {
            chrome.tabs.executeScript(tabs[0].id, {file: "./body-pix@2.0.js"}, function() {
              chrome.tabs.executeScript(tabs[0].id, {file: "./utils.js"}, function() {
                chrome.tabs.executeScript(tabs[0].id, {file: "./content.js"}, function() {
                  execute_popup_js_script();
                });
              });
            });
          });
        });
      }
      else {
        execute_popup_js_script();
      };

    });
  });
});


const defaultObj = {
    showEntireBackground: false,
    signedInUserFirstName: '',
    signedInUserLastName: '',
    signedInUserEmail: '',
    feedback: ''        // Format: useremail;rating;durationSinceLastFeedback;
};

const intra_feedback_seperator = "$&";
const inter_feedback_seperator = "%*";

async function getValueFromStorage(param) {
    var p = new Promise(function(resolve, reject){
        chrome.storage.sync.get(defaultObj, function(items) {
            if (param == "showEntireBackground") {
                resolve(items.showEntireBackground);
            }
            else if (param == "signedInUserFirstName") {
                resolve(items.signedInUserFirstName);
            }
            else if (param == "signedInUserLastName") {
                resolve(items.signedInUserLastName);
            }
            else if (param == "signedInUserEmail") {
                resolve(items.signedInUserEmail);
            }
            else if (param == "signedInUserInfo") {
                resolve({
                    firstname: items.signedInUserFirstName, 
                    lastname: items.signedInUserLastName, 
                    email: items.signedInUserEmail
                });
            }
            else if (param == "feedback") {
                resolve(items.feedback);
            }
            else {
                resolve(undefined);
            }
        });
    });
    return p;
}

async function setValueToStorage(param, value) {
    var p = new Promise(function(resolve, reject){   
        chrome.storage.sync.get(defaultObj, function(items) {
            if (param == "showEntireBackground") {
                items.showEntireBackground = value;
            }
            else if (param == "signedInUserFirstName") {
                items.signedInUserFirstName = value;
            }
            else if (param == "signedInUserLastName") {
                items.signedInUserLastName = value;
            }
            else if (param == "signedInUserEmail") {
                items.signedInUserEmail = value;
            }
            else if (param == "signedInUserInfo") {
                items.signedInUserFirstName = value.firstname;
                items.signedInUserLastName = value.lastname;
                items.signedInUserEmail = value.email;
            }
            else if (param == "feedback") {
                items.feedback = value;
            }
            chrome.storage.sync.set(items, function(items) {
                resolve();
            });
        });
    });
    return p;
}

async function clearStorage() {
    var p = new Promise(function(resolve, reject){   
        chrome.storage.sync.set(defaultObj, function(items) {
            resolve();
        });
    });
    return p;
}

async function canCaptureRatingsNow(email) {
    let feedback = await getValueFromStorage("feedback");   // abc@xyz.com%*-1%*500$&pqr@xyz.com%*5%*700
    let feedback_list = feedback.split(intra_feedback_seperator);   // [abc@xyz.com%*-1%*500, pqr@xyz.com%*5%*700]
    if ((feedback_list.length == 1) && (feedback_list[0].length == 0)) {
        feedback_list = [];
    }
    if (feedback_list.length > 0) {
        for (i = 0, len = feedback_list.length; i < len; i++) {
            let feedback_item = feedback_list[i];   // abc@xyz.com%*-1%*500
            let feedback_item_list = feedback_item.split(inter_feedback_seperator); // [abc@xyz.com, -1, 500]
            if ((feedback_item_list.length == 1) && (feedback_item_list[0].length == 0)) {
                feedback_item_list = [];
            }
            if (feedback_item_list[0] == email) {
                let rating = feedback_item_list[1];
                if (rating > 0) {
                    return false;
                }
                else {
                    let duration = feedback_item_list[2];
                    if (duration > 10 * 60) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                break;
            }
        }
    }
    return false;
}

async function setFeedbackParamsToStorage(email, rating=-1, addDuration=0, resetDuration=false) {
    let feedback = await getValueFromStorage("feedback");
    // Example: abc@xyz.com%*-1%*500$&pqr@xyz.com%*5%*700
    // where %* is inter_feedback_seperator and $& is intra_feedback_seperator
    // Each feedback item consists of 3 subitems: email, rating and video duration in seconds 

    let feedback_list = feedback.split(intra_feedback_seperator);   // [abc@xyz.com%*-1%*500, pqr@xyz.com%*5%*700]
    if ((feedback_list.length == 1) && (feedback_list[0].length == 0)) {
        feedback_list = [];
    }
    let feedbackFoundIndex = -1;
    let feedback_item_list = [];

    if (feedback_list.length > 0) {
        for (i = 0, len = feedback_list.length; i < len; i++) {
            let feedback_item = feedback_list[i];   // abc@xyz.com%*-1%*500
            feedback_item_list = feedback_item.split(inter_feedback_seperator); //  [abc@xyz.com, -1, 500]
            if ((feedback_item_list.length == 1) && (feedback_item_list[0].length == 0)) {
                feedback_item_list = [];
            }
            if (feedback_item_list[0] == email) {
                feedbackFoundIndex = i;
                break;
            }
        }
    }

    addDuration = Math.floor(addDuration);
    if (feedbackFoundIndex < 0) {
        feedback_item_list.push(email);
        feedback_item_list.push(rating);
        if (resetDuration) {
            feedback_item_list.push(0);
        }
        else {
            feedback_item_list.push(addDuration);
        }
        feedback_item_list = feedback_item_list.join(inter_feedback_seperator);
        feedback_list.push(feedback_item_list);
    }
    else {
        if (rating > 0) {
            feedback_item_list[1] = rating;
        }
        else {
            if (resetDuration) {
                feedback_item_list[2] = 0;
            }
            else {
                feedback_item_list[2] = parseInt(feedback_item_list[2]) + addDuration;
            }
        }
        feedback_item_list = feedback_item_list.join(inter_feedback_seperator);
        feedback_list[feedbackFoundIndex] = feedback_item_list;
    }
    feedback_list = feedback_list.join(intra_feedback_seperator);
    setValueToStorage("feedback", feedback_list);
}

function standardDeviation(values) {
    var avg = average(values);
    
    var squareDiffs = values.map(function(value){
      var diff = value - avg;
      var sqrDiff = diff * diff;
      return sqrDiff;
    });
    
    var avgSquareDiff = average(squareDiffs);
  
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
  }
  
  function average(data){
    var sum = data.reduce(function(sum, value){
      return sum + value;
    }, 0);
  
    var avg = sum / data.length;
    return avg;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

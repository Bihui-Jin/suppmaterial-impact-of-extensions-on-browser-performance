(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  
var UNIVERSAL_ACCESS_ID = 'UA-185291582-1';
// Development = UA-185291582-1
// Production = UA-186721159-1
  
function isValidAnalyticsRequest(request) {
  var requestArray = ["SendRatingAnalyticsData", "SendPageViewAnalyticsData", "SendUsageAnalyticsData"];
  return (requestArray.indexOf(request.type) > -1);
}

function analyticsRequestHandler(request, sender, sendResponse) {
  if (request.type == "SendRatingAnalyticsData") {
    ga('create', UNIVERSAL_ACCESS_ID, 'auto');
    ga('set', 'checkProtocolTask', null); // Disables file protocol checking.
    ga('send', {
      'hitType': 'event', 
      'eventCategory': 'aerobi_workout', 
      'eventAction': 'rating', 
      'dimension1': request.email, 
      'dimension2': null, 
      'dimension3': null, 
      'dimension4': null, 
      'dimension5': null, 
      'dimension6': null, 
      'dimension7': parseInt(request.rating), 
      'hitCallback': function () {
        sendResponse({success: true});
      }
    });
    return true;
  }
  else if (request.type == "SendPageViewAnalyticsData") {
    ga('create', UNIVERSAL_ACCESS_ID, 'auto');
    ga('set', 'checkProtocolTask', null); // Disables file protocol checking.
    ga('send', 'pageview', '/popup'); // Set page, avoid 
    sendResponse({success: true});
  }
  else if (request.type == "SendUsageAnalyticsData") {
    ga('create', UNIVERSAL_ACCESS_ID, 'auto');
    ga('set', 'checkProtocolTask', null); // Disables file protocol checking.
    ga('send', {
      'hitType': 'event', 
      'eventCategory': 'aerobi_workout', 
      'eventAction': 'finish', 
      'dimension1': request.email, 
      'dimension2': request.url, 
      'dimension3': request.startDate, 
      'dimension4': request.startTime, 
      'dimension5': request.duration, 
      'dimension6': request.view, 
      'dimension7': null, 
      'hitCallback': function () {
        sendResponse({success: true});
      }
    });
    return true;
  }
  else {
    throw new Error("AnalyticsRequestHandler - Incorrect message request");
  }
}
document.addEventListener("DOMContentLoaded", function() {
    //debugger;
    var queue = {};
    var senderid = {};
    chrome.runtime.onMessage.addListener(function(message, sender) {
        if (message.sendBack) {
            var data = message.data;
            var type = data.type;
            if(type == "iframe") {
                var origin = data.origin;
                var url = data.url;

                queue[url] = origin;
                senderid[url] = sender.tab.id;
                
                //console.log(url);
                var ifrm = document.querySelector("iframe#iframe-daum-media-filter");
                ifrm.setAttribute("src", url);
                //chrome.tabs.sendMessage(sender.tab.id, message.data);
            } else if(type == "loaded") {
                var url = data.url;
                var target = data.target;
                var label = data.label;

                var origin = queue[url];
                var id = senderid[url];

                //console.log("부모창(iframe) : " + label + ", " + origin);
                if(!!id) {
                    //chrome.tabs.sendMessage(id, {label : label});
                    try {
                        var data = {
                            url : url
                            , origin : origin
                            , label : label
                        };

                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                          chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
                            //console.log(response.reveived);
                          });
                        });
                        
                        var ifrm = document.querySelector("iframe#iframe-daum-media-filter");
                        ifrm.setAttribute("src", "about:blank");
                    } catch(e){
                        console.log(e);
                    }
                }
                
                //_g_media_map_cache[href] = label;
            }
        }
    });
    
    
/*    
    chrome.runtime.onConnect.addListener(function(port) {
        console.log("port 1 : " + port.name);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            console.log(response.farewell);
          });
        });
    });
*/
    
/*    
    var iframe = document.querySelector("iframe#iframe-daum-media-filter");
    //debugger;
    iframe.onload = function() {
        //console.log(iframe);
        var url = iframe.getAttribute("src");
        //var url = iframe.contentWindow.location.href;
        console.log("iframe(" + url + ") loaded...");
    }
//    iframe.addEventListener("DOMContentLoaded", function() {
//        var url = iframe.getAttribute("src");
//        //var url = iframe.contentWindow.location.href;
//        console.log("iframe(" + url + ") loaded...");
//    });
*/
});